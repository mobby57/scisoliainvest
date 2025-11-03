#!/bin/bash

# Script pour exécuter tous les tests de la plateforme SCI Solia Invest

set -e

echo "🚀 Démarrage des tests complets SCI Solia Invest..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les logs
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que les services sont démarrés
log_info "Vérification des services..."

# Démarrer les services si nécessaire
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    log_warn "API non disponible, démarrage des services..."
    cd packages/api && npm run dev &
    API_PID=$!
    sleep 10
fi

# 1. Tests unitaires API
log_info "Exécution des tests unitaires API..."
cd packages/api
npm run test
if [ $? -eq 0 ]; then
    log_info "✅ Tests unitaires API réussis"
else
    log_error "❌ Échec des tests unitaires API"
    exit 1
fi

# 2. Tests unitaires Client
log_info "Exécution des tests unitaires Client..."
cd ../client
npm run test:unit
if [ $? -eq 0 ]; then
    log_info "✅ Tests unitaires Client réussis"
else
    log_error "❌ Échec des tests unitaires Client"
    exit 1
fi

# 3. Tests de validation de base de données
log_info "Validation de la base de données..."
cd ../api
npm run test -- tests/database.test.ts
if [ $? -eq 0 ]; then
    log_info "✅ Validation base de données réussie"
else
    log_error "❌ Échec validation base de données"
    exit 1
fi

# 4. Tests E2E avec Postman/Newman
log_info "Exécution des tests E2E avec Newman..."
cd ../../

# Installer Newman si nécessaire
if ! command -v newman &> /dev/null; then
    log_warn "Newman non installé, installation..."
    npm install -g newman
fi

# Exécuter les tests Postman
newman run SCI_Solia_Invest_Tests.postman_collection.json \
    -e SCI_Solia_Invest_Test.postman_environment.json \
    --reporters cli,json \
    --reporter-json-export test-results/postman-results.json

if [ $? -eq 0 ]; then
    log_info "✅ Tests E2E Postman réussis"
else
    log_error "❌ Échec des tests E2E Postman"
    exit 1
fi

# 5. Tests E2E avec Playwright (Client)
log_info "Exécution des tests E2E Playwright..."
cd packages/client
npm run test:e2e
if [ $? -eq 0 ]; then
    log_info "✅ Tests E2E Playwright réussis"
else
    log_error "❌ Échec des tests E2E Playwright"
    exit 1
fi

# Nettoyage
if [ ! -z "$API_PID" ]; then
    log_info "Arrêt des services de test..."
    kill $API_PID
fi

# Rapport final
log_info "📊 Génération du rapport de tests..."
cd ../../
node scripts/generate-test-report.js

log_info "🎉 Tous les tests sont passés avec succès!"
log_info "📋 Rapport disponible dans: test-results/final-report.html"