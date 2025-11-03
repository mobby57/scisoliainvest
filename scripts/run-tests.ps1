param(
    [string]$TestType = "all",
    [switch]$Coverage = $false
)

$ErrorActionPreference = "Stop"
$BaseDir = Split-Path -Parent $PSScriptRoot

function Log-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Green
}

function Log-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

function Test-ServiceHealth {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

function Run-ApiUnitTests {
    Log-Info "Tests unitaires API..."
    Push-Location "$BaseDir\packages\api"
    npm run test
    if ($LASTEXITCODE -ne 0) { exit 1 }
    Pop-Location
}

function Run-ClientUnitTests {
    Log-Info "Tests unitaires Client..."
    Push-Location "$BaseDir\packages\client"
    npm run test:unit
    if ($LASTEXITCODE -ne 0) { exit 1 }
    Pop-Location
}

function Run-DatabaseTests {
    Log-Info "Tests base de données..."
    Push-Location "$BaseDir\packages\api"
    npm run test -- tests/database.test.ts
    if ($LASTEXITCODE -ne 0) { exit 1 }
    Pop-Location
}

Log-Info "🚀 Démarrage des tests SCI Solia Invest..."

switch ($TestType.ToLower()) {
    "unit" {
        Run-ApiUnitTests
        Run-ClientUnitTests
    }
    "database" {
        Run-DatabaseTests
    }
    "all" {
        Run-ApiUnitTests
        Run-ClientUnitTests
        Run-DatabaseTests
    }
    default {
        Log-Error "Type non reconnu: $TestType"
        exit 1
    }
}

Log-Info "✅ Tests terminés avec succès!"