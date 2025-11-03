const { 
  CognitoIdentityProviderClient, 
  CreateUserPoolCommand,
  CreateUserPoolClientCommand,
  DescribeUserPoolClientCommand 
} = require('@aws-sdk/client-cognito-identity-provider');
const { 
  CognitoIdentityClient, 
  CreateIdentityPoolCommand 
} = require('@aws-sdk/client-cognito-identity');
const fs = require('fs');

const REGION = 'eu-west-1';
const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });
const identityClient = new CognitoIdentityClient({ region: REGION });

async function setupCognito() {
  try {
    console.log('🚀 Configuration AWS Cognito...');

    // Créer User Pool
    const userPoolResponse = await cognitoClient.send(new CreateUserPoolCommand({
      PoolName: 'scisoliai-users',
      Policies: {
        PasswordPolicy: {
          MinimumLength: 12,
          RequireUppercase: true,
          RequireLowercase: true,
          RequireNumbers: true,
          RequireSymbols: true
        }
      },
      AutoVerifiedAttributes: ['email'],
      UsernameAttributes: ['email']
    }));

    const userPoolId = userPoolResponse.UserPool.Id;
    console.log('✅ User Pool créé:', userPoolId);

    // Créer App Client
    const clientResponse = await cognitoClient.send(new CreateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientName: 'scisoliai-client',
      GenerateSecret: true,
      ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH', 'ALLOW_USER_PASSWORD_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH']
    }));

    const clientId = clientResponse.UserPoolClient.ClientId;
    console.log('✅ App Client créé:', clientId);

    // Obtenir Client Secret
    const clientDetails = await cognitoClient.send(new DescribeUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientId: clientId
    }));

    const clientSecret = clientDetails.UserPoolClient.ClientSecret;

    // Créer Identity Pool
    const identityResponse = await identityClient.send(new CreateIdentityPoolCommand({
      IdentityPoolName: 'scisoliai_identity',
      AllowUnauthenticatedIdentities: true,
      CognitoIdentityProviders: [{
        ProviderName: `cognito-idp.${REGION}.amazonaws.com/${userPoolId}`,
        ClientId: clientId
      }]
    }));

    const identityPoolId = identityResponse.IdentityPoolId;
    console.log('✅ Identity Pool créé:', identityPoolId);

    // Générer fichier .env
    const envContent = `# AWS Cognito Configuration
AWS_REGION=${REGION}
COGNITO_USER_POOL_ID=${userPoolId}
COGNITO_CLIENT_ID=${clientId}
COGNITO_CLIENT_SECRET=${clientSecret}
COGNITO_IDENTITY_POOL_ID=${identityPoolId}
COGNITO_DOMAIN=https://scisoliai-auth.auth.${REGION}.amazoncognito.com
`;

    fs.writeFileSync('../.env.cognito', envContent);
    console.log('✅ Configuration sauvée dans .env.cognito');
    console.log('🎉 Configuration Cognito terminée!');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

setupCognito();