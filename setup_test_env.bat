@echo off
REM ###############################################################################
REM Script de configuration de l'environnement de test Python
REM Pour Windows
REM ###############################################################################

setlocal enabledelayedexpansion

echo ========================================
echo Configuration de l'environnement de test
echo ========================================
echo.

REM Étape 1: Création de l'environnement virtuel
echo Étape 1/5: Création de l'environnement virtuel...
if exist "venv" (
    echo ⚠️  L'environnement virtuel existe déjà.
    set /p "RECREATE=Voulez-vous le supprimer et le recréer? (o/n): "
    if /i "!RECREATE!"=="o" (
        echo Suppression de l'environnement existant...
        rmdir /s /q venv
        echo Création d'un nouvel environnement virtuel...
        python -m venv venv
        if errorlevel 1 (
            echo ❌ Erreur lors de la création de l'environnement virtuel.
            exit /b 1
        )
        echo ✅ Nouvel environnement virtuel créé.
    ) else (
        echo Utilisation de l'environnement virtuel existant.
    )
) else (
    echo Création de l'environnement virtuel...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ Erreur lors de la création de l'environnement virtuel.
        echo Assurez-vous que Python 3 est installé et dans le PATH.
        exit /b 1
    )
    echo ✅ Environnement virtuel créé avec succès.
)
echo.

REM Étape 2: Activation de l'environnement virtuel
echo Étape 2/5: Activation de l'environnement virtuel...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ Erreur lors de l'activation de l'environnement virtuel.
    exit /b 1
)
echo ✅ Environnement virtuel activé.
echo.

REM Étape 3: Mise à jour de pip
echo Étape 3/5: Mise à jour de pip...
python -m pip install --upgrade pip --quiet
if errorlevel 1 (
    echo ⚠️  Avertissement: Impossible de mettre à jour pip.
) else (
    echo ✅ pip mis à jour.
)
echo.

REM Étape 4: Installation des dépendances de test
echo Étape 4/5: Installation des dépendances de test...
if exist "requirements-test.txt" (
    pip install -r requirements-test.txt
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation des dépendances.
        exit /b 1
    )
    echo ✅ Dépendances installées avec succès.
) else (
    echo ❌ Erreur: Le fichier requirements-test.txt est introuvable.
    exit /b 1
)
echo.

REM Étape 5: Vérification de l'installation
echo Étape 5/5: Vérification de l'installation...
python -c "import pytest" 2>nul
if errorlevel 1 (
    echo ❌ Erreur: pytest n'est pas installé correctement.
    exit /b 1
) else (
    echo ✅ pytest est correctement installé.
    for /f "delims=" %%i in ('pytest --version 2^>^&1') do (
        echo    Version: %%i
        goto :version_done
    )
    :version_done
)
echo.

REM Exécution des tests avec pytest
echo ========================================
echo Exécution des tests avec pytest
echo ========================================
echo.

REM Vérifier s'il existe des fichiers de test
dir /s /b test_*.py *_test.py 2>nul | findstr /r ".*" >nul
if errorlevel 1 (
    echo ℹ️  Aucun fichier de test trouvé (test_*.py ou *_test.py).
    echo    Créez des tests dans le répertoire du projet pour les exécuter avec pytest.
) else (
    echo Lancement des tests unitaires...
    pytest -v --tb=short
    
    if errorlevel 1 (
        echo.
        echo ⚠️  Certains tests ont échoué. Veuillez consulter le résumé ci-dessus.
    ) else (
        echo.
        echo ✅ Tous les tests sont passés avec succès!
    )
)

echo.
echo ========================================
echo Configuration terminée
echo ========================================
echo.
echo Pour activer l'environnement virtuel manuellement:
echo   venv\Scripts\activate
echo.
echo Pour désactiver l'environnement virtuel:
echo   deactivate
echo.
echo Pour exécuter les tests:
echo   pytest
echo ========================================
echo.

pause
