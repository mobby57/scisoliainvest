#!/usr/bin/env node

/**
 * Script de diagnostic et résolution des erreurs de tests
 * Analyse les logs d'erreurs et propose des solutions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestDiagnostic {
  constructor() {
    this.errorPatterns = {
      // Erreurs JWT/Token
      jwt: {
        patterns: [
          /expected to have property token/i,
          /jwt expired/i,
          /invalid token/i,
          /no token provided/i,
          /JsonWebTokenError/i
        ],
        solutions: [
          'Vérifier la configuration JWT_SECRET dans vitest.setup.ts',
          'S\'assurer que les mocks JWT retournent des tokens valides',
          'Contrôler l\'expiration des tokens dans les tests'
        ]
      },
      
      // Erreurs d'authentification
      auth: {
        patterns: [
          /expected 200 OK, got 401 Unauthorized/i,
          /expected 200 OK, got 403 Forbidden/i,
          /authentication failed/i,
          /unauthorized/i
        ],
        solutions: [
          'Vérifier que les mocks d\'authentification sont correctement configurés',
          'S\'assurer que req.user est défini dans les middlewares mockés',
          'Contrôler les headers Authorization dans les tests'
        ]
      },
      
      // Erreurs de base de données
      database: {
        patterns: [
          /Cannot read property.*of undefined/i,
          /TypeError.*undefined/i,
          /connection.*refused/i,
          /ECONNREFUSED/i,
          /mongoose/i
        ],
        solutions: [
          'Vérifier que les mocks de base de données sont actifs',
          'S\'assurer que les modèles retournent des objets valides',
          'Contrôler la configuration de test de la base de données'
        ]
      },
      
      // Erreurs de validation
      validation: {
        patterns: [
          /validation.*failed/i,
          /required.*missing/i,
          /invalid.*format/i,
          /schema.*error/i
        ],
        solutions: [
          'Vérifier les schémas de validation dans les tests',
          'S\'assurer que les données de test respectent les contraintes',
          'Contrôler les middlewares de validation'
        ]
      },
      
      // Erreurs multi-tenant
      tenant: {
        patterns: [
          /tenantId.*required/i,
          /tenant.*isolation/i,
          /cross.*tenant/i
        ],
        solutions: [
          'Vérifier que tenantId est défini dans req.user',
          'S\'assurer de l\'isolation des données par tenant',
          'Contrôler les filtres tenant dans les requêtes'
        ]
      }
    };
  }

  /**
   * Analyse un fichier de logs d'erreurs
   */
  analyzeErrorLog(logContent) {
    const errors = [];
    const lines = logContent.split('\n');
    
    let currentError = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Détection d'un nouveau test qui échoue
      if (line.includes('FAIL') || line.includes('✗') || line.includes('AssertionError')) {
        if (currentError) {
          errors.push(currentError);
        }
        
        currentError = {
          line: i + 1,
          testName: this.extractTestName(line),
          errorType: 'unknown',
          message: line,
          stackTrace: [],
          solutions: []
        };
      }
      
      // Ajout de lignes à l'erreur courante
      if (currentError && (line.includes('at ') || line.includes('Error:') || line.includes('Expected:'))) {
        currentError.stackTrace.push(line);
      }
    }
    
    if (currentError) {
      errors.push(currentError);
    }
    
    // Classification des erreurs
    errors.forEach(error => {
      this.classifyError(error);
    });
    
    return errors;
  }

  /**
   * Extrait le nom du test depuis une ligne d'erreur
   */
  extractTestName(line) {
    const matches = line.match(/(?:FAIL|✗)\s+(.+?)(?:\s+\d+ms)?$/);
    return matches ? matches[1].trim() : 'Test inconnu';
  }

  /**
   * Classifie une erreur selon les patterns connus
   */
  classifyError(error) {
    const fullText = error.message + ' ' + error.stackTrace.join(' ');
    
    for (const [type, config] of Object.entries(this.errorPatterns)) {
      if (config.patterns.some(pattern => pattern.test(fullText))) {
        error.errorType = type;
        error.solutions = config.solutions;
        break;
      }
    }
  }

  /**
   * Génère un rapport de diagnostic
   */
  generateReport(errors) {
    const report = {
      summary: {
        total: errors.length,
        byType: {}
      },
      errors: errors,
      recommendations: []
    };
    
    // Comptage par type
    errors.forEach(error => {
      report.summary.byType[error.errorType] = (report.summary.byType[error.errorType] || 0) + 1;
    });
    
    // Recommandations générales
    if (report.summary.byType.jwt > 0) {
      report.recommendations.push({
        priority: 'HIGH',
        action: 'Corriger la configuration JWT',
        details: 'Plusieurs erreurs liées aux tokens JWT détectées'
      });
    }
    
    if (report.summary.byType.auth > 0) {
      report.recommendations.push({
        priority: 'HIGH',
        action: 'Vérifier les mocks d\'authentification',
        details: 'Erreurs d\'autorisation dans les tests'
      });
    }
    
    if (report.summary.byType.database > 0) {
      report.recommendations.push({
        priority: 'MEDIUM',
        action: 'Contrôler les mocks de base de données',
        details: 'Erreurs liées aux accès base de données'
      });
    }
    
    return report;
  }

  /**
   * Exécute les tests et capture les erreurs
   */
  runTestsAndCapture() {
    try {
      console.log('🔍 Exécution des tests pour diagnostic...');
      
      const result = execSync('npm run test 2>&1', { 
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      return result;
    } catch (error) {
      // Les tests échouent, on récupère la sortie d'erreur
      return error.stdout + error.stderr;
    }
  }

  /**
   * Propose des corrections automatiques
   */
  suggestFixes(errors) {
    const fixes = [];
    
    // Corrections JWT
    if (errors.some(e => e.errorType === 'jwt')) {
      fixes.push({
        file: 'vitest.setup.ts',
        description: 'Améliorer les mocks JWT',
        code: `
// Mock JWT plus robuste
vi.mock('jsonwebtoken', () => ({
  sign: vi.fn().mockImplementation((payload, secret, options) => {
    return \`mock-jwt-token-\${Date.now()}\`;
  }),
  verify: vi.fn().mockImplementation((token, secret) => {
    if (token.includes('invalid')) throw new Error('invalid token');
    return {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'INVESTOR',
      tenantId: 'test-tenant'
    };
  })
}));`
      });
    }
    
    // Corrections Auth
    if (errors.some(e => e.errorType === 'auth')) {
      fixes.push({
        file: 'vitest.setup.ts',
        description: 'Corriger les middlewares d\'authentification',
        code: `
// Mock middleware auth plus fiable
vi.mock('./packages/api/src/middleware/authMiddleware', () => ({
  authenticateJWT: vi.fn().mockImplementation((req, res, next) => {
    req.user = {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'INVESTOR',
      tenantId: 'test-tenant'
    };
    next();
  })
}));`
      });
    }
    
    return fixes;
  }

  /**
   * Méthode principale de diagnostic
   */
  async diagnose(logFile = null) {
    console.log('🚀 Démarrage du diagnostic des tests...\n');
    
    let logContent;
    
    if (logFile && fs.existsSync(logFile)) {
      console.log(`📖 Lecture du fichier de logs: ${logFile}`);
      logContent = fs.readFileSync(logFile, 'utf8');
    } else {
      console.log('🔄 Exécution des tests pour capturer les erreurs...');
      logContent = this.runTestsAndCapture();
    }
    
    console.log('🔍 Analyse des erreurs...');
    const errors = this.analyzeErrorLog(logContent);
    
    console.log('📊 Génération du rapport...');
    const report = this.generateReport(errors);
    
    console.log('🛠️  Génération des suggestions de correction...');
    const fixes = this.suggestFixes(errors);
    
    // Affichage du rapport
    this.displayReport(report, fixes);
    
    // Sauvegarde du rapport
    const reportPath = path.join(process.cwd(), 'test-diagnostic-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({ report, fixes }, null, 2));
    console.log(`\n💾 Rapport sauvegardé: ${reportPath}`);
    
    return { report, fixes };
  }

  /**
   * Affiche le rapport de diagnostic
   */
  displayReport(report, fixes) {
    console.log('\n' + '='.repeat(60));
    console.log('📋 RAPPORT DE DIAGNOSTIC DES TESTS');
    console.log('='.repeat(60));
    
    console.log(`\n📊 RÉSUMÉ:`);
    console.log(`   Total d'erreurs: ${report.summary.total}`);
    
    Object.entries(report.summary.byType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} erreur(s)`);
    });
    
    console.log(`\n🎯 RECOMMANDATIONS PRIORITAIRES:`);
    report.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. [${rec.priority}] ${rec.action}`);
      console.log(`      ${rec.details}`);
    });
    
    console.log(`\n🔧 CORRECTIONS SUGGÉRÉES:`);
    fixes.forEach((fix, i) => {
      console.log(`   ${i + 1}. ${fix.description} (${fix.file})`);
    });
    
    console.log(`\n📝 DÉTAIL DES ERREURS:`);
    report.errors.slice(0, 5).forEach((error, i) => {
      console.log(`   ${i + 1}. [${error.errorType.toUpperCase()}] ${error.testName}`);
      console.log(`      Message: ${error.message.substring(0, 100)}...`);
      if (error.solutions.length > 0) {
        console.log(`      Solution: ${error.solutions[0]}`);
      }
    });
    
    if (report.errors.length > 5) {
      console.log(`   ... et ${report.errors.length - 5} autres erreurs`);
    }
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const diagnostic = new TestDiagnostic();
  const logFile = process.argv[2]; // Optionnel: chemin vers fichier de logs
  
  diagnostic.diagnose(logFile).catch(console.error);
}

module.exports = TestDiagnostic;