@echo off
echo 🚀 Installation et configuration AWS Cognito...

REM Installer les dépendances
npm install

REM Configurer AWS CLI si nécessaire
echo Vérification AWS CLI...
aws --version >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS CLI non installé. Installez-le d'abord.
    exit /b 1
)

REM Exécuter le script de configuration
echo Configuration Cognito...
node setup-cognito.js

echo ✅ Configuration terminée!
pause