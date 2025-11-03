#!/usr/bin/env node
// Script Node.js pour générer automatiquement un diagramme Mermaid de la structure du monorepo SCI Solia Invest
// Parcourt les dossiers principaux et génère un diagramme Mermaid à jour


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PACKAGES = path.join(ROOT, 'packages');
const OUTPUT = path.join(ROOT, 'ARCHITECTURE_AUTO.md');

function getDirs(base) {
  return fs.readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}


function getFiles(base) {
  return fs.readdirSync(base, { withFileTypes: true })
    .filter(f => f.isFile())
    .map(f => f.name);
}

function scanStructure(includeFiles = false) {
  let mermaid = '```mermaid\nflowchart TD\n';
  const pkgs = getDirs(PACKAGES);
  pkgs.forEach(pkg => {
    const pkgPath = path.join(PACKAGES, pkg, 'src');
    if (fs.existsSync(pkgPath)) {
      const dirs = getDirs(pkgPath);
      mermaid += `  ${pkg}([${pkg}])\n`;
      dirs.forEach(dir => {
        mermaid += `  ${pkg} --> ${pkg}_${dir}[${dir}]\n`;
        if (includeFiles) {
          const dirPath = path.join(pkgPath, dir);
          if (fs.existsSync(dirPath)) {
            const files = getFiles(dirPath);
            files.forEach(file => {
              mermaid += `  ${pkg}_${dir} --> ${pkg}_${dir}_${file.replace(/\W/g,'_')}[${file}]\n`;
            });
          }
        }
      });
    } else {
      mermaid += `  ${pkg}([${pkg}])\n`;
    }
  });
  mermaid += '```\n';
  return mermaid;
}

function main() {
  const includeFiles = process.argv.includes('--files');
  const diagram = scanStructure(includeFiles);
  fs.writeFileSync(OUTPUT, '# Diagramme Mermaid auto-généré\n\n' + diagram);
  console.log('Diagramme généré dans ARCHITECTURE_AUTO.md');
}

main();
