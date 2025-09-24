Write-Host "Test de connexion backend SCI Solia Invest" -ForegroundColor Green

# Test Health Check
Write-Host "1. Test Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
    Write-Host "OK - API en ligne: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "ERREUR - API non accessible" -ForegroundColor Red
    exit 1
}

# Test Register
Write-Host "2. Test Register..." -ForegroundColor Yellow
$registerData = '{"name":"Test User","email":"test@example.com","password":"TestPass123!"}'
try {
    $register = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    Write-Host "OK - Utilisateur cree: $($register.user.name)" -ForegroundColor Green
    $token = $register.token
} catch {
    Write-Host "ERREUR - Enregistrement echoue" -ForegroundColor Red
}

# Test Login
Write-Host "3. Test Login..." -ForegroundColor Yellow
$loginData = '{"email":"test@example.com","password":"TestPass123!"}'
try {
    $login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "OK - Connexion reussie: $($login.user.email)" -ForegroundColor Green
    $token = $login.token
} catch {
    Write-Host "ERREUR - Connexion echouee" -ForegroundColor Red
}

# Test Auth
Write-Host "4. Test Auth Token..." -ForegroundColor Yellow
if ($token) {
    try {
        $headers = @{ Authorization = "Bearer $token" }
        $me = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method Get -Headers $headers
        Write-Host "OK - Token valide pour: $($me.user.name)" -ForegroundColor Green
    } catch {
        Write-Host "ERREUR - Token invalide" -ForegroundColor Red
    }
}

Write-Host "Tests termines!" -ForegroundColor Cyan