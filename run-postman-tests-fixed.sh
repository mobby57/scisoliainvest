#!/bin/bash

# Script pour exécuter les tests Postman avec Newman
# Usage: ./run-postman-tests-fixed.sh [local|staging|prod]

ENVIRONMENT=${1:-local}
COLLECTION_FILE="SCI_Solia_Invest_Collection_with_Tests.json"
ENVIRONMENT_FILE="SCI_Solia_Invest.postman_environment.json"

echo "🚀 Exécution des tests Postman pour l'environnement: $ENVIRONMENT"
echo "📁 Collection: $COLLECTION_FILE"
echo "⚙️  Environnement: $ENVIRONMENT_FILE"

# Vérifier si Newman est installé
if ! command -v newman >/dev/null 2>&1; then
    echo "📦 Installation de Newman..."
    npm install -g newman
fi

# Créer le dossier de résultats
mkdir -p test-results

# Exécuter les tests
newman run "$COLLECTION_FILE" \
  -e "$ENVIRONMENT_FILE" \
  --reporters cli,json,html \
  --reporter-json-export "test-results/postman-results.json" \
  --reporter-html-export "test-results/postman-report.html" \
  --timeout-request 10000 \
  --delay-request 500

# Vérifier le code de retour
if [ $? -eq 0 ]; then
    echo "✅ Tous les tests Postman ont réussi!"
else
    echo "❌ Certains tests ont échoué. Vérifiez le rapport HTML."
    exit 1
fi
