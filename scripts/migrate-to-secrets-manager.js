#!/usr/bin/env node

const { SecretsManager } = require('../packages/api/src/config/secrets');
const { KeyRotationService } = require('../packages/api/src/services/keyRotation');
const { EnvironmentManager } = require('../packages/api/src/config/environment');
const dotenv = require('dotenv');

dotenv.config();

async function migrateToSecretsManager() {
  console.log('🔄 Starting migration to AWS Secrets Manager...');

  try {
    // Initialize services
    const secretsManager = new SecretsManager({
      secretName: 'sci-solia',
      region: process.env.AWS_REGION || 'eu-west-1',
      kmsKeyId: process.env.KMS_KEY_ID
    });

    const keyRotationService = new KeyRotationService(secretsManager);
    const environmentManager = new EnvironmentManager();

    // Step 1: Initialize secrets in AWS Secrets Manager
    console.log('📝 Initializing secrets...');
    await keyRotationService.initializeSecrets();

    // Step 2: Encrypt sensitive environment variables
    console.log('🔐 Encrypting sensitive values...');
    await environmentManager.encryptSensitiveValues();

    // Step 3: Start rotation scheduler
    console.log('⏰ Starting key rotation scheduler...');
    keyRotationService.startRotationScheduler();

    // Step 4: Test configuration loading
    console.log('🧪 Testing configuration loading...');
    const config = await environmentManager.loadConfiguration();
    console.log('✅ Configuration loaded successfully');

    console.log('🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env files with encrypted values');
    console.log('2. Remove plain text secrets from .env files');
    console.log('3. Update your deployment scripts to use AWS Secrets Manager');
    console.log('4. Configure IAM roles for your application');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateToSecretsManager();
}

module.exports = { migrateToSecretsManager };