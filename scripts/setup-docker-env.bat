@echo off
echo Configuration de l'environnement Docker pour SCI Solia Invest
echo ============================================================

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Docker n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Docker Desktop depuis https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Vérifier si Docker Compose est disponible
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Docker Compose n'est pas disponible
    pause
    exit /b 1
)

echo Docker et Docker Compose sont installés correctement.
echo.

REM Créer les dossiers nécessaires
echo Création des dossiers nécessaires...
if not exist "uploads" mkdir uploads
if not exist "uploads\documents" mkdir uploads\documents
if not exist "uploads\avatars" mkdir uploads\avatars
if not exist "uploads\kyc" mkdir uploads\kyc
if not exist "uploads\temp" mkdir uploads\temp
if not exist "logs" mkdir logs

REM Copier le fichier d'environnement Docker
echo Configuration des variables d'environnement...
copy .env.docker .env.docker.local >nul 2>&1

REM Arrêter les conteneurs existants
echo Arrêt des conteneurs existants...
docker compose -f docker-compose.complete.yml down

REM Nettoyer les volumes orphelins (optionnel)
echo Nettoyage des volumes orphelins...
docker volume prune -f

REM Construire et démarrer les services
echo Construction et démarrage des services...
docker compose -f docker-compose.complete.yml up --build -d

REM Attendre que les services soient prêts
echo Attente du démarrage des services...
timeout /t 30 /nobreak >nul

REM Vérifier l'état des services
echo Vérification de l'état des services...
docker compose -f docker-compose.complete.yml ps

echo.
echo ============================================================
echo Configuration terminée !
echo.
echo Services disponibles :
echo - API Backend: http://localhost:3000
echo - Frontend: http://localhost:5173
echo - Gateway NestJS: http://localhost:3001
echo - Adminer (PostgreSQL): http://localhost:8080
echo - Mongo Express: http://localhost:8081
echo - Redis Commander: http://localhost:8082
echo.
echo Pour voir les logs : docker compose -f docker-compose.complete.yml logs -f
echo Pour arrêter : docker compose -f docker-compose.complete.yml down
echo ============================================================

pause