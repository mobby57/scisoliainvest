@echo off
REM Configuration des backups PostgreSQL pour SCI Solia Invest (Windows)
REM Usage: postgres-backup-config.bat [setup|backup|restore]

setlocal enabledelayedexpansion

REM Variables de configuration
if "%POSTGRES_DB%"=="" set POSTGRES_DB=scisoliainvest
if "%POSTGRES_USER%"=="" set POSTGRES_USER=postgres
if "%POSTGRES_HOST%"=="" set POSTGRES_HOST=localhost
if "%POSTGRES_PORT%"=="" set POSTGRES_PORT=5432
if "%BACKUP_DIR%"=="" set BACKUP_DIR=.\backups\postgres
if "%RETENTION_DAYS%"=="" set RETENTION_DAYS=7

REM Créer le répertoire de backup
:setup_backup_dir
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
echo ✓ Répertoire de backup créé: %BACKUP_DIR%
goto :eof

REM Backup complet
:create_backup
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%c%%a%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a%%b
set timestamp=%mydate%_%mytime%
set backup_file=%BACKUP_DIR%\%POSTGRES_DB%_backup_%timestamp%.sql

echo 🔄 Création du backup: %backup_file%

pg_dump -h %POSTGRES_HOST% -p %POSTGRES_PORT% -U %POSTGRES_USER% -d %POSTGRES_DB% --verbose --no-owner --no-privileges > "%backup_file%"

if exist "%backup_file%" (
    echo ✅ Backup créé: %backup_file%
) else (
    echo ❌ Erreur lors de la création du backup
    exit /b 1
)
goto :eof

REM Nettoyage des anciens backups
:cleanup_old_backups
echo 🧹 Nettoyage des backups anciens
forfiles /p "%BACKUP_DIR%" /s /m *.sql /d -%RETENTION_DAYS% /c "cmd /c del @path" 2>nul
echo ✅ Nettoyage terminé
goto :eof

REM Restauration
:restore_backup
set backup_file=%2
if "%backup_file%"=="" (
    echo Usage: %0 restore ^<backup_file^>
    exit /b 1
)

if not exist "%backup_file%" (
    echo ❌ Fichier de backup non trouvé: %backup_file%
    exit /b 1
)

echo 🔄 Restauration depuis: %backup_file%
psql -h %POSTGRES_HOST% -p %POSTGRES_PORT% -U %POSTGRES_USER% -d %POSTGRES_DB% < "%backup_file%"
echo ✅ Restauration terminée
goto :eof

REM Fonction principale
if "%1"=="backup" (
    call :setup_backup_dir
    call :create_backup
    call :cleanup_old_backups
) else if "%1"=="restore" (
    call :restore_backup %1 %2
) else (
    call :setup_backup_dir
    echo ✅ Configuration terminée
    echo Pour programmer un backup automatique, utilisez le Planificateur de tâches Windows
)