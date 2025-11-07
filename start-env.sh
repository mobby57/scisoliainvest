#!/bin/bash

# Script de gestion des environnements SCI Solia Invest
# Usage: ./start-env.sh [dev|staging|prod] [command]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Fonction d'aide
show_help() {
    cat << EOF
Usage: ./start-env.sh [ENVIRONMENT] [COMMAND]

ENVIRONMENTS:
  dev       Environnement de développement (ports: 5000, 5173, 27017)
  staging   Environnement de staging/pré-production (ports: 5001, 5174, 27018)
  prod      Environnement de production

COMMANDS:
  start     Démarrer l'environnement (défaut)
  stop      Arrêter l'environnement
  restart   Redémarrer l'environnement
  logs      Afficher les logs
  status    Afficher le statut des services
  build     Reconstruire les images Docker
  clean     Nettoyer complètement (supprime les volumes)

EXAMPLES:
  ./start-env.sh dev start
  ./start-env.sh staging logs
  ./start-env.sh prod status
  ./start-env.sh dev clean

EOF
}

# Vérifier les arguments
if [ $# -eq 0 ]; then
    print_error "Aucun environnement spécifié"
    show_help
    exit 1
fi

ENVIRONMENT=$1
COMMAND=${2:-start}

# Déterminer le fichier docker-compose à utiliser
case $ENVIRONMENT in
    dev|development)
        COMPOSE_FILE="docker-compose.dev.yml"
        ENV_NAME="Développement"
        FRONTEND_URL="http://localhost:5173"
        BACKEND_URL="http://localhost:5000"
        ;;
    staging|stage)
        COMPOSE_FILE="docker-compose.staging.yml"
        ENV_NAME="Staging"
        FRONTEND_URL="http://localhost:5174"
        BACKEND_URL="http://localhost:5001"
        # Charger les variables d'environnement si le fichier existe
        if [ -f ".env.staging" ]; then
            set -a
            source .env.staging
            set +a
            
            # Valider que les variables critiques sont définies et ne sont pas des placeholders
            if [[ "${MONGO_STAGING_PASSWORD}" == *"CHANGE_THIS"* ]] || [[ "${STAGING_JWT_SECRET}" == *"REPLACE_WITH"* ]]; then
                print_error "Configuration non sécurisée détectée dans .env.staging"
                print_warning "Veuillez modifier .env.staging et remplacer tous les placeholders par des valeurs sécurisées"
                print_info "Générez des secrets avec: openssl rand -base64 64"
                exit 1
            fi
        else
            print_warning "Fichier .env.staging non trouvé. Exécutez './setup-env.sh' pour le créer."
        fi
        ;;
    prod|production)
        COMPOSE_FILE="docker-compose.prod.yml"
        ENV_NAME="Production"
        print_warning "⚠️  Vous êtes sur le point de manipuler l'environnement de PRODUCTION ⚠️"
        read -p "Êtes-vous sûr ? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            print_info "Opération annulée"
            exit 0
        fi
        FRONTEND_URL="https://app.soliainvest.com"
        BACKEND_URL="https://api.soliainvest.com"
        ;;
    *)
        print_error "Environnement invalide: $ENVIRONMENT"
        show_help
        exit 1
        ;;
esac

# Vérifier que le fichier docker-compose existe
if [ ! -f "$COMPOSE_FILE" ]; then
    print_error "Fichier non trouvé: $COMPOSE_FILE"
    exit 1
fi

# Exécuter la commande
case $COMMAND in
    start)
        print_header "Démarrage de l'environnement $ENV_NAME"
        print_info "Fichier de configuration: $COMPOSE_FILE"
        
        # Vérifier si Docker est en cours d'exécution
        if ! docker info > /dev/null 2>&1; then
            print_error "Docker n'est pas en cours d'exécution"
            exit 1
        fi
        
        # Démarrer les services
        docker-compose -f "$COMPOSE_FILE" up -d
        
        # Attendre que les services soient prêts
        print_info "Attente du démarrage des services..."
        sleep 3
        
        # Attendre que les services principaux soient healthy (max 60 secondes)
        print_info "Vérification de la santé des services..."
        max_attempts=12
        attempt=0
        while [ $attempt -lt $max_attempts ]; do
            healthy_count=$(docker-compose -f "$COMPOSE_FILE" ps | grep -c "healthy" || echo "0")
            if [ "$healthy_count" -gt 0 ]; then
                print_success "Services démarrés (${healthy_count} services healthy)"
                break
            fi
            attempt=$((attempt + 1))
            if [ $attempt -lt $max_attempts ]; then
                sleep 5
            else
                print_warning "Certains services n'ont pas démarré correctement. Vérifiez les logs."
            fi
        done
        
        # Vérifier le statut
        docker-compose -f "$COMPOSE_FILE" ps
        
        print_success "Environnement $ENV_NAME démarré avec succès!"
        print_info "Frontend: $FRONTEND_URL"
        print_info "Backend: $BACKEND_URL"
        print_info "Health Check: ${BACKEND_URL}/api/health"
        ;;
        
    stop)
        print_header "Arrêt de l'environnement $ENV_NAME"
        docker-compose -f "$COMPOSE_FILE" down
        print_success "Environnement $ENV_NAME arrêté"
        ;;
        
    restart)
        print_header "Redémarrage de l'environnement $ENV_NAME"
        docker-compose -f "$COMPOSE_FILE" restart
        print_success "Environnement $ENV_NAME redémarré"
        ;;
        
    logs)
        print_header "Logs de l'environnement $ENV_NAME"
        docker-compose -f "$COMPOSE_FILE" logs -f
        ;;
        
    status)
        print_header "Statut de l'environnement $ENV_NAME"
        docker-compose -f "$COMPOSE_FILE" ps
        
        # Tester la connectivité
        print_info "Test de connectivité..."
        if [ "$ENVIRONMENT" != "prod" ]; then
            if command -v curl &> /dev/null; then
                curl -s -o /dev/null -w "Backend Health Check: %{http_code}\n" "${BACKEND_URL}/api/health" || print_warning "Backend non accessible"
            elif command -v wget &> /dev/null; then
                wget -q --spider "${BACKEND_URL}/api/health" && print_success "Backend accessible" || print_warning "Backend non accessible"
            else
                print_warning "curl ou wget non disponible, impossible de vérifier la connectivité"
            fi
        fi
        ;;
        
    build)
        print_header "Reconstruction des images pour $ENV_NAME"
        docker-compose -f "$COMPOSE_FILE" build --no-cache
        print_success "Images reconstruites"
        ;;
        
    clean)
        print_warning "⚠️  Cette opération va supprimer tous les volumes et données de l'environnement $ENV_NAME"
        read -p "Êtes-vous sûr ? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            print_header "Nettoyage complet de l'environnement $ENV_NAME"
            docker-compose -f "$COMPOSE_FILE" down -v
            print_success "Environnement $ENV_NAME nettoyé"
        else
            print_info "Opération annulée"
        fi
        ;;
        
    *)
        print_error "Commande invalide: $COMMAND"
        show_help
        exit 1
        ;;
esac
