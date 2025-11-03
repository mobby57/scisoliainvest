// Version ultra-rapide - seulement les fichiers essentiels
const fs = require('fs').promises;
const path = require('path');

const TARGET_FILES = [
  'package.json',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'docker-compose.yml',
  'docker-compose.yaml',
  'Dockerfile'
];

const TARGET_DIRS = [
  'packages/api/src',
  'packages/web/src', 
  'src',
  'config'
];

async function scanFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const results = [];
    const portRegex = /(?:PORT|port)[_\s]*[:=]\s*([0-9]{2,5})|([0-9]{4,5})/g;
    
    let match;
    while ((match = portRegex.exec(content)) !== null) {
      const port = parseInt(match[1] || match[2]);
      if (port >= 1000 && port <= 65535) {
        results.push({
          file: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
          port,
          context: match[0]
        });
      }
    }
    return results;
  } catch (e) {
    return [];
  }
}

(async () => {
  console.log('Scan minimal...');
  const start = Date.now();
  const results = [];
  
  // Scan fichiers racine
  for (const file of TARGET_FILES) {
    if (await fs.access(file).then(() => true).catch(() => false)) {
      results.push(...await scanFile(file));
    }
  }
  
  // Scan dossiers ciblés
  for (const dir of TARGET_DIRS) {
    try {
      const files = await fs.readdir(dir, { recursive: true });
      for (const file of files.slice(0, 50)) { // Max 50 fichiers par dossier
        if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.json')) {
          results.push(...await scanFile(path.join(dir, file)));
        }
      }
    } catch (e) {}
  }
  
  await fs.writeFile('ports-minimal.json', JSON.stringify(results, null, 2));
  console.log(`Terminé en ${Date.now() - start}ms - ${results.length} ports trouvés`);
})();