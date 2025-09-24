@echo off
echo 🚀 Démarrage et test du backend SCI Solia Invest

echo 📂 Navigation vers le dossier API...
cd packages\api

echo 📦 Vérification des dépendances...
if not exist node_modules (
    echo Installation des dépendances...
    call npm install
)

echo 🔧 Démarrage du serveur en arrière-plan...
start /B npm run dev

echo ⏳ Attente du démarrage du serveur...
timeout /t 5 /nobreak >nul

echo 🧪 Lancement des tests de connexion...
cd ..\..
powershell -ExecutionPolicy Bypass -File test-backend.ps1

pause