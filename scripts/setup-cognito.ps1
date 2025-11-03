# Configuration AWS Cognito automatique
$ErrorActionPreference = "Stop"

# Variables
$REGION = "eu-west-1"
$USER_POOL_NAME = "scisoliai-users"
$CLIENT_NAME = "scisoliai-client"
$DOMAIN_PREFIX = "scisoliai-auth"
$AWS_CLI = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

Write-Host "🚀 Configuration AWS Cognito..." -ForegroundColor Green

# Créer User Pool
Write-Host "Création du User Pool..." -ForegroundColor Yellow
$USER_POOL_ID = & $AWS_CLI cognito-idp create-user-pool `
  --pool-name $USER_POOL_NAME `
  --policies "PasswordPolicy={MinimumLength=12,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=true}" `
  --auto-verified-attributes email `
  --username-attributes email `
  --region $REGION `
  --query 'UserPool.Id' --output text

Write-Host "✅ User Pool créé: $USER_POOL_ID" -ForegroundColor Green

# Créer App Client
Write-Host "Création de l'App Client..." -ForegroundColor Yellow
$CLIENT_ID = & $AWS_CLI cognito-idp create-user-pool-client `
  --user-pool-id $USER_POOL_ID `
  --client-name $CLIENT_NAME `
  --generate-secret `
  --explicit-auth-flows ADMIN_NO_SRP_AUTH ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH `
  --region $REGION `
  --query 'UserPoolClient.ClientId' --output text

Write-Host "✅ App Client créé: $CLIENT_ID" -ForegroundColor Green

# Obtenir Client Secret
Write-Host "Récupération du Client Secret..." -ForegroundColor Yellow
$CLIENT_SECRET = & $AWS_CLI cognito-idp describe-user-pool-client `
  --user-pool-id $USER_POOL_ID `
  --client-id $CLIENT_ID `
  --region $REGION `
  --query 'UserPoolClient.ClientSecret' --output text

# Créer Identity Pool
Write-Host "Création de l'Identity Pool..." -ForegroundColor Yellow
$IDENTITY_POOL_ID = & $AWS_CLI cognito-identity create-identity-pool `
  --identity-pool-name "scisoliai_identity" `
  --allow-unauthenticated-identities `
  --cognito-identity-providers "ProviderName=cognito-idp.$REGION.amazonaws.com/$USER_POOL_ID,ClientId=$CLIENT_ID" `
  --region $REGION `
  --query 'IdentityPoolId' --output text

Write-Host "✅ Identity Pool créé: $IDENTITY_POOL_ID" -ForegroundColor Green

# Générer fichier .env
$envContent = @"
# AWS Cognito Configuration
AWS_REGION=$REGION
COGNITO_USER_POOL_ID=$USER_POOL_ID
COGNITO_CLIENT_ID=$CLIENT_ID
COGNITO_CLIENT_SECRET=$CLIENT_SECRET
COGNITO_IDENTITY_POOL_ID=$IDENTITY_POOL_ID
COGNITO_DOMAIN=https://$DOMAIN_PREFIX.auth.$REGION.amazoncognito.com
"@

$envContent | Out-File -FilePath ".\.env.cognito" -Encoding UTF8

Write-Host "✅ Configuration sauvée dans .env.cognito" -ForegroundColor Green
Write-Host "🎉 Configuration Cognito terminée!" -ForegroundColor Green