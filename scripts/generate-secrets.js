#!/usr/bin/env node
/**
 * 🔐 Générateur de Secrets Sécurisés pour SCI Solia Invest
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const generateSecureSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString('base64url');
};

const generateSecrets = () => {
  const secrets = {
    JWT_SECRET: generateJWTSecret(),
    JWT_REFRESH_SECRET: generateJWTSecret(),
    SECRET_KEY_BASE: generateSecureSecret(64),
    DEVISE_SECRET_KEY: generateSecureSecret(32),
    RAILS_MASTER_KEY: generateSecureSecret(16),
    SESSION_SECRET: generateSecureSecret(32),
    ENCRYPTION_KEY: generateSecureSecret(32),
    API_KEY: generateSecureSecret(24),
    WEBHOOK_SECRET: generateSecureSecret(32)
  };

  console.log('🔐 Secrets Générés (À COPIER DANS VOTRE .env SÉCURISÉ):');
  console.log('=' .repeat(60));
  
  Object.entries(secrets).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });

  console.log('=' .repeat(60));
  console.log('⚠️  IMPORTANT: Stockez ces secrets de manière sécurisée');
  console.log('⚠️  NE JAMAIS commiter ces valeurs dans Git');
  console.log('⚠️  Utilisez un gestionnaire de secrets en production');

  // Optionnel: sauvegarder dans un fichier temporaire
  const secretsFile = path.join(process.cwd(), '.env.secrets.tmp');
  const envContent = Object.entries(secrets)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(secretsFile, envContent);
  console.log(`\n📁 Secrets sauvegardés temporairement dans: ${secretsFile}`);
  console.log('🗑️  Supprimez ce fichier après utilisation');
};

generateSecrets();