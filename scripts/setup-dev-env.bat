@echo off
echo ========================================
echo Configuration de l'environnement Docker
echo ========================================

echo.
echo 1. Arrêt des conteneurs existants...
docker-compose -f docker-compose.dev.yml down

echo.
echo 2. Suppression des volumes (optionnel)...
set /p cleanup="Voulez-vous supprimer les données existantes? (y/N): "
if /i "%cleanup%"=="y" (
    docker-compose -f docker-compose.dev.yml down -v
    docker volume prune -f
)

echo.
echo 3. Construction des images...
docker-compose -f docker-compose.dev.yml build --no-cache

echo.
echo 4. Démarrage des services...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo 5. Attente du démarrage des bases de données...
timeout /t 30 /nobreak

echo.
echo 6. Vérification de l'état des services...
docker-compose -f docker-compose.dev.yml ps

echo.
echo ========================================
echo Configuration terminée !
echo ========================================
echo.
echo Services disponibles:
echo - API: http://localhost:3000
echo - Frontend: http://localhost:5173
echo - Adminer (PostgreSQL): http://localhost:8080
echo - Mongo Express: http://localhost:8081
echo - Redis: localhost:6379
echo.
echo Pour voir les logs: docker-compose -f docker-compose.dev.yml logs -f
echo Pour arrêter: docker-compose -f docker-compose.dev.yml down
echo.
pause