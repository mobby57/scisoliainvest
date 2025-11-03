// Version optimisée - limite la taille des fichiers analysés
const fs = require('fs').promises;
const path = require('path');

const EXCLUDE_DIRS = new Set(['venv', '.venv', 'node_modules', '.git', 'dist', 'build', '.next']);
const MAX_FILE_SIZE = 1024 * 1024; // 1MB max par fichier
const MATCH_PATTERNS = [
  /mongodb:\/\/[^:]+:[0-9]{2,5}/i,
  /postgresql?:\/\/[^:]+:[0-9]{2,5}/i,
  /PORT[_A-Z0-9]*=/i,
  /VITE[_A-Z0-9]*=/i,
  /[:=]\s*[0-9]{2,5}/,
  /[0-9]{2,5}:[0-9]{2,5}/
];

const FILE_NAME_ACCEPT = fname =>
  fname.endsWith('.js') || fname.endsWith('.ts') || fname.endsWith('.json') ||
  fname.endsWith('.yml') || fname.endsWith('.yaml') ||
  fname === '.env' || fname.startsWith('.env.') ||
  fname === 'Dockerfile' || fname.startsWith('docker-compose') ||
  fname === 'package.json';

async function walkAndCollect(dir, results) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const name = e.name;
    const full = path.join(dir, name);
    if (e.isDirectory()) {
      if (EXCLUDE_DIRS.has(name)) continue;
      await walkAndCollect(full, results);
    } else if (e.isFile()) {
      if (!FILE_NAME_ACCEPT(name)) continue;
      try {
        const stats = await fs.stat(full);
        if (stats.size > MAX_FILE_SIZE) continue; // Skip gros fichiers
        
        const content = await fs.readFile(full, 'utf8');
        const ok = MATCH_PATTERNS.some(rx => rx.test(content));
        if (!ok) continue;
        
        const numRe = /[0-9]{2,5}/g;
        let m;
        while ((m = numRe.exec(content)) !== null) {
          const num = parseInt(m[0], 10);
          if (num < 1 || num > 65535) continue;
          
          const idx = m.index;
          const startLine = content.lastIndexOf('\n', idx);
          const endLine = content.indexOf('\n', idx);
          const line = content.slice(startLine + 1, endLine === -1 ? content.length : endLine).trim();
          
          const low = line.toLowerCase();
          let svc = 'unknown';
          if (low.includes('mongodb')) svc = 'mongodb';
          else if (low.includes('postgres')) svc = 'postgres';
          else if (low.includes('vite')) svc = 'vite';
          else if (low.includes('redis')) svc = 'redis';
          
          const lineno = content.slice(0, idx).split('\n').length;
          results.push({
            file: path.relative(process.cwd(), full).replace(/\\/g, '/'),
            lineno: String(lineno),
            port: num,
            line: line.slice(0, 200),
            service_guess: svc
          });
        }
      } catch (err) {
        // ignore
      }
    }
  }
}

(async () => {
  console.log('Démarrage scan rapide...');
  const start = Date.now();
  const results = [];
  await walkAndCollect(process.cwd(), results);
  
  const seen = new Set();
  const unique = results.filter(r => {
    const key = `${r.file}::${r.lineno}::${r.port}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  await fs.writeFile('report-fast.json', JSON.stringify(unique, null, 2));
  console.log(`Terminé en ${Date.now() - start}ms - ${unique.length} entrées`);
})();