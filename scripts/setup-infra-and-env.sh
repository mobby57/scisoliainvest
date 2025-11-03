#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/setup-infra-and-env.sh        # interactive
#   ./scripts/setup-infra-and-env.sh --yes  # non-interactive
#   ./scripts/setup-infra-and-env.sh --yes --run-tests
#
# Behavior:
# - generates all secrets (JWT, CSRF, DB credentials) and updates .env
# - starts docker_compose.dev.yml (falls back to docker-compose.yml)
# - waits for Postgres and Mongo to be ready
# - runs prisma generate/migrate/seed and Mongo seed (if scripts exist)
# - optional: run tests (--run-tests)

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"
ENV_EXAMPLE="$REPO_ROOT/.env.example"

AUTO_YES=0
RUN_TESTS=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --yes|-y) AUTO_YES=1; shift ;;
    --run-tests) RUN_TESTS=1; shift ;;
    --help|-h) echo "Usage: $0 [--yes] [--run-tests]"; exit 0 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# Ensure .env exists
if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -f "$ENV_EXAMPLE" ]]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    echo "Created .env from .env.example"
  else
    touch "$ENV_FILE"
    echo "Created empty .env"
  fi
else
  echo ".env exists — will update variables."
fi

# Helper to generate secure hex secret
generate_secret_hex() {
  local bytes=${1:-48}
  if command -v node >/dev/null 2>&1; then
    node -e "console.log(require('crypto').randomBytes($bytes).toString('hex'))"
  elif command -v openssl >/dev/null 2>&1; then
    openssl rand -hex $bytes
  else
    head -c $bytes /dev/urandom | sha256sum | awk '{print $1}'
  fi
}

# Modify or append key in .env
set_env_var() {
  local key="$1"
  local val="$2"
  local file="$ENV_FILE"
  # escape slashes for sed
  local esc
  esc=$(printf '%s' "$val" | sed -e 's/[\/&]/\\&/g')
  if grep -q -E "^${key}=" "$file"; then
    sed -i.bak -E "s/^${key}=.*/${key}=${esc}/" "$file" && rm -f "${file}.bak"
  else
    echo "${key}=${val}" >> "$file"
  fi
}

# Generate all secrets
echo "Generating secrets..."
JWT_SECRET="$(generate_secret_hex 48)"
JWT_REFRESH_SECRET="$(generate_secret_hex 48)"
CSRF_SECRET="$(generate_secret_hex 32)"
TEST_SECRET="$(generate_secret_hex 32)"

PG_USER="solia_pg"
PG_PASS="$(generate_secret_hex 24)"
PG_DB="scisolia_dev"

MONGO_ROOT_USER="solia_mongo"
MONGO_ROOT_PASS="$(generate_secret_hex 24)"
MONGO_DB="scisolia_mongo"

REDIS_PASS="$(generate_secret_hex 16)"

# Ask user to confirm (unless auto)
cat <<EOF

I will write/update these variables in $ENV_FILE:

Application secrets:
  JWT_SECRET, JWT_REFRESH_SECRET, CSRF_SECRET, TEST_SECRET (hidden)

Database credentials:
  Postgres: $PG_USER / (hidden) / $PG_DB
  Mongo: $MONGO_ROOT_USER / (hidden) / $MONGO_DB
  Redis: (hidden password)

Connection URLs will be set for localhost:5432, localhost:27017, localhost:6379

EOF

if [[ $AUTO_YES -ne 1 ]]; then
  read -r -p "Proceed? (y/N) " yn
  case "$yn" in
    [Yy]* ) ;;
    *) echo "Aborted"; exit 0 ;;
  esac
fi

# Write all secrets to .env
set_env_var "JWT_SECRET" "$JWT_SECRET"
set_env_var "JWT_REFRESH_SECRET" "$JWT_REFRESH_SECRET"
set_env_var "CSRF_SECRET" "$CSRF_SECRET"
set_env_var "TEST_SECRET" "$TEST_SECRET"

# Write container init envs
set_env_var "POSTGRES_USER" "$PG_USER"
set_env_var "POSTGRES_PASSWORD" "$PG_PASS"
set_env_var "POSTGRES_DB" "$PG_DB"

set_env_var "MONGO_INITDB_ROOT_USERNAME" "$MONGO_ROOT_USER"
set_env_var "MONGO_INITDB_ROOT_PASSWORD" "$MONGO_ROOT_PASS"
set_env_var "MONGO_INITDB_DATABASE" "$MONGO_DB"

set_env_var "REDIS_PASSWORD" "$REDIS_PASS"

echo ".env updated with all secrets and DB credentials."

