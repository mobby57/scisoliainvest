const fs = require('fs');
const path = require('path');

// Générateur de rapport de tests consolidé
class TestReportGenerator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      },
      suites: []
    };
  }

  // Lire les résultats Vitest
  parseVitestResults() {
    try {
      const vitestPath = path.join(__dirname, '../packages/api/coverage/vitest-report.json');
      if (fs.existsSync(vitestPath)) {
        const data = JSON.parse(fs.readFileSync(vitestPath, 'utf8'));
        this.results.suites.push({
          name: 'API Unit Tests (Vitest)',
          type: 'unit',
          ...data
        });
      }
    } catch (error) {
      console.warn('Impossible de lire les résultats Vitest:', error.message);
    }
  }

  // Lire les résultats Postman/Newman
  parsePostmanResults() {
    try {
      const postmanPath = path.join(__dirname, '../test-results/postman-results.json');
      if (fs.existsSync(postmanPath)) {
        const data = JSON.parse(fs.readFileSync(postmanPath, 'utf8'));
        
        const suite = {
          name: 'API E2E Tests (Postman)',
          type: 'e2e',
          total: data.run.stats.tests.total,
          passed: data.run.stats.tests.total - data.run.stats.tests.failed,
          failed: data.run.stats.tests.failed,
          duration: data.run.timings.completed - data.run.timings.started,
          tests: data.run.executions.map(exec => ({
            name: exec.item.name,
            status: exec.assertions.every(a => !a.error) ? 'passed' : 'failed',
            assertions: exec.assertions.length,
            duration: exec.response?.responseTime || 0
          }))
        };
        
        this.results.suites.push(suite);
      }
    } catch (error) {
      console.warn('Impossible de lire les résultats Postman:', error.message);
    }
  }

  // Lire les résultats Playwright
  parsePlaywrightResults() {
    try {
      const playwrightPath = path.join(__dirname, '../packages/client/test-results/results.json');
      if (fs.existsSync(playwrightPath)) {
        const data = JSON.parse(fs.readFileSync(playwrightPath, 'utf8'));
        this.results.suites.push({
          name: 'Client E2E Tests (Playwright)',
          type: 'e2e',
          ...data
        });
      }
    } catch (error) {
      console.warn('Impossible de lire les résultats Playwright:', error.message);
    }
  }

  // Calculer le résumé global
  calculateSummary() {
    this.results.suites.forEach(suite => {
      this.results.summary.total += suite.total || 0;
      this.results.summary.passed += suite.passed || 0;
      this.results.summary.failed += suite.failed || 0;
      this.results.summary.skipped += suite.skipped || 0;
    });
  }

  // Générer le rapport HTML
  generateHTMLReport() {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Tests - SCI Solia Invest</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .summary-card.passed { border-left: 4px solid #28a745; }
        .summary-card.failed { border-left: 4px solid #dc3545; }
        .summary-card.total { border-left: 4px solid #007bff; }
        .suite { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .suite-header { background: #007bff; color: white; padding: 15px; font-weight: bold; }
        .suite-content { padding: 20px; }
        .test-item { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .test-item:last-child { border-bottom: none; }
        .status { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; }
        .status.passed { background: #28a745; }
        .status.failed { background: #dc3545; }
        .timestamp { color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Rapport de Tests - SCI Solia Invest</h1>
            <p class="timestamp">Généré le ${new Date(this.results.timestamp).toLocaleString('fr-FR')}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card total">
                <h3>${this.results.summary.total}</h3>
                <p>Tests Total</p>
            </div>
            <div class="summary-card passed">
                <h3>${this.results.summary.passed}</h3>
                <p>Tests Réussis</p>
            </div>
            <div class="summary-card failed">
                <h3>${this.results.summary.failed}</h3>
                <p>Tests Échoués</p>
            </div>
        </div>

        ${this.results.suites.map(suite => `
            <div class="suite">
                <div class="suite-header">
                    ${suite.name} (${suite.type})
                </div>
                <div class="suite-content">
                    <p><strong>Total:</strong> ${suite.total || 0} | <strong>Réussis:</strong> ${suite.passed || 0} | <strong>Échoués:</strong> ${suite.failed || 0}</p>
                    ${suite.tests ? suite.tests.map(test => `
                        <div class="test-item">
                            <span>${test.name}</span>
                            <span class="status ${test.status}">${test.status}</span>
                        </div>
                    `).join('') : ''}
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    return html;
  }

  // Générer tous les rapports
  generate() {
    console.log('📊 Génération du rapport de tests...');
    
    this.parseVitestResults();
    this.parsePostmanResults();
    this.parsePlaywrightResults();
    this.calculateSummary();

    // Créer le dossier de résultats s'il n'existe pas
    const resultsDir = path.join(__dirname, '../test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    // Sauvegarder le rapport JSON
    fs.writeFileSync(
      path.join(resultsDir, 'final-report.json'),
      JSON.stringify(this.results, null, 2)
    );

    // Sauvegarder le rapport HTML
    fs.writeFileSync(
      path.join(resultsDir, 'final-report.html'),
      this.generateHTMLReport()
    );

    console.log('✅ Rapport généré avec succès!');
    console.log(`📋 JSON: ${path.join(resultsDir, 'final-report.json')}`);
    console.log(`🌐 HTML: ${path.join(resultsDir, 'final-report.html')}`);
    
    return this.results;
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  const generator = new TestReportGenerator();
  const results = generator.generate();
  
  // Afficher le résumé dans la console
  console.log('\n📊 RÉSUMÉ DES TESTS:');
  console.log(`Total: ${results.summary.total}`);
  console.log(`✅ Réussis: ${results.summary.passed}`);
  console.log(`❌ Échoués: ${results.summary.failed}`);
  
  // Code de sortie basé sur les résultats
  process.exit(results.summary.failed > 0 ? 1 : 0);
}

module.exports = TestReportGenerator;