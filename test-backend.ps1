# Script PowerShell pour tester le backend SCI Solia Invest

Write-Host "🚀 Test de connexion backend SCI Solia Invest" -ForegroundColor Green

# 1. Vérifier si l'API est en cours d'exécution
Write-Host "`n1. Vérification du statut de l'API..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get -TimeoutSec 5
    Write-Host "✅ API en ligne:" -ForegroundColor Green
    Write-Host "   Status: $($healthResponse.status)"
    Write-Host "   Service: $($healthResponse.service)"
    Write-Host "   Timestamp: $($healthResponse.timestamp)"
} catch {
    Write-Host "❌ API non accessible. Démarrage nécessaire..." -ForegroundColor Red
    Write-Host "💡 Exécutez: cd packages\api && npm run dev" -ForegroundColor Cyan
    exit 1
}

# 2. Test d'enregistrement
Write-Host "`n2. Test d'enregistrement utilisateur..." -ForegroundColor Yellow

$registerData = @{
    name = "Test User"
    email = "test@example.com"
    password = "TestPass123!"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    Write-Host "✅ Enregistrement réussi:" -ForegroundColor Green
    Write-Host "   User ID: $($registerResponse.user.id)"
    Write-Host "   Name: $($registerResponse.user.name)"
    Write-Host "   Email: $($registerResponse.user.email)"
    
    $token = $registerResponse.token
    Write-Host "   Token généré: ✓" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur d'enregistrement: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test de connexion
Write-Host "`n3. Test de connexion..." -ForegroundColor Yellow

$loginData = @{
    email = "test@example.com"
    password = "TestPass123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "✅ Connexion réussie:" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.user.name)"
    Write-Host "   Email: $($loginResponse.user.email)"
    
    $token = $loginResponse.token
} catch {
    Write-Host "❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test d'authentification
Write-Host "`n4. Test d'authentification avec token..." -ForegroundColor Yellow

if ($token) {
    try {
        $headers = @{ Authorization = "Bearer $token" }
        $meResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method Get -Headers $headers
        Write-Host "✅ Authentification réussie:" -ForegroundColor Green
        Write-Host "   User authentifié: $($meResponse.user.name)"
        Write-Host "   Email: $($meResponse.user.email)"
    } catch {
        Write-Host "❌ Erreur d'authentification: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Pas de token disponible pour le test" -ForegroundColor Red
}

Write-Host "`n🎉 Tests terminés!" -ForegroundColor Green
Write-Host "📋 Backend SCI Solia Invest opérationnel" -ForegroundColor Cyan