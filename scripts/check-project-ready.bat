@echo off
echo 🚀 VERIFICATION DE LA PREPARATION DU PROJET SCI SOLIA INVEST
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé
    exit /b 1
)
echo ✅ Node.js installé

REM Vérifier si pnpm est installé
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pnpm n'est pas installé
    echo Installer avec: npm install -g pnpm
    exit /b 1
)
echo ✅ pnpm installé

REM Exécuter le script de vérification
echo.
echo 📋 Exécution des vérifications détaillées...
node scripts/check-project-ready.js

if %errorlevel% equ 0 (
    echo.
    echo 🎉 PROJET PRET POUR LE DEPLOIEMENT !
) else (
    echo.
    echo ❌ PROJET NON PRET - Voir les erreurs ci-dessus
)

pause