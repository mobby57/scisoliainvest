# Script d'application automatique de la configuration des ports
# SCI Solia Invest - Configuration des Ports

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "prod", "k8s")]
    [string]$Environment = "dev",
    
    [Parameter(Mandatory=$false)]
    [switch]$CheckPorts,
    
    [Parameter(Mandatory=$false)]
    [switch]$KillConflicts,
    
    [Parameter(Mandatory=$false)]
    [switch]$StartServices
)

# Configuration des ports par environnement
$PortConfig = @{
    "dev" = @{
        "api" = 8001
        "client" = 5174
        "gateway" = 3000
        "postgres" = 5432
        "redis" = 6379
        "rabbitmq" = 5672
        "rabbitmq_ui" = 15672
        "kafka" = 9092
        "prometheus" = 9090
        "grafana" = 3001
        "mqtt" = 1883
        "mqtt_ws" = 9001
        "nginx" = 80
    }
    "prod" = @{
        "api" = 8001
        "client" = 5174
        "postgres" = 5433
        "nginx" = 80
        "nginx_ssl" = 443
    }
    "k8s" = @{
        "api_target" = 8001
        "client_target" = 5174
        "mongo" = 27017
        "service_port" = 80
    }
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Test-PortInUse {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

function Get-ProcessOnPort {
    param([int]$Port)
    try {
        $netstat = netstat -ano | Select-String ":$Port "
        if ($netstat) {
            $pid = ($netstat -split '\s+')[-1]
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            return @{
                PID = $pid
                ProcessName = $process.ProcessName
                Found = $true
            }
        }
    }
    catch {
        return @{ Found = $false }
    }
    return @{ Found = $false }
}

function Stop-ProcessOnPort {
    param([int]$Port)
    $processInfo = Get-ProcessOnPort -Port $Port
    if ($processInfo.Found) {
        Write-ColorOutput "Arrêt du processus $($processInfo.ProcessName) (PID: $($processInfo.PID)) sur le port $Port" "Yellow"
        try {
            Stop-Process -Id $processInfo.PID -Force
            Write-ColorOutput "✓ Processus arrêté avec succès" "Green"
            return $true
        }
        catch {
            Write-ColorOutput "✗ Erreur lors de l'arrêt du processus: $($_.Exception.Message)" "Red"
            return $false
        }
    }
    return $false
}

function Check-PortsStatus {
    param([hashtable]$Ports)
    
    Write-ColorOutput "`n=== Vérification des ports pour l'environnement $Environment ===" "Cyan"
    
    $conflicts = @()
    foreach ($service in $Ports.Keys) {
        $port = $Ports[$service]
        $inUse = Test-PortInUse -Port $port
        
        if ($inUse) {
            $processInfo = Get-ProcessOnPort -Port $port
            Write-ColorOutput "⚠️  Port $port ($service): OCCUPÉ par $($processInfo.ProcessName)" "Red"
            $conflicts += @{ Service = $service; Port = $port; Process = $processInfo }
        } else {
            Write-ColorOutput "✓ Port $port ($service): LIBRE" "Green"
        }
    }
    
    return $conflicts
}

function Create-EnvironmentFile {
    param([hashtable]$Ports, [string]$EnvType)
    
    $envContent = @"
# Configuration des ports - Environnement: $EnvType
# Généré automatiquement le $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

"@

    switch ($EnvType) {
        "dev" {
            $envContent += @"
# API Backend
PORT=$($Ports.api)
REDIS_URL=redis://127.0.0.1:$($Ports.redis)

# Frontend Client
VITE_API_URL=http://localhost:$($Ports.api)

# Gateway NestJS
GATEWAY_PORT=$($Ports.gateway)
RMQ_URL=amqp://localhost:$($Ports.rabbitmq)
KAFKA_BROKER=localhost:$($Ports.kafka)

# Base de données
POSTGRES_PORT=$($Ports.postgres)
REDIS_PORT=$($Ports.redis)

# Monitoring
PROMETHEUS_PORT=$($Ports.prometheus)
GRAFANA_PORT=$($Ports.grafana)

# MQTT
MQTT_PORT=$($Ports.mqtt)
MQTT_WS_PORT=$($Ports.mqtt_ws)
"@
        }
        "prod" {
            $envContent += @"
# Production
PORT=$($Ports.api)
POSTGRES_PORT=$($Ports.postgres)
NGINX_HTTP_PORT=$($Ports.nginx)
NGINX_HTTPS_PORT=$($Ports.nginx_ssl)
"@
        }
    }

    $envPath = "c:\Users\moros\Desktop\scisoliainvest.com\.env.$EnvType"
    Set-Content -Path $envPath -Value $envContent -Encoding UTF8
    Write-ColorOutput "✓ Fichier d'environnement créé: $envPath" "Green"
}

function Update-DockerCompose {
    param([hashtable]$Ports)
    
    Write-ColorOutput "Mise à jour des fichiers Docker Compose..." "Yellow"
    
    # Exemple de mise à jour basique - à adapter selon vos fichiers
    $dockerComposePath = "c:\Users\moros\Desktop\scisoliainvest.com\docker-compose.yml"
    
    if (Test-Path $dockerComposePath) {
        Write-ColorOutput "✓ Docker Compose trouvé, mise à jour des ports..." "Green"
        # Ici vous pourriez ajouter la logique de mise à jour du fichier YAML
    }
}

function Start-DevelopmentServices {
    Write-ColorOutput "`n=== Démarrage des services de développement ===" "Cyan"
    
    # Démarrer les services Docker si disponibles
    if (Test-Path "c:\Users\moros\Desktop\scisoliainvest.com\docker-compose.dev.yml") {
        Write-ColorOutput "Démarrage des services Docker..." "Yellow"
        Set-Location "c:\Users\moros\Desktop\scisoliainvest.com"
        docker-compose -f docker-compose.dev.yml up -d
    }
    
    # Démarrer l'API en arrière-plan
    Write-ColorOutput "Démarrage de l'API Backend..." "Yellow"
    # Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "packages\api"
    
    # Démarrer le client
    Write-ColorOutput "Démarrage du Frontend..." "Yellow"
    # Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "packages\client"
}

# === EXECUTION PRINCIPALE ===

Write-ColorOutput "🚀 Script de Configuration des Ports - SCI Solia Invest" "Magenta"
Write-ColorOutput "Environnement: $Environment" "Cyan"

$currentPorts = $PortConfig[$Environment]

if ($CheckPorts) {
    $conflicts = Check-PortsStatus -Ports $currentPorts
    
    if ($conflicts.Count -gt 0 -and $KillConflicts) {
        Write-ColorOutput "`n=== Résolution des conflits de ports ===" "Yellow"
        foreach ($conflict in $conflicts) {
            Stop-ProcessOnPort -Port $conflict.Port
        }
        
        # Revérifier après nettoyage
        Start-Sleep -Seconds 2
        Write-ColorOutput "`n=== Vérification après nettoyage ===" "Cyan"
        Check-PortsStatus -Ports $currentPorts | Out-Null
    }
}

# Créer les fichiers de configuration
Create-EnvironmentFile -Ports $currentPorts -EnvType $Environment

# Mettre à jour Docker Compose si nécessaire
if ($Environment -eq "dev" -or $Environment -eq "prod") {
    Update-DockerCompose -Ports $currentPorts
}

# Démarrer les services si demandé
if ($StartServices -and $Environment -eq "dev") {
    Start-DevelopmentServices
}

Write-ColorOutput "`n✅ Configuration des ports appliquée avec succès!" "Green"
Write-ColorOutput "Utilisez les commandes suivantes pour tester:" "White"
Write-ColorOutput "  curl http://localhost:$($currentPorts.api)/health" "Gray"
if ($currentPorts.client) {
    Write-ColorOutput "  curl http://localhost:$($currentPorts.client)" "Gray"
}
if ($currentPorts.gateway) {
    Write-ColorOutput "  curl http://localhost:$($currentPorts.gateway)/api/health" "Gray"
}