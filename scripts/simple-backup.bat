@echo off
chcp 65001 >nul
echo Configuration des backups PostgreSQL

REM Créer le répertoire de backup
if not exist ".\backups\postgres" mkdir ".\backups\postgres"
echo ✓ Répertoire de backup créé: .\backups\postgres

REM Vérifier si PostgreSQL est installé
where pg_dump >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL n'est pas installé ou pas dans le PATH
    echo Installez PostgreSQL depuis: https://www.postgresql.org/download/windows/
    echo Ou ajoutez PostgreSQL au PATH système
    pause
    exit /b 1
)

echo ✅ PostgreSQL trouvé
echo Pour créer un backup: pg_dump -U postgres -d scisoliainvest > backups\postgres\backup.sql