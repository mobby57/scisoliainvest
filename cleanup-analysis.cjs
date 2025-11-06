#!/usr/bin/env node

/**
 * Cleanup Analysis Tool
 * 
 * Analyzes the repository to identify potentially unnecessary files
 * that can be safely removed while preserving essential project files.
 * 
 * Methodology:
 * 1. Scans all files in the repository
 * 2. Cross-references with documentation, imports, and scripts
 * 3. Categorizes files as essential, referenced, or potentially removable
 * 4. Generates a detailed report for manual review
 * 
 * NEVER automatically deletes files - requires manual validation first!
 */

const fs = require('fs');
const path = require('path');

// Files and patterns that are ALWAYS essential
const ESSENTIAL_PATTERNS = [
  /^README.*\.md$/i,
  /^\.gitignore$/,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /^tsconfig.*\.json$/,
  /^Dockerfile/,
  /^docker-compose.*\.ya?ml$/,
  /^Makefile$/,
  /^\.env\.example$/,
  /^next\.config\./,
  /^vite\.config\./,
  /^tailwind\.config\./,
  /^postcss\.config\./,
];

// Directories that are ALWAYS essential
const ESSENTIAL_DIRS = [
  'backend',
  'frontend',
  'packages',
  'components',
  'styles',
  'public',
  'scripts',
  'infrastructure',
  'k8s',
  'validation',
  'shared',
  'src',
  'app',
  'tests',
  'test',
  '__tests__',
];

// Patterns for files that are typically build artifacts or temporary
const BUILD_ARTIFACT_PATTERNS = [
  /node_modules/,
  /\.next/,
  /dist\//,
  /build\//,
  /\.cache/,
  /\.temp/,
  /\.tmp/,
  /coverage/,
  /\.DS_Store$/,
  /Thumbs\.db$/,
  /\.log$/,
];

// Patterns for potentially redundant files
const POTENTIALLY_REDUNDANT_PATTERNS = [
  { pattern: /^TODO.*\.md$/i, reason: 'Old TODO file - verify if still relevant' },
  { pattern: /\.postman_collection\.json$/, reason: 'Postman collection - check if still used or duplicate' },
  { pattern: /\.postman_environment\.json$/, reason: 'Postman environment - check if still used or duplicate' },
  { pattern: /\.bat$/, reason: 'Windows batch script - verify if referenced in documentation' },
  { pattern: /\.ps1$/, reason: 'PowerShell script - verify if referenced in documentation' },
  { pattern: /quick-.*\.(bat|sh)$/i, reason: 'Quick script - verify if referenced in documentation' },
  { pattern: /\.html$/, reason: 'HTML file (non-component) - verify usage' },
  { pattern: /-old\.|\.old\.|\.backup\./i, reason: 'Backup or old version file' },
  { pattern: /legacy/i, reason: 'Legacy file or directory' },
];

class CleanupAnalyzer {
  constructor() {
    this.allFiles = [];
    this.documentationFiles = [];
    this.configFiles = [];
    this.scriptFiles = [];
    this.essentialFiles = new Set();
    this.referencedFiles = new Set();
    this.potentiallyRemovable = [];
    this.documentContent = '';
  }

  // Recursively scan directory
  scanDirectory(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePath, entry.name);
      
