#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/setup-env.sh           # interactive (shows values, asks to confirm)
#   ./scripts/setup-env.sh --yes     # non-interactive, overwrite/add variables
#   ./scripts/setup-env.sh --yes --run-tests   # also run jwt util tests afterwards
#   ./scripts/setup-env.sh --dry-run # preview changes without writing
#
# Notes:
# - Designed for bash.exe / Git Bash on Windows and Linux/macOS.
# - Requires node or openssl to generate secure random secrets.
# - Do not commit the generated .env.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_EXAMPLE="$REPO_ROOT/.env.example"
ENV_FILE="$REPO_ROOT/.env"

PRINT_HELP=0
AUTO_YES=0
RUN_TESTS=0
DRY_RUN=0

# Logging function
log() {
  echo "[$(date +'%H:%M:%S')] $*"
}

# Error logging
log_error() {
  echo "[ERROR] $*" >&2
}

# Cleanup function
cleanup() {
  unset JWT_SECRET_VAL JWT_REFRESH_SECRET_VAL CSRF_SECRET_VAL TEST_SECRET_VAL 2>/dev/null || true
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --yes|-y) AUTO_YES=1; shift ;;
    --run-tests) RUN_TESTS=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --help|-h) PRINT_HELP=1; shift ;;
    *) log_error "Unknown arg: $1"; PRINT_HELP=1; shift ;;
  esac
done

# Set trap for cleanup
trap cleanup EXIT

if [[ $PRINT_HELP -eq 1 ]]; then
  sed -n '1,200p' "$0"
  exit 0
fi

