#!/usr/bin/env bash
# scripts/extract-ports-and-services.sh
# Extrait les ports plausibles et produit un JSON utile (fichier, line, port, extrait, heuristic_service)
set -euo pipefail

TMP_IN="$(mktemp)"
TMP_OUT="$(mktemp)"
trap 'rm -f "$TMP_IN" "$TMP_OUT"' EXIT

# find files of interest, exclude heavy/noisy dirs
find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name ".env*" -o -name "Dockerfile" -o -name "docker-compose*.yml" -o -name "package.json" \) \
  -not -path "./venv/*" -not -path "./.venv/*" -not -path "./node_modules/*" -not -path "./.git/*" -print0 \
  | xargs -0 -r grep -HnE "(mongodb://[^:]+:[0-9]{2,5}|postgresql?://[^:]+:[0-9]{2,5}|PORT[_A-Z0-9]*=|VITE[_A-Z0-9]*=|[:=]\s*[0-9]{2,5}|\"[0-9]{2,5}\"|[0-9]{2,5}:[0-9]{2,5})" 2>/dev/null > "$TMP_IN" || true

if [[ ! -s "$TMP_IN" ]]; then
  echo "Aucun match trouvé. (exclu venv/node_modules/.git)."
  exit 0
fi

# Use python to parse lines and produce JSON
python - <<'PY' "$TMP_IN" "$TMP_OUT"
import sys, re, json
infile = sys.argv[1]
outfile = sys.argv[2]
records = []
pat_num = re.compile(r'(?<!0x)(?<!0X)(?<![A-Fa-f0-9])([0-9]{2,5})(?![A-Fa-f0-9])')
with open(infile, 'r', encoding='utf-8', errors='ignore') as f:
    for raw in f:
        line = raw.rstrip("\n")
        # file:path:lineno:content  (grep -Hn format)
        # split only first 3 ':'
        parts = line.split(':', 3)
        if len(parts) >= 4:
            file_path = parts[0]
            lineno = parts[1]
            rest = parts[3]
        else:
            # fallback
            file_path = parts[0] if parts else ""
            lineno = parts[1] if len(parts) > 1 else ""
            rest = parts[-1] if parts else ""
        # find all candidate numbers on the content part
        nums = pat_num.findall(rest)
        for n in nums:
            nint = int(n)
            # basic port range check
            if 1 <= nint <= 65535:
                # heuristic service detection
                lower = rest.lower()
                if 'mongodb' in lower or 'mongo' in lower:
                    svc = 'mongodb'
                elif 'postgres' in lower or 'postgresql' in lower or 'psql' in lower:
                    svc = 'postgres'
                elif 'vite' in lower or 'vite_port' in lower:
                    svc = 'vite'
                elif 'redis' in lower:
                    svc = 'redis'
                elif 'smtp' in lower or 'mailhog' in lower or 'smtp' in file_path.lower():
                    svc = 'smtp'
                elif re.search(r'listen\\(|app\\.listen|server\\.listen', rest):
                    svc = 'api-listen'
                elif re.search(r'[0-9]{2,5}:[0-9]{2,5}', rest):
                    svc = 'docker-port-mapping'
                else:
                    svc = 'unknown'
                records.append({
                    "file": file_path,
                    "lineno": lineno,
                    "port": nint,
                    "line": rest.strip(),
                    "service_guess": svc
                })
# Remove duplicates (same file, lineno, port)
unique = []
seen = set()
for r in records:
    key = (r['file'], r['lineno'], r['port'])
    if key not in seen:
        seen.add(key)
        unique.append(r)
with open(outfile, 'w', encoding='utf-8') as o:
    json.dump(unique, o, indent=2, ensure_ascii=False)
print(outfile)
PY

# Print the JSON
cat "$TMP_OUT"
