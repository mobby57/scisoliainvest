#!/usr/bin/env node

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class SecretsManagerSetup {
  constructor() {
    this.secretsManager = new AWS.SecretsManager({
      region: process.env.AWS_REGION || 'eu-west-1'
    });
    this.secretsToMigrate = [
      'DATABASE_URL',
      'JWT_SECRET',
      'REDIS_URL',
      'MONGODB_URI',
      'STRIPE_SECRET_KEY',
      'SENDGRID_API_KEY'
    ];
  }

  async createSecret(name, value) {
    try {
      await this.secretsManager.createSecret({
        Name: `sci-solia/${name}`,
        SecretString: value,
        Description: `Secret for ${name} - SCI Solia Invest`
      }).promise();
      console.log(`✅ Secret ${name} créé avec succès`);
    } catch (error) {
      if (error.code === 'ResourceExistsException') {
        await this.updateSecret(name, value);
      } else {
        console.error(`❌ Erreur création ${name}:`, error.message);
      }
    }
  }

  async updateSecret(name, value) {
    try {
      await this.secretsManager.updateSecret({
        SecretId: `sci-solia/${name}`,
        SecretString: value
      }).promise();
      console.log(`🔄 Secret ${name} mis à jour`);
    } catch (error) {
      console.error(`❌ Erreur mise à jour ${name}:`, error.message);
    }
  }

  loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return {};
    
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    
    content.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
    
    return env;
  }

  async migrateSecrets() {
    console.log('🚀 Migration des secrets vers AWS Secrets Manager...');
    
    const envFiles = [
      '.env',
      '.env.production',
      'packages/api/.env'
    ];

    for (const envFile of envFiles) {
      const envPath = path.join(process.cwd(), envFile);
      const env = this.loadEnvFile(envPath);
      
      for (const secretName of this.secretsToMigrate) {
        if (env[secretName]) {
          await this.createSecret(secretName, env[secretName]);
        }
      }
    }
  }

  async generateIAMPolicy() {
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: [
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret"
          ],
          Resource: "arn:aws:secretsmanager:*:*:secret:sci-solia/*"
        }
      ]
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'infrastructure/aws/secrets-policy.json'),
      JSON.stringify(policy, null, 2)
    );
    
    console.log('📋 Politique IAM générée: infrastructure/aws/secrets-policy.json');
  }
}

async function main() {
  try {
    const setup = new SecretsManagerSetup();
    await setup.migrateSecrets();
    await setup.generateIAMPolicy();
    console.log('✅ Migration terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur migration:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = SecretsManagerSetup;