# Validate paths
if [[ "$REPO_ROOT" =~ [\;\&\|\`] ]]; then
  log_error "Invalid characters in repository path"
  exit 1
fi

if [[ ! -f "$ENV_EXAMPLE" ]]; then
  log_error ".env.example not found at $ENV_EXAMPLE"
  exit 1
fi

# Backup existing .env if it exists
if [[ -f "$ENV_FILE" && $DRY_RUN -eq 0 ]]; then
  log "Backing up existing .env to .env.backup"
  cp "$ENV_FILE" "${ENV_FILE}.backup"
fi

# Ensure there is an .env file
if [[ ! -f "$ENV_FILE" ]]; then
  if [[ $DRY_RUN -eq 0 ]]; then
    log "Creating $ENV_FILE from $ENV_EXAMPLE"
    cp "$ENV_EXAMPLE" "$ENV_FILE"
  else
    log "[DRY-RUN] Would create $ENV_FILE from $ENV_EXAMPLE"
  fi
else
  log "$ENV_FILE already exists — we'll update variables in it."
fi

# Check dependencies
check_dependencies() {
  if command -v node >/dev/null 2>&1; then
    return 0
  elif command -v openssl >/dev/null 2>&1; then
    return 0
  elif command -v xxd >/dev/null 2>&1 && [[ -r /dev/urandom ]]; then
    return 0
  else
    log_error "No suitable crypto tool found (node, openssl, or xxd+/dev/urandom)"
    return 1
  fi
}

# Secret generation helper: prefer node (portable), else openssl, else /dev/urandom fallback
generate_secret_hex() {
  local bytes=${1:-48}
  local secret
  
  if command -v node >/dev/null 2>&1; then
    secret=$(node -e "console.log(require('crypto').randomBytes($bytes).toString('hex'))")
  elif command -v openssl >/dev/null 2>&1; then
    secret=$(openssl rand -hex $bytes)
  else
    # fallback (less ideal): use /dev/urandom and xxd if available
    if command -v xxd >/dev/null 2>&1; then
      secret=$(head -c $bytes /dev/urandom | xxd -p -c $bytes)
    else
      # ugly fallback: use date+rand, not cryptographically strong
      log_error "Warning: Using weak random generation"
      secret=$(echo "$(date +%s)-$RANDOM" | sha256sum | awk '{print $1}')
    fi
  fi
  
  # Validate secret length
  if [[ ${#secret} -lt $((bytes * 2)) ]]; then
    log_error "Generated secret too short"
    return 1
  fi
  
  echo "$secret"
}

# Replace or append key=value in .env (portable-ish)
set_env_var() {
  local key="$1"
  local value="$2"
  
  if [[ $DRY_RUN -eq 1 ]]; then
    log "[DRY-RUN] Would set ${key}=<hidden>"
    return 0
  fi
  
  # escape for sed (use | as delimiter)
  local esc_value
  esc_value=$(printf '%s' "$value" | sed -e 's/[&/\]/\\&/g')
  
  if grep -q -E "^${key}=" "$ENV_FILE"; then
    # Use sed -i with backup for portability, then remove backup
    if sed -i.bak -E "s|^${key}=.*|${key}=${esc_value}|" "$ENV_FILE"; then
      rm -f "${ENV_FILE}.bak"
    else
      log_error "Failed to update ${key}"
      return 1
    fi
  else
    echo "${key}=${value}" >> "$ENV_FILE"
  fi
}

# Check dependencies first
if ! check_dependencies; then
  exit 1
fi

# Generate secrets (48 bytes hex for JWTs, 32 for CSRF)
log "Generating secrets..."
JWT_SECRET_VAL="$(generate_secret_hex 48)" || { log_error "Failed to generate JWT_SECRET"; exit 1; }
JWT_REFRESH_SECRET_VAL="$(generate_secret_hex 48)" || { log_error "Failed to generate JWT_REFRESH_SECRET"; exit 1; }
CSRF_SECRET_VAL="$(generate_secret_hex 32)" || { log_error "Failed to generate CSRF_SECRET"; exit 1; }
TEST_SECRET_VAL="$(generate_secret_hex 32)" || { log_error "Failed to generate TEST_SECRET"; exit 1; }

# Set Redis URL (default to local Redis, can be overridden)
REDIS_URL_VAL="redis://127.0.0.1:6379"

cat <<EOF

Secrets to write to $ENV_FILE:
  JWT_SECRET:        (hidden, length ${#JWT_SECRET_VAL})
  JWT_REFRESH_SECRET:(hidden, length ${#JWT_REFRESH_SECRET_VAL})
  CSRF_SECRET:       (hidden, length ${#CSRF_SECRET_VAL})
  TEST_SECRET:       (hidden, length ${#TEST_SECRET_VAL})
  REDIS_URL:         ${REDIS_URL_VAL}

Note: Set REDIS_URL="" or DISABLE_REDIS=true to disable Redis and use in-memory cache.

EOF

if [[ $AUTO_YES -ne 1 && $DRY_RUN -ne 1 ]]; then
  read -r -p "Proceed to write/update these values into $ENV_FILE ? (y/N) " yn
  case "$yn" in
    [Yy]* ) ;;
    * ) log "Aborted by user."; exit 0 ;;
  esac
fi

# Write into env
set_env_var "JWT_SECRET" "$JWT_SECRET_VAL"
set_env_var "JWT_REFRESH_SECRET" "$JWT_REFRESH_SECRET_VAL"
set_env_var "CSRF_SECRET" "$CSRF_SECRET_VAL"
set_env_var "TEST_SECRET" "$TEST_SECRET_VAL"
set_env_var "REDIS_URL" "$REDIS_URL_VAL"

if [[ $DRY_RUN -eq 1 ]]; then
  log "[DRY-RUN] No files were modified"
else
  log ".env updated."
  
  # Set secure permissions
  chmod 600 "$ENV_FILE" 2>/dev/null || log "Warning: Could not set secure permissions on .env"
  
  # Optional: show the lines inserted (but DO NOT print secrets raw)
  log "Inserted/updated variables:"
  grep -E '^(JWT_SECRET|JWT_REFRESH_SECRET|CSRF_SECRET|TEST_SECRET)=' "$ENV_FILE" | sed 's/=.*/=<hidden>/' || true
  grep -E '^REDIS_URL=' "$ENV_FILE" || true
fi

# Run tests optionally
if [[ $RUN_TESTS -eq 1 && $DRY_RUN -ne 1 ]]; then
  log "Running jwtMock unit tests (Vitest). This uses TEST_SECRET from .env."
  # export TEST_SECRET for this shell session (Vitest setup might read from process.env)
  export TEST_SECRET="$TEST_SECRET_VAL"
  # Ensure pnpm/node available
  if ! command -v npx >/dev/null 2>&1; then
    log_error "npx not found in PATH. Please install Node.js/npm or run the tests manually."
    exit 1
  fi

  # Run focused test (faster)
  if npx vitest run packages/api/src/tests/utils/jwtMock.test.ts --reporter=verbose; then
    log "Tests passed successfully"
  else
    log_error "Tests failed"
    exit 1
  fi
  log "If focused tests passed, run the full API tests: pnpm --filter api test  OR npx vitest run packages/api --reporter=verbose"
fi

log "Done. Remember: do not commit .env to git. Add or ensure .env is in .gitignore."