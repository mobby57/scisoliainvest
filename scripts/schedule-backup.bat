@echo off
chcp 65001 >nul

echo Programmation backup automatique...

REM Créer tâche planifiée (quotidienne à 2h00)
schtasks /create /tn "SCI_Backup_Daily" /tr "%cd%\scripts\auto-backup.bat" /sc daily /st 02:00 /f

if %errorlevel% equ 0 (
    echo ✅ Backup automatique programmé quotidiennement à 2h00
    echo Nom de la tâche: SCI_Backup_Daily
) else (
    echo ❌ Erreur programmation
)