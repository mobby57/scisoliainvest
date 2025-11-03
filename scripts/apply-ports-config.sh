#!/bin/bash
# Script d'application automatique de la configuration des ports
# SCI Solia Invest - Configuration des Ports

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables par défaut
ENVIRONMENT="dev"
CHECK_PORTS=false
KILL_CONFLICTS=false
START_SERVICES=false

# Fonction d'aide
show_help() {
    echo -e "${CYAN}Usage: $0 [OPTIONS]${NC}"
    echo ""
    echo "Options:"
    echo "  -e, --env ENV          Environnement (dev|prod|k8s) [défaut: dev]"
    echo "  -c, --check           Vérifier l'état des ports"
    echo "  -k, --kill            Arrêter les processus en conflit"
    echo "  -s, --start           Démarrer les services"
    echo "  -h, --help            Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 -e dev -c -k       # Vérifier et nettoyer les ports en dev"
    echo "  $0 -e prod -c         # Vérifier les ports en production"
    echo "  $0 -e dev -s          # Démarrer les services de développement"
}

# Traitement des arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -c|--check)
            CHECK_PORTS=true
            shift
            ;;
        -k|--kill)
            KILL_CONFLICTS=true
            shift
            ;;
        -s|--start)
            START_SERVICES=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Option inconnue: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Configuration des ports par environnement
declare -A DEV_PORTS=(
    ["api"]=8001
    ["client"]=5174
    ["gateway"]=3000
    ["postgres"]=5432
    ["redis"]=6379
    ["rabbitmq"]=5672
    ["rabbitmq_ui"]=15672
    ["kafka"]=9092
    ["prometheus"]=9090
    ["grafana"]=3001
    ["mqtt"]=1883
    ["mqtt_ws"]=9001
    ["nginx"]=80
)

declare -A PROD_PORTS=(
    ["api"]=8001
    ["client"]=5174
    ["postgres"]=5433
    ["nginx"]=80
    ["nginx_ssl"]=443
)

# Fonctions utilitaires
log_info() {
    echo -e "${CYAN}$1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Vérifier si un port est utilisé
is_port_in_use() {
    local port=$1
    if command -v lsof >/dev/null 2>&1; then
        lsof -i :$port >/dev/null 2>&1
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tuln | grep ":$port " >/dev/null 2>&1
    else
        # Fallback avec nc si disponible
        if command -v nc >/dev/null 2>&1; then
            nc -z localhost $port >/dev/null 2>&1
        else
            return 1
        fi
    fi
}

# Obtenir le processus utilisant un port
get_process_on_port() {
    local port=$1
    if command -v lsof >/dev/null 2>&1; then
        lsof -ti :$port 2>/dev/null
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tulpn 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1
    fi
}

# Arrêter un processus sur un port
kill_process_on_port() {
    local port=$1
    local pid=$(get_process_on_port $port)
    
    if [[ -n "$pid" ]]; then
        local process_name=$(ps -p $pid -o comm= 2>/dev/null || echo "unknown")
        log_warning "Arrêt du processus $process_name (PID: $pid) sur le port $port"
        
        if kill -9 $pid 2>/dev/null; then
            log_success "Processus arrêté avec succès"
            return 0
        else
            log_error "Erreur lors de l'arrêt du processus"
            return 1
        fi
    fi
    return 1
}

# Vérifier l'état des ports
check_ports_status() {
    local -n ports_ref=$1
    local conflicts=()
    
    log_info "\n=== Vérification des ports pour l'environnement $ENVIRONMENT ==="
    
    for service in "${!ports_ref[@]}"; do
        local port=${ports_ref[$service]}
        
        if is_port_in_use $port; then
            local pid=$(get_process_on_port $port)
            local process_name=$(ps -p $pid -o comm= 2>/dev/null || echo "unknown")
            log_error "Port $port ($service): OCCUPÉ par $process_name (PID: $pid)"
            conflicts+=("$service:$port:$pid")
        else
            log_success "Port $port ($service): LIBRE"
        fi
    done
    
    echo "${conflicts[@]}"
}

# Créer le fichier d'environnement
create_env_file() {
    local -n ports_ref=$1
    local env_type=$2
    local env_file=".env.$env_type"
    
    cat > "$env_file" << EOF
# Configuration des ports - Environnement: $env_type
# Généré automatiquement le $(date '+%Y-%m-%d %H:%M:%S')

EOF

    case $env_type in
        "dev")
            cat >> "$env_file" << EOF
# API Backend
PORT=${ports_ref[api]}
REDIS_URL=redis://127.0.0.1:${ports_ref[redis]}

# Frontend Client
VITE_API_URL=http://localhost:${ports_ref[api]}

# Gateway NestJS
GATEWAY_PORT=${ports_ref[gateway]}
RMQ_URL=amqp://localhost:${ports_ref[rabbitmq]}
KAFKA_BROKER=localhost:${ports_ref[kafka]}

# Base de données
POSTGRES_PORT=${ports_ref[postgres]}
REDIS_PORT=${ports_ref[redis]}

# Monitoring
PROMETHEUS_PORT=${ports_ref[prometheus]}
GRAFANA_PORT=${ports_ref[grafana]}

# MQTT
MQTT_PORT=${ports_ref[mqtt]}
MQTT_WS_PORT=${ports_ref[mqtt_ws]}
EOF
            ;;
        "prod")
            cat >> "$env_file" << EOF
