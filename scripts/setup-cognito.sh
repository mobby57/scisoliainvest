#!/bin/bash

# Configuration AWS Cognito automatique
set -e

# Variables
REGION="eu-west-1"
USER_POOL_NAME="scisoliai-users"
CLIENT_NAME="scisoliai-client"
DOMAIN_PREFIX="scisoliai-auth"

echo "🚀 Configuration AWS Cognito..."

# Créer User Pool
USER_POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name $USER_POOL_NAME \
  --policies "PasswordPolicy={MinimumLength=12,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=true}" \
  --auto-verified-attributes email \
  --username-attributes email \
  --region $REGION \
  --query 'UserPool.Id' --output text)

echo "✅ User Pool créé: $USER_POOL_ID"

# Créer App Client
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id $USER_POOL_ID \
  --client-name $CLIENT_NAME \
  --generate-secret \
  --explicit-auth-flows ADMIN_NO_SRP_AUTH ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --region $REGION \
  --query 'UserPoolClient.ClientId' --output text)

echo "✅ App Client créé: $CLIENT_ID"

# Obtenir Client Secret
CLIENT_SECRET=$(aws cognito-idp describe-user-pool-client \
  --user-pool-id $USER_POOL_ID \
  --client-id $CLIENT_ID \
  --region $REGION \
  --query 'UserPoolClient.ClientSecret' --output text)

# Créer Identity Pool
IDENTITY_POOL_ID=$(aws cognito-identity create-identity-pool \
  --identity-pool-name "scisoliai_identity" \
  --allow-unauthenticated-identities \
  --cognito-identity-providers ProviderName=cognito-idp.$REGION.amazonaws.com/$USER_POOL_ID,ClientId=$CLIENT_ID \
  --region $REGION \
  --query 'IdentityPoolId' --output text)

echo "✅ Identity Pool créé: $IDENTITY_POOL_ID"

# Générer fichier .env
cat > ../.env.cognito << EOF
# AWS Cognito Configuration
AWS_REGION=$REGION
COGNITO_USER_POOL_ID=$USER_POOL_ID
COGNITO_CLIENT_ID=$CLIENT_ID
COGNITO_CLIENT_SECRET=$CLIENT_SECRET
COGNITO_IDENTITY_POOL_ID=$IDENTITY_POOL_ID
COGNITO_DOMAIN=https://$DOMAIN_PREFIX.auth.$REGION.amazoncognito.com
EOF

echo "✅ Configuration sauvée dans .env.cognito"
echo "🎉 Configuration Cognito terminée!"