#!/bin/bash

# Script de démarrage rapide pour l'environnement Staging
# Quick start script for Staging environment

set -e

echo "=================================================="
echo "   SCI Solia Invest - Démarrage Staging"
echo "=================================================="
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Erreur: Docker n'est pas installé"
    echo "   Installer Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Vérifier que Docker Compose est disponible
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Erreur: Docker Compose n'est pas disponible"
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"
echo ""

# Vérifier les fichiers de configuration
if [ ! -f "packages/api/.env.staging" ]; then
    echo "❌ Erreur: packages/api/.env.staging n'existe pas"
    echo "   Créer ce fichier à partir de packages/api/.env.staging"
    exit 1
fi

if [ ! -f "frontend/.env.staging" ]; then
    echo "❌ Erreur: frontend/.env.staging n'existe pas"
    echo "   Créer ce fichier à partir de frontend/.env.staging"
    exit 1
fi

echo "✅ Fichiers de configuration trouvés"
echo ""

# Copier les fichiers .env.staging vers .env pour le staging
echo "📝 Configuration de l'environnement staging..."
cp packages/api/.env.staging packages/api/.env
cp frontend/.env.staging frontend/.env
echo "✅ Variables d'environnement configurées"
echo ""

# Arrêter les conteneurs existants si ils tournent
echo "🛑 Arrêt des conteneurs existants (si présents)..."
docker-compose -f docker-compose.staging.yml down 2>/dev/null || true
echo ""

# Build des images
echo "🔨 Build des images Docker..."
docker-compose -f docker-compose.staging.yml build
echo ""

# Démarrer les services
echo "🚀 Démarrage des services staging..."
docker-compose -f docker-compose.staging.yml up -d
echo ""

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services (30 secondes)..."
sleep 30
echo ""

# Vérifier l'état des services
echo "📊 État des services:"
docker-compose -f docker-compose.staging.yml ps
echo ""

# Afficher les URLs d'accès
echo "=================================================="
echo "   ✅ Environnement Staging démarré!"
echo "=================================================="
echo ""
echo "🌐 URLs d'accès:"
echo "   Frontend: http://localhost:5174"
echo "   Backend API: http://localhost:5001"
echo "   Health Check: http://localhost:5001/api/health"
echo ""
echo "📝 Commandes utiles:"
echo "   Voir les logs: docker-compose -f docker-compose.staging.yml logs -f"
echo "   Arrêter: docker-compose -f docker-compose.staging.yml down"
echo "   Redémarrer: docker-compose -f docker-compose.staging.yml restart"
echo ""
echo "📚 Documentation:"
echo "   Guide utilisateur: USER_TESTING_GUIDE.md"
echo "   Guide déploiement: DEPLOYMENT_GUIDE.md"
echo ""

# Test du health check
echo "🔍 Test du health check..."
sleep 5
if curl -f http://localhost:5001/api/health 2>/dev/null; then
    echo "✅ Backend API est opérationnel!"
else
    echo "⚠️  Backend API n'a pas encore répondu (peut prendre quelques minutes)"
    echo "   Vérifier les logs: docker-compose -f docker-compose.staging.yml logs backend-staging"
fi

echo ""
echo "✨ Prêt pour les tests utilisateurs!"
