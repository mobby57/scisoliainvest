@echo off
echo 🚀 Démarrage du backend SCI Solia Invest...

cd packages\api

echo 📦 Installation des dépendances...
call npm install

echo 🔧 Démarrage du serveur...
call npm run dev

pause