# Script PowerShell pour tester les routes SCI
Write-Host "=== Test des Routes SCI ===" -ForegroundColor Green

# Démarrer le serveur de test en arrière-plan
Write-Host "Démarrage du serveur de test..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "packages\api\sci-test-server.cjs" -PassThru -WindowStyle Hidden

# Attendre que le serveur démarre
Start-Sleep -Seconds 3

try {
    # Vérifier si Newman est installé
    $newmanInstalled = Get-Command newman -ErrorAction SilentlyContinue
    if (-not $newmanInstalled) {
        Write-Host "Installation de Newman..." -ForegroundColor Yellow
        npm install -g newman
    }

    # Exécuter les tests Postman
    Write-Host "Exécution des tests Postman..." -ForegroundColor Yellow
    newman run "SCI_Routes_Validation.postman_collection.json" --reporters cli,json --reporter-json-export sci-test-results.json

    Write-Host "Tests terminés. Résultats sauvegardés dans sci-test-results.json" -ForegroundColor Green
}
catch {
    Write-Host "Erreur lors de l'exécution des tests: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # Arrêter le serveur de test
    Write-Host "Arrêt du serveur de test..." -ForegroundColor Yellow
    if ($serverProcess -and !$serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force
    }
}

Write-Host "=== Fin des tests ===" -ForegroundColor Green