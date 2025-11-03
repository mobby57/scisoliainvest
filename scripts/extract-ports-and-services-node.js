// scripts/extract-ports-and-services-node.js
// Recursively scan repository (no external shell commands), extract plausible ports and heuristics,
// and write report.json at repo root.
const fs = require('fs').promises;
const path = require('path');

const EXCLUDE_DIRS = new Set(['venv', '.venv', 'node_modules', '.git']);
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
        const content = await fs.readFile(full, 'utf8');
        // quick check if any pattern matches
        const ok = MATCH_PATTERNS.some(rx => rx.test(content));
        if (!ok) continue;
        // find numeric tokens and build records
        const numRe = /[0-9]{2,5}/g;
        let m;
        while ((m = numRe.exec(content)) !== null) {
          const idx = m.index;
          // skip hex-like "0x" preceding
          const pre = idx >= 2 ? content.slice(idx - 2, idx).toLowerCase() : '';
          if (pre === '0x') continue;
          const num = parseInt(m[0], 10);
          if (num < 1 || num > 65535) continue;
          // extract surrounding line for context
          const startLine = content.lastIndexOf('\n', idx);
          const endLine = content.indexOf('\n', idx);
          const line = content.slice(startLine + 1, endLine === -1 ? content.length : endLine).trim();
          // simple heuristics for service guess
          const low = line.toLowerCase();
          let svc = 'unknown';
          if (low.includes('mongodb') || low.includes('mongo')) svc = 'mongodb';
          else if (low.includes('postgres') || low.includes('postgresql') || low.includes('psql')) svc = 'postgres';
          else if (low.includes('vite') || low.includes('vite_port')) svc = 'vite';
          else if (low.includes('redis')) svc = 'redis';
          else if (/[0-9]{2,5}:[0-9]{2,5}/.test(line)) svc = 'docker-port-mapping';
          else if (low.includes('listen(') || low.includes('app.listen') || low.includes('server.listen')) svc = 'api-listen';
          // determine lineno by counting newlines up to idx
          const lineno = content.slice(0, idx).split('\n').length;
          results.push({
            file: path.relative(process.cwd(), full).replace(/\\/g, '/'),
            lineno: String(lineno),
            port: num,
            line: line.length > 400 ? line.slice(0, 400) + '…' : line,
            service_guess: svc
          });
        }
      } catch (err) {
        // ignore read errors (binary files, permission issues)
      }
    }
  }
}

(async () => {
  try {
    const results = [];
    await walkAndCollect(process.cwd(), results);
    // deduplicate by file+lineno+port
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
    console.log('report.json written — entries:', unique.length);
  } catch (e) {
    console.error('Error:', e && e.message ? e.message : e);
    process.exit(1);
  }
})();