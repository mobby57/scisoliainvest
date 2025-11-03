Param(
  [switch]$Yes,
  [switch]$RunTests
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$envExamplePath = Join-Path $root "..\.env.example"
$envPath = Join-Path $root "..\.env"

# Check if .env.example exists
if (-not (Test-Path $envExamplePath)) {
  Write-Error ".env.example not found at $envExamplePath"
  exit 1
}

# Create .env from .env.example if it doesn't exist
if (-not (Test-Path $envPath)) {
  Write-Host "Creating .env from .env.example"
  Copy-Item $envExamplePath $envPath
} else {
  Write-Host ".env already exists — we'll update variables in it."
}

# Generate secure random hex strings
function Generate-SecretHex {
  param([int]$bytes = 48)
  
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $buffer = New-Object byte[] $bytes
  $rng.GetBytes($buffer)
  $rng.Dispose()
  return ([System.BitConverter]::ToString($buffer) -replace '-','').ToLower()
}

# Replace or append key=value in .env
function Set-EnvVar {
  param([string]$key, [string]$value)
  
  $content = Get-Content $envPath
  $pattern = "^$key="
  $newLine = "$key=$value"
  
  if ($content -match $pattern) {
    $content = $content -replace $pattern + ".*", $newLine
  } else {
    $content += $newLine
  }
  
  $content | Set-Content $envPath
}

Write-Host "Generating secrets..."
$jwtSecret = Generate-SecretHex 48
$jwtRefreshSecret = Generate-SecretHex 48
$csrfSecret = Generate-SecretHex 32
$testSecret = Generate-SecretHex 32

Write-Host ""
Write-Host "Secrets to write to .env:"
Write-Host "  JWT_SECRET:        (hidden, length $($jwtSecret.Length))"
Write-Host "  JWT_REFRESH_SECRET:(hidden, length $($jwtRefreshSecret.Length))"
Write-Host "  CSRF_SECRET:       (hidden, length $($csrfSecret.Length))"
Write-Host "  TEST_SECRET:       (hidden, length $($testSecret.Length))"
Write-Host ""

if (-not $Yes) {
  $response = Read-Host "Proceed to write/update these values into .env? (y/N)"
  if ($response -ne 'y' -and $response -ne 'Y') {
    Write-Host "Aborted by user."
    exit 0
  }
}

# Write secrets to .env
Set-EnvVar "JWT_SECRET" $jwtSecret
Set-EnvVar "JWT_REFRESH_SECRET" $jwtRefreshSecret
Set-EnvVar "CSRF_SECRET" $csrfSecret
Set-EnvVar "TEST_SECRET" $testSecret

Write-Host ".env updated."

# Show inserted variables (without revealing secrets)
Write-Host "Inserted/updated variables:"
Get-Content $envPath | Where-Object { $_ -match '^(JWT_SECRET|JWT_REFRESH_SECRET|CSRF_SECRET|TEST_SECRET)=' }

if ($RunTests) {
  Write-Host "Running jwtMock unit tests (Vitest). This uses TEST_SECRET from .env."
  $env:TEST_SECRET = $testSecret
  
  if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Error "npx not found in PATH. Please install Node.js/npm or run the tests manually."
    exit 1
  }
  
  npx vitest run packages/api/src/tests/utils/jwtMock.test.ts --reporter=summary
  Write-Host "If focused tests passed, run the full API tests: pnpm --filter api test  OR npx vitest run packages/api --reporter=summary"
}

Write-Host "Done. Remember: do not commit .env to git. Add or ensure .env is in .gitignore."