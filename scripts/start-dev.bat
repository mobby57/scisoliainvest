@echo off
echo Démarrage de SCI Solia en mode développement...

echo Nettoyage des ports...
call cleanup-ports.bat

echo Démarrage des services...
cd /d "%~dp0\.."
pnpm dev

pause