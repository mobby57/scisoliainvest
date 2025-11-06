#!/usr/bin/env node

/**
 * Project Audit Script for SCI Solia Invest
 * This script analyzes the project structure, identifies missing files,
 * and generates a comprehensive report for project readiness.
 */

const fs = require('fs');
const path = require('path');

// Expected project structure based on ARCHITECTURE.md and standard practices
const EXPECTED_STRUCTURE = {
  'packages/api': {
    required: [
      'package.json',
      'tsconfig.json',
      'README.md',
      'src/index.ts',
      'src/server.ts',
      'src/config/env.ts',
      'src/config/logger.ts',
      'src/config/database.ts',
      'src/controllers/.gitkeep',
      'src/middleware/auth.middleware.ts',
      'src/middleware/errorHandler.ts',
      'src/middleware/validation.middleware.ts',
      'src/middleware/security.ts',
      'src/middleware/rateLimiter.ts',
      'src/middleware/csrf.ts',
      'src/middleware/audit.middleware.ts',
      'src/models/User.ts',
      'src/routes/index.ts',
      'src/routes/auth.routes.ts',
      'src/routes/users.routes.ts',
      'src/services/.gitkeep',
      'src/utils/validators.ts',
      'src/utils/encryption.ts',
      'src/types/index.ts',
      'src/types/express.d.ts',
      'tests/setup.ts',
      'tests/utils/testHelpers.ts',
      'prisma/schema.prisma',
      '.env.example',
    ],
    optional: [
      'src/config/redis.ts',
      'src/models/Document.ts',
      'src/models/Notification.ts',
      'src/models/AuditLog.ts',
      'src/routes/documents.routes.ts',
      'src/routes/distribution.routes.ts',
      'src/routes/financial-flow.routes.ts',
      'tests/__mocks__/jwt.mock.ts',
      'dist/',
      'node_modules/',
    ]
  },
  'backend': {
    required: [
      'package.json',
      'server.js',
      '.env.example',
      'README.md',
    ],
    optional: [
      'node_modules/',
      'uploads/',
    ]
  },
  'frontend': {
    required: [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'README.md',
      '.env.example',
    ],
    optional: [
      'node_modules/',
      '.next/',
    ]
  },
  'root': {
    required: [
      'package.json',
      'pnpm-workspace.yaml',
      'README.md',
      '.gitignore',
      'docker-compose.yml',
      'Dockerfile.backend',
      'Dockerfile.frontend',
    ],
    optional: [
      'node_modules/',
      'pnpm-lock.yaml',
      '.vscode/',
      '.github/',
    ]
  }
};

// File categories for organization
const FILE_CATEGORIES = {
  configuration: ['.json', '.yaml', '.yml', '.env', '.env.example', '.config.js', '.config.ts', 'tsconfig', 'package.json'],
  source: ['.ts', '.tsx', '.js', '.jsx'],
  documentation: ['.md', '.txt'],
  tests: ['test.', 'spec.', '.test.', '.spec.', '__tests__', 'tests/'],
  scripts: ['scripts/', '.sh', '.bat', '.ps1'],
  infrastructure: ['docker', 'Dockerfile', 'k8s/', 'infrastructure/'],
  assets: ['.css', '.scss', '.png', '.jpg', '.svg', '.ico'],
  database: ['prisma/', 'migrations/', '.sql', 'schema.'],
};

