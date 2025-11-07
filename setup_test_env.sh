#!/bin/bash

###############################################################################
# Script de configuration de l'environnement de test Python
# Pour Linux/Mac
###############################################################################

set -e  # Arrêter le script en cas d'erreur

echo "========================================"
echo "Configuration de l'environnement de test"
echo "========================================"
echo ""

# Étape 1: Création de l'environnement virtuel
echo "Étape 1/5: Création de l'environnement virtuel..."
if [ -d "venv" ]; then
    echo "⚠️  L'environnement virtuel existe déjà."
    read -p "Voulez-vous le supprimer et le recréer? (o/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        echo "Suppression de l'environnement existant..."
        rm -rf venv
        echo "Création d'un nouvel environnement virtuel..."
        python3 -m venv venv
        echo "✅ Nouvel environnement virtuel créé."
    else
        echo "Utilisation de l'environnement virtuel existant."
    fi
else
    echo "Création de l'environnement virtuel..."
    python3 -m venv venv
    echo "✅ Environnement virtuel créé avec succès."
fi
echo ""

# Étape 2: Activation de l'environnement virtuel
echo "Étape 2/5: Activation de l'environnement virtuel..."
source venv/bin/activate
echo "✅ Environnement virtuel activé."
echo ""

# Étape 3: Mise à jour de pip
echo "Étape 3/5: Mise à jour de pip..."
pip install --upgrade pip --quiet
echo "✅ pip mis à jour."
echo ""

# Étape 4: Installation des dépendances de test
echo "Étape 4/5: Installation des dépendances de test..."
if [ -f "requirements-test.txt" ]; then
    pip install -r requirements-test.txt
    echo "✅ Dépendances installées avec succès."
else
    echo "❌ Erreur: Le fichier requirements-test.txt est introuvable."
    exit 1
fi
echo ""

# Étape 5: Vérification de l'installation
echo "Étape 5/5: Vérification de l'installation..."
# Utiliser python3 pour cohérence avec la création du venv
if python3 -c "import pytest" 2>/dev/null; then
    echo "✅ pytest est correctement installé."
    pytest_version=$(pytest --version 2>&1 | head -n 1)
    echo "   Version: $pytest_version"
else
    echo "❌ Erreur: pytest n'est pas installé correctement."
    exit 1
fi
echo ""

# Exécution des tests avec pytest
echo "========================================"
echo "Exécution des tests avec pytest"
echo "========================================"
echo ""

# Vérifier s'il existe des fichiers de test
if find . -name "test_*.py" -o -name "*_test.py" | grep -q .; then
    echo "Lancement des tests unitaires..."
    pytest -v --tb=short
    
    # Vérifier le résultat de pytest
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Tous les tests sont passés avec succès!"
    else
        echo ""
        echo "⚠️  Certains tests ont échoué. Veuillez consulter le résumé ci-dessus."
    fi
else
    echo "ℹ️  Aucun fichier de test trouvé (test_*.py ou *_test.py)."
    echo "   Créez des tests dans le répertoire du projet pour les exécuter avec pytest."
fi

echo ""
echo "========================================"
echo "Configuration terminée"
echo "========================================"
echo ""
echo "Pour activer l'environnement virtuel manuellement:"
echo "  source venv/bin/activate"
echo ""
echo "Pour désactiver l'environnement virtuel:"
echo "  deactivate"
echo ""
echo "Pour exécuter les tests:"
echo "  pytest"
echo "========================================"