# Production
PORT=${ports_ref[api]}
POSTGRES_PORT=${ports_ref[postgres]}
NGINX_HTTP_PORT=${ports_ref[nginx]}
NGINX_HTTPS_PORT=${ports_ref[nginx_ssl]}
EOF
            ;;
    esac
    
    log_success "Fichier d'environnement créé: $env_file"
}

# Démarrer les services de développement
start_dev_services() {
    log_info "\n=== Démarrage des services de développement ==="
    
    # Démarrer Docker Compose si disponible
    if [[ -f "docker-compose.dev.yml" ]]; then
        log_info "Démarrage des services Docker..."
        docker-compose -f docker-compose.dev.yml up -d
    elif [[ -f "infrastructure/docker-compose.dev.yml" ]]; then
        log_info "Démarrage des services Docker..."
        docker-compose -f infrastructure/docker-compose.dev.yml up -d
    fi
    
    # Attendre que les services soient prêts
    sleep 5
    
    log_success "Services Docker démarrés"
}

# Tester la connectivité
test_connectivity() {
    local -n ports_ref=$1
    
    log_info "\n=== Test de connectivité ==="
    
    # Test API
    if [[ -n "${ports_ref[api]}" ]]; then
        if curl -s "http://localhost:${ports_ref[api]}/health" >/dev/null 2>&1; then
            log_success "API Backend (port ${ports_ref[api]}): OK"
        else
            log_warning "API Backend (port ${ports_ref[api]}): Non accessible"
        fi
    fi
    
    # Test Frontend
    if [[ -n "${ports_ref[client]}" ]]; then
        if curl -s "http://localhost:${ports_ref[client]}" >/dev/null 2>&1; then
            log_success "Frontend (port ${ports_ref[client]}): OK"
        else
            log_warning "Frontend (port ${ports_ref[client]}): Non accessible"
        fi
    fi
    
    # Test Gateway
    if [[ -n "${ports_ref[gateway]}" ]]; then
        if curl -s "http://localhost:${ports_ref[gateway]}/api/health" >/dev/null 2>&1; then
            log_success "Gateway (port ${ports_ref[gateway]}): OK"
        else
            log_warning "Gateway (port ${ports_ref[gateway]}): Non accessible"
        fi
    fi
}

# === EXECUTION PRINCIPALE ===

echo -e "${MAGENTA}🚀 Script de Configuration des Ports - SCI Solia Invest${NC}"
log_info "Environnement: $ENVIRONMENT"

# Sélectionner la configuration des ports
case $ENVIRONMENT in
    "dev")
        declare -n CURRENT_PORTS=DEV_PORTS
        ;;
    "prod")
        declare -n CURRENT_PORTS=PROD_PORTS
        ;;
    *)
        log_error "Environnement non supporté: $ENVIRONMENT"
        exit 1
        ;;
esac

# Vérifier les ports si demandé
if [[ "$CHECK_PORTS" == true ]]; then
    conflicts=($(check_ports_status CURRENT_PORTS))
    
    if [[ ${#conflicts[@]} -gt 0 && "$KILL_CONFLICTS" == true ]]; then
        log_info "\n=== Résolution des conflits de ports ==="
        for conflict in "${conflicts[@]}"; do
            IFS=':' read -r service port pid <<< "$conflict"
            kill_process_on_port $port
        done
        
        # Revérifier après nettoyage
        sleep 2
        log_info "\n=== Vérification après nettoyage ==="
        check_ports_status CURRENT_PORTS >/dev/null
    fi
fi

# Créer les fichiers de configuration
create_env_file CURRENT_PORTS $ENVIRONMENT

# Démarrer les services si demandé
if [[ "$START_SERVICES" == true && "$ENVIRONMENT" == "dev" ]]; then
    start_dev_services
    test_connectivity CURRENT_PORTS
fi

log_success "\n✅ Configuration des ports appliquée avec succès!"
echo -e "${NC}Utilisez les commandes suivantes pour tester:"
echo -e "${YELLOW}  curl http://localhost:${CURRENT_PORTS[api]}/health${NC}"
[[ -n "${CURRENT_PORTS[client]}" ]] && echo -e "${YELLOW}  curl http://localhost:${CURRENT_PORTS[client]}${NC}"
[[ -n "${CURRENT_PORTS[gateway]}" ]] && echo -e "${YELLOW}  curl http://localhost:${CURRENT_PORTS[gateway]}/api/health${NC}"