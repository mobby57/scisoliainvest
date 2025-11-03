// scripts/extract-ports-optimized.js
// Optimized version that processes files in batches to avoid memory issues
const fs = require('fs').promises;
const path = require('path');

const EXCLUDE_DIRS = new Set(['venv', '.venv', 'node_modules', '.git', 'dist', 'build', 'coverage']);
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

async function collectFiles(dir, files = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const name = e.name;
      const full = path.join(dir, name);
      if (e.isDirectory()) {
        if (EXCLUDE_DIRS.has(name)) continue;
        await collectFiles(full, files);
      } else if (e.isFile() && FILE_NAME_ACCEPT(name)) {
        files.push(full);
      }
    }
  } catch (err) {
    // ignore permission errors
  }
  return files;
}

async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Quick check if any pattern matches
    const hasMatch = MATCH_PATTERNS.some(rx => rx.test(content));
    if (!hasMatch) return [];

    const results = [];
    const numRe = /[0-9]{2,5}/g;
    let m;
    
    while ((m = numRe.exec(content)) !== null) {
      const idx = m.index;
      const pre = idx >= 2 ? content.slice(idx - 2, idx).toLowerCase() : '';
      if (pre === '0x') continue;
      
      const num = parseInt(m[0], 10);
      if (num < 1 || num > 65535) continue;
      
      const startLine = content.lastIndexOf('\n', idx);
      const endLine = content.indexOf('\n', idx);
      const line = content.slice(startLine + 1, endLine === -1 ? content.length : endLine).trim();
      
      const low = line.toLowerCase();
      let svc = 'unknown';
      if (low.includes('mongodb') || low.includes('mongo')) svc = 'mongodb';
      else if (low.includes('postgres') || low.includes('postgresql')) svc = 'postgres';
      else if (low.includes('vite')) svc = 'vite';
      else if (low.includes('redis')) svc = 'redis';
      else if (/[0-9]{2,5}:[0-9]{2,5}/.test(line)) svc = 'docker-port-mapping';
      else if (low.includes('listen(') || low.includes('app.listen')) svc = 'api-listen';
      
      const lineno = content.slice(0, idx).split('\n').length;
      results.push({
        file: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
        lineno: String(lineno),
        port: num,
        line: line.length > 200 ? line.slice(0, 200) + '…' : line,
        service_guess: svc
      });
    }
    
    return results;
  } catch (err) {
    return [];
  }
}

(async () => {
  try {
    console.log('Collecting files...');
    const files = await collectFiles(process.cwd());
    console.log(`Found ${files.length} files to process`);
    
    const results = [];
    const batchSize = 50;
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)}`);
      
      const batchResults = await Promise.all(batch.map(processFile));
      results.push(...batchResults.flat());
      
      // Force garbage collection
      if (global.gc) global.gc();
    }
    
    // Deduplicate
    const seen = new Set();
    const unique = [];
    for (const r of results) {
      const key = `${r.file}::${r.lineno}::${r.port}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(r);
      }
    }
    
    await fs.writeFile(path.join(process.cwd(), 'report.json'), JSON.stringify(unique, null, 2), 'utf8');
    console.log(`report.json written — entries: ${unique.length}`);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();