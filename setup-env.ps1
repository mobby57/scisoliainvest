# Script de configuration initiale des environnements (PowerShell)
# Ce script copie les fichiers .env.example vers .env pour chaque environnement

Write-Host "========================================" -ForegroundColor Blue
Write-Host "Configuration des Environnements" -ForegroundColor Blue
Write-Host "SCI Solia Invest" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Fonction pour copier un fichier exemple
function Setup-EnvFile {
    param(
        [string]$ExampleFile,
        [string]$TargetFile,
        [string]$Description
    )
    
    if (Test-Path $ExampleFile) {
        if (Test-Path $TargetFile) {
            Write-Host "⚠️  $Description existe déjà, ignoré" -ForegroundColor Yellow
        } else {
            Copy-Item $ExampleFile $TargetFile
            Write-Host "✅ $Description créé" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️  Fichier exemple non trouvé: $ExampleFile" -ForegroundColor Yellow
    }
}

# Configuration API Backend
Write-Host "Configuration API Backend..." -ForegroundColor Blue
Setup-EnvFile "packages/api/.env.example" "packages/api/.env" "packages/api/.env"
Setup-EnvFile "packages/api/.env.staging.example" "packages/api/.env.staging" "packages/api/.env.staging"

# Configuration Frontend
Write-Host "Configuration Frontend..." -ForegroundColor Blue
Setup-EnvFile "frontend/.env.staging.example" "frontend/.env.staging" "frontend/.env.staging"

# Configuration Docker Compose Staging
Write-Host "Configuration Docker Compose..." -ForegroundColor Blue
Setup-EnvFile ".env.staging.example" ".env.staging" ".env.staging (pour docker-compose)"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Configuration terminée !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Blue
Write-Host ""
Write-Host "1. Modifiez les fichiers .env avec vos valeurs:"
Write-Host "   - packages/api/.env (développement)"
Write-Host "   - packages/api/.env.staging (staging)"
Write-Host "   - frontend/.env.staging (staging)"
Write-Host ""
Write-Host "2. Lancez l'environnement souhaité:"
Write-Host "   - Développement: .\start-env.ps1 -Environment dev -Command start"
Write-Host "   - Staging: .\start-env.ps1 -Environment staging -Command start"
Write-Host ""
Write-Host "3. Consultez la documentation:"
Write-Host "   - ENVIRONMENT_GUIDE.md"
Write-Host "   - QUICK_START_STAGING.md"
Write-Host "   - QUAND_FAIRE_ESSAIS.md"
Write-Host ""
