#!/bin/bash

# Script de configuration initiale des environnements
# Ce script copie les fichiers .env.example vers .env pour chaque environnement

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Configuration des Environnements${NC}"
echo -e "${BLUE}SCI Solia Invest${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Fonction pour copier un fichier exemple
setup_env_file() {
    local example_file=$1
    local target_file=$2
    local description=$3
    
    if [ -f "$example_file" ]; then
        if [ -f "$target_file" ]; then
            echo -e "${YELLOW}⚠️  $description existe déjà, ignoré${NC}"
        else
            cp "$example_file" "$target_file"
            echo -e "${GREEN}✅ $description créé${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Fichier exemple non trouvé: $example_file${NC}"
    fi
}

# Configuration API Backend
echo -e "${BLUE}Configuration API Backend...${NC}"
setup_env_file "packages/api/.env.example" "packages/api/.env" "packages/api/.env"
setup_env_file "packages/api/.env.staging.example" "packages/api/.env.staging" "packages/api/.env.staging"

# Configuration Frontend
echo -e "${BLUE}Configuration Frontend...${NC}"
setup_env_file "frontend/.env.staging.example" "frontend/.env.staging" "frontend/.env.staging"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Configuration terminée !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Prochaines étapes:${NC}"
echo ""
echo "1. Modifiez les fichiers .env avec vos valeurs:"
echo "   - packages/api/.env (développement)"
echo "   - packages/api/.env.staging (staging)"
echo "   - frontend/.env.staging (staging)"
echo ""
echo "2. Lancez l'environnement souhaité:"
echo "   - Développement: ./start-env.sh dev start"
echo "   - Staging: ./start-env.sh staging start"
echo ""
echo "3. Consultez la documentation:"
echo "   - ENVIRONMENT_GUIDE.md"
echo "   - QUICK_START_STAGING.md"
echo "   - QUAND_FAIRE_ESSAIS.md"
echo ""
