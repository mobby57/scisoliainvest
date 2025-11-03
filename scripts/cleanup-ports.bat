@echo off
echo Nettoyage des ports SCI Solia...

echo Recherche des processus sur les ports principaux...
for %%p in (8001 3000 3001 3002 3003 3004 3005) do (
    echo Vérification du port %%p...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p') do (
        if not "%%a"=="0" (
            echo Arrêt du processus %%a sur le port %%p
            taskkill /PID %%a /F >nul 2>&1
        )
    )
)

echo Nettoyage terminé.
pause