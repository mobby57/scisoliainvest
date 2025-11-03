#!/usr/bin/env bash
# scripts/check-and-add-ports.sh
# Recherche ports plausibles dans fichiers pertinents (exclut venv, node_modules, .git)
# Propose d'ajouter les ports manquants dans .env.example (interactive)
set -euo pipefail

REPO_ROOT="$(pwd)"
ENV_CANDIDATES=( ".env.example" "packages/api/.env.example" "packages/client/.env.example" ".env" "packages/api/.env" )
# Files to scan (extensions/patterns)
read -r -d '' FILE_PATTERNS <<'PAT'
*.js
*.ts
*.json
*.yml
*.yaml
.env*
Dockerfile
docker-compose*.yml
package.json
PAT

# Exclude dirs
EXCLUDE_DIRS=( "./venv" "./.venv" "./node_modules" "./.git" )

AUTO_ADD=0
if [[ "${1:-}" == "--yes" ]]; then
  AUTO_ADD=1
fi

# Build find -path exclusions
EXPR=""
for d in "${EXCLUDE_DIRS[@]}"; do
  EXPR="$EXPR -not -path \"$d/*\""
done

# Use a temporary file
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

# Find files matching patterns (excluding excluded dirs)
FILES=()
while IFS= read -r -d $'\0' f; do
  FILES+=("$f")
done < <(find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name ".env*" -o -name "Dockerfile" -o -name "docker-compose*.yml" -o -name "package.json" \) \
  \( -path "./venv" -o -path "./.venv" -o -path "./node_modules" -o -path "./.git" \) -prune -o -print0)

# If find produced nothing, exit gracefully
if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "Aucun fichier pertinent trouvé pour l'analyse (après exclusions)."
  exit 0
fi

# Check if grep supports PCRE (-P) for a safer regex (to avoid 0x... captures)
GREP_P_OK=0
if grep -P "" /dev/null 2>/dev/null; then GREP_P_OK=1; fi

# Pattern: match either "PORT=1234", "VITE_PORT=1234", ":1234", " 1234" after ":" or "="
# Avoid capturing numbers immediately preceded by '0x' using negative lookbehind when available.
if [[ $GREP_P_OK -eq 1 ]]; then
  # -P available: use negative lookbehind to exclude hex '0xNNN:'
  for f in "${FILES[@]}"; do
    grep -nHP "(?<!0x)(?:[:=]\s*|PORT[_A-Z]*=|VITE[_A-Z]*=)([0-9]{2,5})" "$f" 2>/dev/null || true
  done | sed -En 's/.*([0-9]{2,5}).*/\1/p' | sort -n -u > "$TMP"
else
  # Fallback: simpler extraction (may include some noise)
  for f in "${FILES[@]}"; do
    grep -nE "[:=]\s*[0-9]{2,5}" "$f" 2>/dev/null || true
  done | sed -En 's/.*([0-9]{2,5}).*/\1/p' | sort -n -u > "$TMP"
fi

if [[ ! -s "$TMP" ]]; then
  echo "Aucun port plausible détecté dans les fichiers scannés."
  exit 0
fi

echo "Ports détectés (bruts) :"
cat "$TMP"

# Read existing ports in candidate env files (if any)
EXISTING=""
for ef in "${ENV_CANDIDATES[@]}"; do
  if [[ -f "$ef" ]]; then
    grep -Eo "[0-9]{2,5}" "$ef" | sort -n -u || true
    EXISTING+=" $(grep -Eo "[0-9]{2,5}" "$ef" 2>/dev/null | sort -n -u | tr '\n' ' ' || true)"
  fi
done

# Normalize EXISTING into an array/set
declare -A EXIST_MAP
for num in $EXISTING; do EXIST_MAP["$num"]=1; done

# Build missing list
MISSING=()
while read -r p; do
  [[ -z "$p" ]] && continue
  if [[ -z "${EXIST_MAP[$p]:-}" ]]; then
    MISSING+=( "$p" )
  fi
done < "$TMP"

if [[ ${#MISSING[@]} -eq 0 ]]; then
  echo "Aucun port manquant ; tout est déjà présent dans les fichiers .env / .env.example trouvés."
  exit 0
fi

echo
echo "Ports détectés MAIS non présents dans .env(.example):"
for p in "${MISSING[@]}"; do echo "  - $p"; done

# Choose target env file (first existing .env.example or fallback to .env.example root)
TARGET=""
for ef in "${ENV_CANDIDATES[@]}"; do
  if [[ -f "$ef" ]]; then TARGET="$ef"; break; fi
done
if [[ -z "$TARGET" ]]; then TARGET=".env.example"; touch "$TARGET"; fi

echo
echo "Fichier cible pour ajout : $TARGET"

add_entry() {
  local port=$1
  local comment="# auto-added $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  echo "" >> "$TARGET"
  echo "# Port automatique ajouté: $port $comment" >> "$TARGET"
  echo "PORT_${port}=${port} # $comment" >> "$TARGET"
}

if [[ $AUTO_ADD -eq 1 ]]; then
  for p in "${MISSING[@]}"; do add_entry "$p"; echo "ajouté: PORT_${p}=${p}"; done
  echo "Terminé (ajout automatique)."
  exit 0
fi

# Interactive
for p in "${MISSING[@]}"; do
  while true; do
    read -r -p "Ajouter PORT_${p}=${p} dans $TARGET ? [Y/n] " ans
    case "$ans" in
      ""|"y"|"Y") add_entry "$p"; echo "ajouté $p"; break;;
      "n"|"N") echo "ignoré $p"; break;;
      *) echo "Réponse invalide. Y/n";;
    esac
  done
done

echo "Terminé. Vérifie $TARGET pour les ajouts."
