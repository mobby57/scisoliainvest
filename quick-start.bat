@echo off
echo 🚀 Démarrage rapide SCI Solia Invest
echo.

echo 📦 Installation des dépendances...
call pnpm install

echo 🗄️ Configuration de la base de données...
cd packages\api
call node scripts\setup-db.js

echo 🔧 Génération du client Prisma...
call npx prisma generate

echo ✅ Configuration terminée!
echo.
echo Pour démarrer le projet:
echo   - Backend: cd packages\api && pnpm dev
echo   - Frontend: cd packages\client && pnpm dev
echo.
pause