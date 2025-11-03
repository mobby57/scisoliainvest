#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

const PROJECT_ROOT = process.cwd();
const PACKAGES = ['api', 'client'];

class ProjectReadinessChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  log(message, type = 'info') {
    const colors = {
      success: chalk.green,
      error: chalk.red,
      warning: chalk.yellow,
      info: chalk.blue
    };
    console.log(colors[type](`${type.toUpperCase()}: ${message}`));
  }

  addResult(message, type, category) {
    this[category].push({ message, type });
    this.log(message, type);
  }

  // Vérification des fichiers essentiels
  checkEssentialFiles() {
    this.log('\n🔍 Vérification des fichiers essentiels...', 'info');
    
    const essentialFiles = [
      'package.json',
      'pnpm-workspace.yaml',
      'docker-compose.yml',
      '.env.example',
      'packages/api/package.json',
      'packages/client/package.json',
      'packages/api/tsconfig.json',
      'packages/client/tsconfig.json'
    ];

    essentialFiles.forEach(file => {
      const filePath = join(PROJECT_ROOT, file);
      if (existsSync(filePath)) {
        this.addResult(`✅ ${file} existe`, 'success', 'passed');
      } else {
        this.addResult(`❌ ${file} manquant`, 'error', 'errors');
      }
    });
  }

  // Vérification des variables d'environnement
  checkEnvironmentFiles() {
    this.log('\n🌍 Vérification des variables d\'environnement...', 'info');
    
    const envFiles = [
      '.env',
      'packages/api/.env',
      'packages/client/.env'
    ];

    envFiles.forEach(file => {
      const filePath = join(PROJECT_ROOT, file);
      if (existsSync(filePath)) {
        this.addResult(`✅ ${file} existe`, 'success', 'passed');
      } else {
        this.addResult(`⚠️ ${file} manquant (optionnel en dev)`, 'warning', 'warnings');
      }
    });
  }

  // Vérification des dépendances
  checkDependencies() {
    this.log('\n📦 Vérification des dépendances...', 'info');
    
    try {
      // Vérifier si pnpm est installé
      execSync('pnpm --version', { stdio: 'pipe' });
      this.addResult('✅ pnpm installé', 'success', 'passed');
    } catch {
      this.addResult('❌ pnpm non installé', 'error', 'errors');
      return;
    }

    // Vérifier node_modules
    if (existsSync(join(PROJECT_ROOT, 'node_modules'))) {
      this.addResult('✅ node_modules existe', 'success', 'passed');
    } else {
      this.addResult('❌ node_modules manquant - exécuter: pnpm install', 'error', 'errors');
    }

    // Vérifier les dépendances des packages
    PACKAGES.forEach(pkg => {
      const nodeModulesPath = join(PROJECT_ROOT, 'packages', pkg, 'node_modules');
      if (existsSync(nodeModulesPath)) {
        this.addResult(`✅ Dépendances ${pkg} installées`, 'success', 'passed');
      } else {
        this.addResult(`⚠️ Dépendances ${pkg} manquantes`, 'warning', 'warnings');
      }
    });
  }

  // Vérification de la compilation TypeScript
  checkTypeScript() {
    this.log('\n🔧 Vérification TypeScript...', 'info');
    
    PACKAGES.forEach(pkg => {
      try {
        const cwd = join(PROJECT_ROOT, 'packages', pkg);
        execSync('pnpm tsc --noEmit', { cwd, stdio: 'pipe' });
        this.addResult(`✅ TypeScript ${pkg} valide`, 'success', 'passed');
      } catch (error) {
        this.addResult(`❌ Erreurs TypeScript dans ${pkg}`, 'error', 'errors');
      }
    });
  }

  // Vérification des tests
  checkTests() {
    this.log('\n🧪 Vérification des tests...', 'info');
    
    PACKAGES.forEach(pkg => {
      try {
        const cwd = join(PROJECT_ROOT, 'packages', pkg);
        execSync('pnpm test:unit', { cwd, stdio: 'pipe' });
        this.addResult(`✅ Tests ${pkg} passent`, 'success', 'passed');
      } catch (error) {
        this.addResult(`❌ Tests ${pkg} échouent`, 'error', 'errors');
      }
    });
  }

  // Vérification du linting
  checkLinting() {
    this.log('\n📏 Vérification du linting...', 'info');
    
    PACKAGES.forEach(pkg => {
      try {
        const cwd = join(PROJECT_ROOT, 'packages', pkg);
        execSync('pnpm lint', { cwd, stdio: 'pipe' });
        this.addResult(`✅ Linting ${pkg} OK`, 'success', 'passed');
      } catch (error) {
        this.addResult(`⚠️ Problèmes de linting dans ${pkg}`, 'warning', 'warnings');
      }
    });
  }

  // Vérification de la base de données
  checkDatabase() {
    this.log('\n🗄️ Vérification de la base de données...', 'info');
    
    // Vérifier Prisma
    const prismaPath = join(PROJECT_ROOT, 'packages/api/prisma');
    if (existsSync(prismaPath)) {
      this.addResult('✅ Dossier Prisma existe', 'success', 'passed');
      
      // Vérifier le schéma
      const schemaPath = join(prismaPath, 'schema.prisma');
      if (existsSync(schemaPath)) {
        this.addResult('✅ Schéma Prisma existe', 'success', 'passed');
      } else {
        this.addResult('❌ Schéma Prisma manquant', 'error', 'errors');
      }
    } else {
      this.addResult('❌ Configuration Prisma manquante', 'error', 'errors');
    }
  }

  // Vérification Docker
  checkDocker() {
    this.log('\n🐳 Vérification Docker...', 'info');
    
    try {
      execSync('docker --version', { stdio: 'pipe' });
      this.addResult('✅ Docker installé', 'success', 'passed');
    } catch {
      this.addResult('⚠️ Docker non installé', 'warning', 'warnings');
    }

    // Vérifier les Dockerfiles
    const dockerfiles = [
      'packages/api/Dockerfile',
      'packages/client/Dockerfile'
    ];

    dockerfiles.forEach(file => {
      if (existsSync(join(PROJECT_ROOT, file))) {
        this.addResult(`✅ ${file} existe`, 'success', 'passed');
      } else {
        this.addResult(`⚠️ ${file} manquant`, 'warning', 'warnings');
      }
    });
  }

  // Vérification de la sécurité
  checkSecurity() {
    this.log('\n🔒 Vérification de la sécurité...', 'info');
    
    // Vérifier les vulnérabilités
    try {
      execSync('pnpm audit --audit-level moderate', { stdio: 'pipe' });
      this.addResult('✅ Aucune vulnérabilité critique', 'success', 'passed');
    } catch {
      this.addResult('⚠️ Vulnérabilités détectées - exécuter: pnpm audit fix', 'warning', 'warnings');
    }

    // Vérifier les fichiers sensibles
    const sensitiveFiles = ['.env', 'packages/api/.env'];
    sensitiveFiles.forEach(file => {
      if (existsSync(join(PROJECT_ROOT, file))) {
        this.addResult(`⚠️ ${file} présent - vérifier qu'il n'est pas commité`, 'warning', 'warnings');
      }
    });
  }

  // Vérification de la build
  checkBuild() {
    this.log('\n🏗️ Vérification de la build...', 'info');
    
    PACKAGES.forEach(pkg => {
      try {
        const cwd = join(PROJECT_ROOT, 'packages', pkg);
        execSync('pnpm build', { cwd, stdio: 'pipe' });
        this.addResult(`✅ Build ${pkg} réussie`, 'success', 'passed');
      } catch (error) {
        this.addResult(`❌ Build ${pkg} échoue`, 'error', 'errors');
      }
    });
  }

  // Rapport final
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log(chalk.bold.blue('📊 RAPPORT DE VÉRIFICATION DU PROJET'));
    console.log('='.repeat(60));

    console.log(chalk.green(`\n✅ SUCCÈS (${this.passed.length}):`));
    this.passed.forEach(item => console.log(`  • ${item.message}`));

    if (this.warnings.length > 0) {
      console.log(chalk.yellow(`\n⚠️ AVERTISSEMENTS (${this.warnings.length}):`));
      this.warnings.forEach(item => console.log(`  • ${item.message}`));
    }

    if (this.errors.length > 0) {
      console.log(chalk.red(`\n❌ ERREURS (${this.errors.length}):`));
      this.errors.forEach(item => console.log(`  • ${item.message}`));
    }

    console.log('\n' + '='.repeat(60));
    
    if (this.errors.length === 0) {
      console.log(chalk.green.bold('🎉 PROJET PRÊT POUR LE DÉPLOIEMENT !'));
      if (this.warnings.length > 0) {
        console.log(chalk.yellow('⚠️ Quelques avertissements à considérer.'));
      }
    } else {
      console.log(chalk.red.bold('❌ PROJET NON PRÊT - Corriger les erreurs avant le déploiement.'));
    }

    console.log('='.repeat(60));
    
    return this.errors.length === 0;
  }

  // Exécution complète
  async run() {
    console.log(chalk.blue.bold('🚀 VÉRIFICATION DE LA PRÉPARATION DU PROJET SCI SOLIA INVEST'));
    console.log(chalk.gray('Vérification en cours...'));

    this.checkEssentialFiles();
    this.checkEnvironmentFiles();
    this.checkDependencies();
    this.checkTypeScript();
    this.checkTests();
    this.checkLinting();
    this.checkDatabase();
    this.checkDocker();
    this.checkSecurity();
    this.checkBuild();

    return this.generateReport();
  }
}

// Exécution du script
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new ProjectReadinessChecker();
  checker.run().then(isReady => {
    process.exit(isReady ? 0 : 1);
  }).catch(error => {
    console.error(chalk.red('Erreur lors de la vérification:'), error);
    process.exit(1);
  });
}

export default ProjectReadinessChecker;