# Find compose file
COMPOSE_FILE=""
for file in "docker_compose.dev.yml" "docker-compose.dev.yml" "docker_compose.yml" "docker-compose.yml"; do
  if [[ -f "$REPO_ROOT/$file" ]]; then
    COMPOSE_FILE="$REPO_ROOT/$file"
    break
  fi
done

if [[ -z "$COMPOSE_FILE" ]]; then
  echo "No docker-compose file found. Please start your DB services manually."
  exit 1
fi

echo "Using compose file: $COMPOSE_FILE"

# Start infrastructure
echo "Starting docker compose services..."
docker compose -f "$COMPOSE_FILE" up -d

# Wait helpers
wait_for_postgres() {
  local host="127.0.0.1"
  local port="${1:-5432}"
  echo "Waiting for Postgres on ${host}:${port}..."
  for i in {1..60}; do
    if command -v pg_isready >/dev/null 2>&1; then
      if pg_isready -h "$host" -p "$port" >/dev/null 2>&1; then
        echo "Postgres ready"
        return 0
      fi
    elif command -v psql >/dev/null 2>&1; then
      if PGPASSWORD="$PG_PASS" psql -h "$host" -p "$port" -U "$PG_USER" -d "$PG_DB" -c '\q' >/dev/null 2>&1; then
        echo "Postgres ready (psql)"
        return 0
      fi
    elif command -v nc >/dev/null 2>&1; then
      if nc -z "$host" "$port" >/dev/null 2>&1; then
        echo "Postgres port open"
        return 0
      fi
    fi
    sleep 1
  done
  echo "Timeout waiting for Postgres"
  return 1
}

wait_for_mongo() {
  local host="127.0.0.1"
  local port="${1:-27017}"
  echo "Waiting for Mongo on ${host}:${port}..."
  for i in {1..60}; do
    if command -v nc >/dev/null 2>&1; then
      if nc -z "$host" "$port" >/dev/null 2>&1; then
        echo "Mongo ready"
        return 0
      fi
    fi
    sleep 1
  done
  echo "Timeout waiting for Mongo"
  return 1
}

# Wait for services
wait_for_postgres 5432 || echo "Warning: Postgres may not be ready"
wait_for_mongo 27017 || echo "Warning: Mongo may not be ready"

# Build connection strings
DATABASE_URL="postgresql://${PG_USER}:${PG_PASS}@localhost:5432/${PG_DB}?schema=public"
PRISMA_DATABASE_URL="$DATABASE_URL"
MONGO_URI="mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASS}@localhost:27017/${MONGO_DB}?authSource=admin"
REDIS_URL="redis://:${REDIS_PASS}@localhost:6379"

set_env_var "DATABASE_URL" "$DATABASE_URL"
set_env_var "PRISMA_DATABASE_URL" "$PRISMA_DATABASE_URL"
set_env_var "MONGO_URI" "$MONGO_URI"
set_env_var "REDIS_URL" "$REDIS_URL"

echo "Connection strings written to .env."

# Run Prisma operations
if [[ -f "$REPO_ROOT/packages/api/prisma/schema.prisma" ]]; then
  echo "Running Prisma generate and migrate..."
  (cd "$REPO_ROOT/packages/api" && npx prisma generate --schema=prisma/schema.prisma)
  (cd "$REPO_ROOT/packages/api" && npx prisma migrate dev --schema=prisma/schema.prisma --name init || true)
  
  # Run Prisma seed if available
  if [[ -f "$REPO_ROOT/packages/api/prisma/seed.ts" ]] || grep -q "prisma db seed" "$REPO_ROOT/packages/api/package.json" 2>/dev/null; then
    echo "Running Prisma seed..."
    (cd "$REPO_ROOT/packages/api" && npx prisma db seed || true)
  fi
else
  echo "No Prisma schema found - skipping Prisma steps."
fi

# Run Mongo seed if available
if [[ -f "$REPO_ROOT/packages/api/package.json" ]]; then
  if grep -q '"seed"' "$REPO_ROOT/packages/api/package.json"; then
    echo "Running Mongo seed script..."
    (cd "$REPO_ROOT/packages/api" && npm run seed || true)
  fi
fi

echo "Infrastructure setup complete!"

# Optional tests
if [[ $RUN_TESTS -eq 1 ]]; then
  echo "Running JWT tests with TEST_SECRET from .env..."
  export TEST_SECRET="$TEST_SECRET"
  (cd "$REPO_ROOT" && npx vitest run packages/api/src/tests/utils/jwtMock.test.ts --reporter=summary)
  echo "Run full tests with: pnpm --filter api test"
fi

echo "Done. Remember: do not commit .env to git."