class ProjectAuditor {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.findings = {
      existing: {},
      missing: {},
      categorized: {},
      statistics: {}
    };
  }

  /**
   * Scan directory recursively and collect files
   */
  scanDirectory(dir, baseDir = '') {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(baseDir, entry.name);

      // Skip node_modules, .git, and other build artifacts
      if (this.shouldSkip(entry.name, relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        files.push({
          type: 'directory',
          path: relativePath,
          name: entry.name
        });
        files.push(...this.scanDirectory(fullPath, relativePath));
      } else {
        files.push({
          type: 'file',
          path: relativePath,
          name: entry.name,
          size: fs.statSync(fullPath).size,
          extension: path.extname(entry.name)
        });
      }
    }

    return files;
  }

  /**
   * Determine if file/directory should be skipped
   */
  shouldSkip(name, relativePath) {
    const skipPatterns = [
      'node_modules',
      '.git',
      '.next',
      'dist',
      'build',
      'coverage',
      '.tsbuildinfo',
      'pnpm-lock.yaml',
      'package-lock.json',
    ];

    return skipPatterns.some(pattern => 
      name === pattern || relativePath.includes(pattern)
    );
  }

  /**
   * Categorize a file based on its characteristics
   */
  categorizeFile(file) {
    const filePath = file.path.toLowerCase();
    const fileName = file.name.toLowerCase();

    for (const [category, patterns] of Object.entries(FILE_CATEGORIES)) {
      for (const pattern of patterns) {
        if (fileName.includes(pattern) || filePath.includes(pattern)) {
          return category;
        }
      }
    }

    return 'other';
  }

  /**
   * Check for missing files based on expected structure
   */
  checkMissingFiles() {
    const missing = {};

    for (const [location, structure] of Object.entries(EXPECTED_STRUCTURE)) {
      const basePath = location === 'root' ? this.projectRoot : path.join(this.projectRoot, location);
      
      missing[location] = {
        required: [],
        optional: []
      };

      // Check required files
      for (const requiredFile of structure.required) {
        const fullPath = path.join(basePath, requiredFile);
        if (!this.fileExists(fullPath)) {
          missing[location].required.push(requiredFile);
        }
      }

      // Check optional files
      for (const optionalFile of structure.optional) {
        const fullPath = path.join(basePath, optionalFile);
        if (!this.fileExists(fullPath)) {
          missing[location].optional.push(optionalFile);
        }
      }
    }

    return missing;
  }

  /**
   * Check if file or directory exists
   */
  fileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Perform complete audit
   */
  performAudit() {
    console.log('🔍 Starting project audit...\n');

    // Scan all files
    const allFiles = this.scanDirectory(this.projectRoot);
    this.findings.existing.all = allFiles;
    this.findings.existing.files = allFiles.filter(f => f.type === 'file');
    this.findings.existing.directories = allFiles.filter(f => f.type === 'directory');

    // Categorize files
    for (const file of this.findings.existing.files) {
      const category = this.categorizeFile(file);
      if (!this.findings.categorized[category]) {
        this.findings.categorized[category] = [];
      }
      this.findings.categorized[category].push(file);
    }

    // Check for missing files
    this.findings.missing = this.checkMissingFiles();

    // Calculate statistics
    this.findings.statistics = {
      totalFiles: this.findings.existing.files.length,
      totalDirectories: this.findings.existing.directories.length,
      categoryCounts: Object.entries(this.findings.categorized).reduce((acc, [cat, files]) => {
        acc[cat] = files.length;
        return acc;
      }, {}),
      missingRequired: Object.values(this.findings.missing).reduce((acc, loc) => 
        acc + loc.required.length, 0
      ),
      missingOptional: Object.values(this.findings.missing).reduce((acc, loc) => 
        acc + loc.optional.length, 0
      )
    };

    console.log('✅ Audit complete!\n');
    return this.findings;
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    const findings = this.findings;
    let report = '';

    report += '═══════════════════════════════════════════════════════════════\n';
    report += '          SCI SOLIA INVEST - AUDIT DE PROJET\n';
    report += '═══════════════════════════════════════════════════════════════\n\n';

    // Statistics
    report += '📊 STATISTIQUES GÉNÉRALES\n';
    report += '─────────────────────────────────────────────────────────────\n';
    report += `  Fichiers totaux:           ${findings.statistics.totalFiles}\n`;
    report += `  Répertoires:               ${findings.statistics.totalDirectories}\n`;
    report += `  Fichiers requis manquants: ${findings.statistics.missingRequired}\n`;
    report += `  Fichiers optionnels manqu: ${findings.statistics.missingOptional}\n\n`;

    // Files by category
    report += '📁 FICHIERS PAR CATÉGORIE\n';
    report += '─────────────────────────────────────────────────────────────\n';
    for (const [category, count] of Object.entries(findings.statistics.categoryCounts)) {
      report += `  ${category.padEnd(20)}: ${count}\n`;
    }
    report += '\n';

    // Missing files (CRITICAL)
    report += '❌ FICHIERS MANQUANTS CRITIQUES\n';
    report += '─────────────────────────────────────────────────────────────\n';
    let hasCriticalMissing = false;
    for (const [location, files] of Object.entries(findings.missing)) {
      if (files.required.length > 0) {
        hasCriticalMissing = true;
        report += `\n  📍 ${location}/\n`;
        for (const file of files.required) {
          report += `     ❌ ${file}\n`;
        }
      }
    }
    if (!hasCriticalMissing) {
      report += '  ✅ Aucun fichier critique manquant!\n';
    }
    report += '\n';

    // Missing optional files
    report += '⚠️  FICHIERS OPTIONNELS MANQUANTS\n';
    report += '─────────────────────────────────────────────────────────────\n';
    let hasOptionalMissing = false;
    for (const [location, files] of Object.entries(findings.missing)) {
      if (files.optional.length > 0) {
        hasOptionalMissing = true;
        report += `\n  📍 ${location}/\n`;
        for (const file of files.optional) {
          report += `     ⚠️  ${file}\n`;
        }
      }
    }
    if (!hasOptionalMissing) {
      report += '  ✅ Tous les fichiers optionnels sont présents!\n';
    }
    report += '\n';

    // Detailed file listing by category
    report += '📋 INVENTAIRE DÉTAILLÉ DES FICHIERS\n';
    report += '─────────────────────────────────────────────────────────────\n';
    for (const [category, files] of Object.entries(findings.categorized)) {
      report += `\n  ${category.toUpperCase()} (${files.length} fichiers)\n`;
      const sortedFiles = files.sort((a, b) => a.path.localeCompare(b.path));
      for (const file of sortedFiles.slice(0, 20)) { // Limit to first 20
        report += `    • ${file.path}\n`;
      }
      if (files.length > 20) {
        report += `    ... et ${files.length - 20} autres fichiers\n`;
      }
    }
    report += '\n';

    // Recommendations
    report += '💡 RECOMMANDATIONS\n';
    report += '─────────────────────────────────────────────────────────────\n';
    
    if (findings.statistics.missingRequired > 0) {
      report += '  🔴 PRIORITÉ HAUTE:\n';
      report += '     1. Créer les fichiers critiques manquants listés ci-dessus\n';
      report += '     2. Vérifier la configuration de packages/api/\n';
      report += '     3. Initialiser Prisma avec un schéma de base\n\n';
    }

    report += '  🟡 PRIORITÉ MOYENNE:\n';
    report += '     1. Ajouter des tests unitaires et d\'intégration\n';
    report += '     2. Compléter la documentation README pour chaque package\n';
    report += '     3. Configurer les variables d\'environnement (.env.example)\n\n';

    report += '  🟢 AMÉLIORATIONS:\n';
    report += '     1. Ajouter un système de CI/CD (.github/workflows/)\n';
    report += '     2. Configurer ESLint et Prettier de manière cohérente\n';
    report += '     3. Ajouter des scripts de déploiement automatisés\n\n';

    // Project readiness score
    const totalExpected = findings.statistics.missingRequired + findings.statistics.missingOptional + findings.statistics.totalFiles;
    const readinessScore = Math.round((findings.statistics.totalFiles / totalExpected) * 100);
    
    report += '🎯 SCORE DE PRÉPARATION DU PROJET\n';
    report += '─────────────────────────────────────────────────────────────\n';
    report += `  Score: ${readinessScore}%\n`;
    report += `  Statut: ${this.getReadinessStatus(readinessScore)}\n\n`;

    report += '═══════════════════════════════════════════════════════════════\n';
    report += '  Généré le: ' + new Date().toLocaleString('fr-FR') + '\n';
    report += '═══════════════════════════════════════════════════════════════\n';

    return report;
  }

  /**
   * Get readiness status based on score
   */
  getReadinessStatus(score) {
    if (score >= 90) return '✅ EXCELLENT - Prêt pour production';
    if (score >= 75) return '🟢 BON - Quelques améliorations nécessaires';
    if (score >= 60) return '🟡 MOYEN - Travail significatif requis';
    if (score >= 40) return '🟠 FAIBLE - Beaucoup de travail requis';
    return '🔴 CRITIQUE - Projet incomplet';
  }

  /**
   * Generate JSON report
   */
  generateJSONReport() {
    return JSON.stringify(this.findings, null, 2);
  }

  /**
   * Save report to file
   */
  saveReport(reportPath, jsonPath) {
    const textReport = this.generateReport();
    const jsonReport = this.generateJSONReport();

    fs.writeFileSync(reportPath, textReport, 'utf8');
    fs.writeFileSync(jsonPath, jsonReport, 'utf8');

    console.log(`📄 Rapport texte sauvegardé: ${reportPath}`);
    console.log(`📄 Rapport JSON sauvegardé: ${jsonPath}`);
  }
}

// Main execution
if (require.main === module) {
  const projectRoot = path.resolve(__dirname);
  const auditor = new ProjectAuditor(projectRoot);
  
  auditor.performAudit();
  
  const reportPath = path.join(projectRoot, 'PROJECT_AUDIT_REPORT.md');
  const jsonPath = path.join(projectRoot, 'project-audit-data.json');
  
  auditor.saveReport(reportPath, jsonPath);
  
  console.log('\n' + auditor.generateReport());
  console.log('\n✅ Audit terminé! Consultez PROJECT_AUDIT_REPORT.md pour le rapport complet.');
}

module.exports = { ProjectAuditor };