      // Skip git directory and build artifacts
      if (entry.name === '.git' || BUILD_ARTIFACT_PATTERNS.some(p => p.test(relPath))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        this.scanDirectory(fullPath, relPath);
      } else {
        this.allFiles.push(relPath);
        
        // Categorize files
        if (relPath.endsWith('.md') || relPath.endsWith('.txt')) {
          this.documentationFiles.push(relPath);
        }
        if (relPath.match(/\.(json|ya?ml|toml|ini|config\..*)$/)) {
          this.configFiles.push(relPath);
        }
        if (relPath.match(/\.(sh|bat|ps1|js|cjs|mjs)$/) && (relPath.includes('script') || relPath.startsWith('setup-') || relPath.startsWith('test-') || relPath.startsWith('run-'))) {
          this.scriptFiles.push(relPath);
        }
      }
    }
  }

  // Mark files as essential based on patterns and directories
  markEssentialFiles() {
    for (const file of this.allFiles) {
      const fileName = path.basename(file);
      const dirName = path.dirname(file).split(path.sep)[0];
      
      // Check if matches essential patterns
      if (ESSENTIAL_PATTERNS.some(p => p.test(fileName))) {
        this.essentialFiles.add(file);
        continue;
      }
      
      // Check if in essential directory
      if (ESSENTIAL_DIRS.includes(dirName)) {
        this.essentialFiles.add(file);
        continue;
      }
      
      // Package.json files are essential
      if (fileName === 'package.json') {
        this.essentialFiles.add(file);
      }
    }
  }

  // Read all documentation content
  readDocumentation() {
    for (const docFile of this.documentationFiles) {
      try {
        const content = fs.readFileSync(docFile, 'utf8');
        this.documentContent += `\n${content}`;
      } catch (err) {
        // Skip files that can't be read
      }
    }
  }

  // Check if a file is referenced in documentation, scripts, or configs
  isFileReferenced(file) {
    const fileName = path.basename(file);
    const fileNameWithoutExt = path.parse(fileName).name;
    
    // Check in documentation
    if (this.documentContent.includes(fileName) || this.documentContent.includes(file)) {
      return true;
    }
    
    // Check if referenced in Makefile
    try {
      const makefileContent = fs.readFileSync('Makefile', 'utf8');
      if (makefileContent.includes(fileName) || makefileContent.includes(file)) {
        return true;
      }
    } catch (err) {
      // No Makefile
    }
    
    // Check in docker-compose files
    for (const configFile of this.configFiles) {
      if (configFile.includes('docker-compose')) {
        try {
          const content = fs.readFileSync(configFile, 'utf8');
          if (content.includes(fileName) || content.includes(file)) {
            return true;
          }
        } catch (err) {
          // Skip
        }
      }
    }
    
    return false;
  }

  // Analyze files for potential removal
  analyzeFiles() {
    for (const file of this.allFiles) {
      // Skip if essential
      if (this.essentialFiles.has(file)) {
        continue;
      }
      
      // Check if referenced
      if (this.isFileReferenced(file)) {
        this.referencedFiles.add(file);
        continue;
      }
      
      // Check against potentially redundant patterns
      const fileName = path.basename(file);
      for (const { pattern, reason } of POTENTIALLY_REDUNDANT_PATTERNS) {
        if (pattern.test(fileName) || pattern.test(file)) {
          this.potentiallyRemovable.push({
            path: file,
            reason,
            size: this.getFileSize(file),
            lastModified: this.getLastModified(file),
          });
          break;
        }
      }
    }
  }

  getFileSize(file) {
    try {
      const stats = fs.statSync(file);
      return stats.size;
    } catch (err) {
      return 0;
    }
  }

  getLastModified(file) {
    try {
      const stats = fs.statSync(file);
      return stats.mtime.toISOString().split('T')[0];
    } catch (err) {
      return 'unknown';
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Generate detailed report
  generateReport() {
    const report = [];
    
    report.push('# Rapport d\'Analyse de Nettoyage du Projet');
    report.push('');
    report.push(`**Date de génération**: ${new Date().toISOString()}`);
    report.push('');
    report.push('---');
    report.push('');
    
    // Summary
    report.push('## 📊 Résumé');
    report.push('');
    report.push(`- **Total fichiers analysés**: ${this.allFiles.length}`);
    report.push(`- **Fichiers essentiels**: ${this.essentialFiles.size}`);
    report.push(`- **Fichiers référencés**: ${this.referencedFiles.size}`);
    report.push(`- **Fichiers candidats à la suppression**: ${this.potentiallyRemovable.length}`);
    report.push('');
    
    const totalSize = this.potentiallyRemovable.reduce((sum, f) => sum + f.size, 0);
    report.push(`- **Espace potentiellement libérable**: ${this.formatBytes(totalSize)}`);
    report.push('');
    report.push('---');
    report.push('');
    
    // Potentially removable files
    report.push('## 🗑️ Fichiers Candidats à la Suppression');
    report.push('');
    report.push('> ⚠️ **ATTENTION**: Cette liste nécessite une validation manuelle avant toute suppression!');
    report.push('');
    
    if (this.potentiallyRemovable.length === 0) {
      report.push('✅ Aucun fichier candidat à la suppression détecté.');
    } else {
      report.push('| Fichier | Raison | Taille | Dernière modification |');
      report.push('|---------|--------|--------|----------------------|');
      
      for (const file of this.potentiallyRemovable) {
        report.push(`| \`${file.path}\` | ${file.reason} | ${this.formatBytes(file.size)} | ${file.lastModified} |`);
      }
    }
    report.push('');
    report.push('---');
    report.push('');
    
    // Categories
    report.push('## 📁 Catégories de Fichiers Candidats');
    report.push('');
    
    const categories = {};
    for (const file of this.potentiallyRemovable) {
      const category = file.reason;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(file.path);
    }
    
    for (const [category, files] of Object.entries(categories)) {
      report.push(`### ${category}`);
      report.push('');
      for (const file of files) {
        report.push(`- \`${file}\``);
      }
      report.push('');
    }
    
    report.push('---');
    report.push('');
    
    // Recommendations
    report.push('## 💡 Recommandations');
    report.push('');
    report.push('1. **Validation manuelle requise**: Examinez chaque fichier avant suppression');
    report.push('2. **Sauvegarde**: Créez une branche de sauvegarde avant toute suppression');
    report.push('3. **Tests**: Vérifiez que le projet fonctionne après chaque suppression');
    report.push('4. **Documentation**: Mettez à jour la documentation si nécessaire');
    report.push('');
    report.push('### Script de suppression (après validation)');
    report.push('');
    report.push('```bash');
    report.push('# Créer une branche de sauvegarde');
    report.push('git checkout -b backup-before-cleanup');
    report.push('git push origin backup-before-cleanup');
    report.push('');
    report.push('# Retourner à la branche principale');
    report.push('git checkout main');
    report.push('');
    report.push('# Supprimer les fichiers validés (exemple)');
    for (const file of this.potentiallyRemovable.slice(0, 3)) {
      report.push(`git rm "${file.path}"`);
    }
    report.push('# ... continuer avec les autres fichiers validés');
    report.push('');
    report.push('# Commit et push');
    report.push('git commit -m "Clean up: remove unnecessary files"');
    report.push('git push origin main');
    report.push('```');
    report.push('');
    report.push('---');
    report.push('');
    
    // Essential files sample
    report.push('## ✅ Exemples de Fichiers Essentiels (À GARDER)');
    report.push('');
    const essentialSample = Array.from(this.essentialFiles).slice(0, 20);
    for (const file of essentialSample) {
      report.push(`- \`${file}\``);
    }
    if (this.essentialFiles.size > 20) {
      report.push(`- ... et ${this.essentialFiles.size - 20} autres fichiers essentiels`);
    }
    report.push('');
    
    return report.join('\n');
  }

  // Run full analysis
  run() {
    console.log('🔍 Analyse du projet en cours...\n');
    
    console.log('1️⃣ Scan des fichiers...');
    this.scanDirectory('.');
    console.log(`   ✓ ${this.allFiles.length} fichiers trouvés\n`);
    
    console.log('2️⃣ Identification des fichiers essentiels...');
    this.markEssentialFiles();
    console.log(`   ✓ ${this.essentialFiles.size} fichiers essentiels\n`);
    
    console.log('3️⃣ Lecture de la documentation...');
    this.readDocumentation();
    console.log(`   ✓ ${this.documentationFiles.length} fichiers de documentation lus\n`);
    
    console.log('4️⃣ Analyse des références...');
    this.analyzeFiles();
    console.log(`   ✓ ${this.potentiallyRemovable.length} fichiers candidats à la suppression\n`);
    
    console.log('5️⃣ Génération du rapport...');
    const report = this.generateReport();
    
    // Save report
    const reportPath = 'CLEANUP_ANALYSIS_REPORT.md';
    fs.writeFileSync(reportPath, report);
    console.log(`   ✓ Rapport sauvegardé: ${reportPath}\n`);
    
    // Save JSON data
    const jsonData = {
      summary: {
        totalFiles: this.allFiles.length,
        essentialFiles: this.essentialFiles.size,
        referencedFiles: this.referencedFiles.size,
        potentiallyRemovable: this.potentiallyRemovable.length,
      },
      potentiallyRemovable: this.potentiallyRemovable,
      essentialFiles: Array.from(this.essentialFiles),
      generatedAt: new Date().toISOString(),
    };
    fs.writeFileSync('cleanup-analysis-data.json', JSON.stringify(jsonData, null, 2));
    console.log(`   ✓ Données JSON sauvegardées: cleanup-analysis-data.json\n`);
    
    console.log('✅ Analyse terminée!\n');
    console.log(`📋 Consultez le rapport: ${reportPath}`);
    console.log(`\n⚠️  IMPORTANT: Validez manuellement chaque fichier avant suppression!`);
  }
}

// Run analysis
const analyzer = new CleanupAnalyzer();
analyzer.run();
