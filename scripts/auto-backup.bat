@echo off
chcp 65001 >nul

set BACKUP_DIR=.\backups\postgres
set DB_NAME=scisoliainvest
set DB_USER=postgres

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=1-3 delims=/" %%a in ('%date%') do set mydate=%%c%%a%%b
for /f "tokens=1-2 delims=:" %%a in ('%time%') do set mytime=%%a%%b
set timestamp=%mydate%_%mytime%

set backup_file=%BACKUP_DIR%\%DB_NAME%_%timestamp%.sql

where pg_dump >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL non trouve
    exit /b 1
)

pg_dump -U %DB_USER% -d %DB_NAME% > "%backup_file%" 2>nul

if exist "%backup_file%" (
    echo Backup cree: %backup_file%
) else (
    echo Erreur backup
)

forfiles /p "%BACKUP_DIR%" /m *.sql /d -7 /c "cmd /c del @path" 2>nul