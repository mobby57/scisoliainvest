#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface EnvMigration {
  from: string;
  to: string;
  transform?: (value: string) => string;
}

const migrations: EnvMigration[] = [
  { from: 'DB_HOST', to: 'DATABASE_HOST' },
  { from: 'DB_PORT', to: 'DATABASE_PORT' },
  { from: 'DB_NAME', to: 'DATABASE_NAME' },
  { from: 'DB_USER', to: 'DATABASE_USER' },
  { from: 'DB_PASS', to: 'DATABASE_PASSWORD' },
  { from: 'JWT_SECRET', to: 'AUTH_JWT_SECRET' },
  { from: 'PORT', to: 'SERVER_PORT' },
];

function migrateEnvFile(filePath: string): void {
  if (!existsSync(filePath)) {
    console.log(`❌ Fichier ${filePath} introuvable`);
    return;
  }

  const content = readFileSync(filePath, 'utf-8');
  let newContent = content;
  let changed = false;

  migrations.forEach(({ from, to, transform }) => {
    const regex = new RegExp(`^${from}=(.*)$`, 'gm');
    const match = content.match(regex);
    
    if (match) {
      const value = match[0].split('=')[1];
      const newValue = transform ? transform(value) : value;
      
      newContent = newContent.replace(regex, `${to}=${newValue}`);
      console.log(`✅ ${from} → ${to}`);
      changed = true;
    }
  });

  if (changed) {
    writeFileSync(filePath, newContent);
    console.log(`📝 Fichier ${filePath} mis à jour`);
  } else {
    console.log(`ℹ️  Aucune migration nécessaire pour ${filePath}`);
  }
}

function main(): void {
  const envFiles = ['.env', '.env.local', '.env.production'];
  
  console.log('🔄 Migration des variables d\'environnement...\n');
  
  envFiles.forEach(file => {
    const filePath = join(process.cwd(), file);
    migrateEnvFile(filePath);
  });
  
  console.log('\n✨ Migration terminée');
}

if (require.main === module) {
  main();
}

export { migrateEnvFile, migrations };