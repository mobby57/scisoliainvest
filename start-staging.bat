@echo off
REM Script de démarrage rapide pour l'environnement Staging (Windows)
REM Quick start script for Staging environment (Windows)

echo ==================================================
echo    SCI Solia Invest - Démarrage Staging
echo ==================================================
echo.

REM Vérifier que Docker est installé
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur: Docker n'est pas installé
    echo    Installer Docker Desktop: https://www.docker.com/products/docker-desktop
    exit /b 1
)

REM Vérifier que Docker Compose est disponible
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur: Docker Compose n'est pas disponible
    exit /b 1
)

echo ✅ Docker et Docker Compose sont installés
echo.

REM Vérifier les fichiers de configuration
if not exist "packages\api\.env.staging" (
    echo ❌ Erreur: packages\api\.env.staging n'existe pas
    exit /b 1
)

if not exist "frontend\.env.staging" (
    echo ❌ Erreur: frontend\.env.staging n'existe pas
    exit /b 1
)

echo ✅ Fichiers de configuration trouvés
echo.

REM Copier les fichiers .env.staging vers .env
echo 📝 Configuration de l'environnement staging...
copy /Y packages\api\.env.staging packages\api\.env >nul
copy /Y frontend\.env.staging frontend\.env >nul
echo ✅ Variables d'environnement configurées
echo.

REM Arrêter les conteneurs existants
echo 🛑 Arrêt des conteneurs existants (si présents)...
docker-compose -f docker-compose.staging.yml down 2>nul
echo.

REM Build des images
echo 🔨 Build des images Docker...
docker-compose -f docker-compose.staging.yml build
echo.

REM Démarrer les services
echo 🚀 Démarrage des services staging...
docker-compose -f docker-compose.staging.yml up -d
echo.

REM Attendre que les services soient prêts
echo ⏳ Attente du démarrage des services (30 secondes)...
timeout /t 30 /nobreak >nul
echo.

REM Vérifier l'état des services
echo 📊 État des services:
docker-compose -f docker-compose.staging.yml ps
echo.

REM Afficher les informations
echo ==================================================
echo    ✅ Environnement Staging démarré!
echo ==================================================
echo.
echo 🌐 URLs d'accès:
echo    Frontend: http://localhost:5174
echo    Backend API: http://localhost:5001
echo    Health Check: http://localhost:5001/api/health
echo.
echo 📝 Commandes utiles:
echo    Voir les logs: docker-compose -f docker-compose.staging.yml logs -f
echo    Arrêter: docker-compose -f docker-compose.staging.yml down
echo    Redémarrer: docker-compose -f docker-compose.staging.yml restart
echo.
echo 📚 Documentation:
echo    Guide utilisateur: USER_TESTING_GUIDE.md
echo    Guide déploiement: DEPLOYMENT_GUIDE.md
echo.
echo ✨ Prêt pour les tests utilisateurs!
echo.

pause
