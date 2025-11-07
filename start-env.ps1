# Script de gestion des environnements SCI Solia Invest (PowerShell)
# Usage: .\start-env.ps1 -Environment dev -Command start

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'development', 'staging', 'stage', 'prod', 'production')]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet('start', 'stop', 'restart', 'logs', 'status', 'build', 'clean')]
    [string]$Command = 'start'
)

# Fonctions d'affichage coloré
function Write-Header {
    param([string]$Message)
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

# Déterminer le fichier docker-compose et les URLs
$ComposeFile = ""
$EnvName = ""
$FrontendUrl = ""
$BackendUrl = ""

switch ($Environment) {
    {$_ -in 'dev', 'development'} {
        $ComposeFile = "docker-compose.dev.yml"
        $EnvName = "Développement"
        $FrontendUrl = "http://localhost:5173"
        $BackendUrl = "http://localhost:5000"
    }
    {$_ -in 'staging', 'stage'} {
        $ComposeFile = "docker-compose.staging.yml"
        $EnvName = "Staging"
        $FrontendUrl = "http://localhost:5174"
        $BackendUrl = "http://localhost:5001"
        
        # Charger les variables d'environnement si le fichier existe
        if (Test-Path ".env.staging") {
            Get-Content ".env.staging" | ForEach-Object {
                if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
                    [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
                }
            }
            
            # Valider que les variables critiques ne contiennent pas de placeholders
            $mongoPassword = [Environment]::GetEnvironmentVariable("MONGO_STAGING_PASSWORD", "Process")
            $jwtSecret = [Environment]::GetEnvironmentVariable("STAGING_JWT_SECRET", "Process")
            
            if ($mongoPassword -like "*CHANGE_THIS*" -or $jwtSecret -like "*REPLACE_WITH*") {
                Write-Error-Custom "Configuration non sécurisée détectée dans .env.staging"
                Write-Warning-Custom "Veuillez modifier .env.staging et remplacer tous les placeholders par des valeurs sécurisées"
                Write-Info "Générez des secrets avec: openssl rand -base64 64"
                exit 1
            }
        } else {
            Write-Warning-Custom "Fichier .env.staging non trouvé. Exécutez '.\setup-env.ps1' pour le créer."
        }
    }
    {$_ -in 'prod', 'production'} {
        $ComposeFile = "docker-compose.prod.yml"
        $EnvName = "Production"
        $FrontendUrl = "https://app.soliainvest.com"
        $BackendUrl = "https://api.soliainvest.com"
        
        Write-Warning-Custom "⚠️  Vous êtes sur le point de manipuler l'environnement de PRODUCTION ⚠️"
        $confirm = Read-Host "Êtes-vous sûr ? (yes/no)"
        if ($confirm -ne "yes") {
            Write-Info "Opération annulée"
            exit 0
        }
    }
}

# Vérifier que le fichier existe
if (-not (Test-Path $ComposeFile)) {
    Write-Error-Custom "Fichier non trouvé: $ComposeFile"
    exit 1
}

# Exécuter la commande
switch ($Command) {
    'start' {
        Write-Header "Démarrage de l'environnement $EnvName"
        Write-Info "Fichier de configuration: $ComposeFile"
        
        # Vérifier si Docker est en cours d'exécution
        try {
            docker info | Out-Null
        } catch {
            Write-Error-Custom "Docker n'est pas en cours d'exécution"
            exit 1
        }
        
        # Démarrer les services
        docker-compose -f $ComposeFile up -d
        
        # Attendre que les services soient prêts
        Write-Info "Attente du démarrage des services..."
        Start-Sleep -Seconds 3
        
        # Attendre que les services soient healthy (max 60 secondes)
        Write-Info "Vérification de la santé des services..."
        $maxAttempts = 12
        $attempt = 0
        while ($attempt -lt $maxAttempts) {
            $healthyServices = (docker-compose -f $ComposeFile ps | Select-String "healthy").Count
            if ($healthyServices -gt 0) {
                Write-Success "Services démarrés ($healthyServices services healthy)"
                break
            }
            $attempt++
            if ($attempt -lt $maxAttempts) {
                Start-Sleep -Seconds 5
            } else {
                Write-Warning-Custom "Certains services n'ont pas démarré correctement. Vérifiez les logs."
            }
        }
        
        # Vérifier le statut
        docker-compose -f $ComposeFile ps
        
        Write-Success "Environnement $EnvName démarré avec succès!"
        Write-Info "Frontend: $FrontendUrl"
        Write-Info "Backend: $BackendUrl"
        Write-Info "Health Check: ${BackendUrl}/api/health"
    }
    
    'stop' {
        Write-Header "Arrêt de l'environnement $EnvName"
        docker-compose -f $ComposeFile down
        Write-Success "Environnement $EnvName arrêté"
    }
    
    'restart' {
        Write-Header "Redémarrage de l'environnement $EnvName"
        docker-compose -f $ComposeFile restart
        Write-Success "Environnement $EnvName redémarré"
    }
    
    'logs' {
        Write-Header "Logs de l'environnement $EnvName"
        docker-compose -f $ComposeFile logs -f
    }
    
    'status' {
        Write-Header "Statut de l'environnement $EnvName"
        docker-compose -f $ComposeFile ps
        
        # Tester la connectivité
        Write-Info "Test de connectivité..."
        if ($Environment -ne 'prod' -and $Environment -ne 'production') {
            try {
                $response = Invoke-WebRequest -Uri "${BackendUrl}/api/health" -UseBasicParsing -TimeoutSec 5
                Write-Success "Backend accessible (Status: $($response.StatusCode))"
            } catch {
                Write-Warning-Custom "Backend non accessible"
            }
        }
    }
    
    'build' {
        Write-Header "Reconstruction des images pour $EnvName"
        docker-compose -f $ComposeFile build --no-cache
        Write-Success "Images reconstruites"
    }
    
    'clean' {
        Write-Warning-Custom "⚠️  Cette opération va supprimer tous les volumes et données de l'environnement $EnvName"
        $confirm = Read-Host "Êtes-vous sûr ? (yes/no)"
        if ($confirm -eq "yes") {
            Write-Header "Nettoyage complet de l'environnement $EnvName"
            docker-compose -f $ComposeFile down -v
            Write-Success "Environnement $EnvName nettoyé"
        } else {
            Write-Info "Opération annulée"
        }
    }
}

Write-Host ""
Write-Info "Opération terminée"
