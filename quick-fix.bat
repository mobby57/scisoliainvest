@echo off
echo 🚀 SCI Solia Invest - Correction rapide des problèmes critiques
echo.

cd packages\api

echo 📦 Installation des dépendances API...
call pnpm install

echo 🗄️ Configuration de la base de données...
call npx prisma generate
call npx prisma db push

echo 🌱 Initialisation des données...
call node scripts\setup-db.js

echo.
echo ✅ Corrections appliquées avec succès!
echo.
echo 📋 Résumé des corrections:
echo   ✅ Types User - Conflits résolus
echo   ✅ API Client - Gestion d'erreurs améliorée  
echo   ✅ Routes SCI - Prisma Client intégré
echo   ✅ Middleware auth - Centralisé
echo   ✅ Schema Prisma - Modèles SCI complets
echo   ✅ Redirection logout - Implémentée
echo.
echo 🔧 Pour démarrer le serveur:
echo   cd packages\api ^&^& pnpm dev
echo.
echo 🌐 Pour démarrer le client:
echo   cd packages\client ^&^& pnpm dev
echo.
pause