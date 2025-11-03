#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'html-designs');
const targetDir = path.join(__dirname, '..', 'packages', 'client', 'public', 'designs');

/**
 * Copie récursive d'un dossier
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Met à jour les liens dans les fichiers HTML pour pointer vers /designs/
 */
function updateHtmlLinks(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      updateHtmlLinks(filePath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Mise à jour des liens relatifs vers /designs/
      content = content.replace(/href="\/designs\//g, 'href="/designs/');
      content = content.replace(/src="\/designs\//g, 'src="/designs/');
      
      fs.writeFileSync(filePath, content);
    }
  }
}

console.log('🚀 Migration des designs HTML vers le client...');

try {
  // Copie du dossier html-designs vers client/public/designs
  copyDirectory(sourceDir, targetDir);
  
  // Mise à jour des liens dans les fichiers HTML
  updateHtmlLinks(targetDir);
  
  console.log('✅ Migration terminée avec succès !');
  console.log(`📁 Designs copiés vers: ${targetDir}`);
  
} catch (error) {
  console.error('❌ Erreur lors de la migration:', error.message);
  process.exit(1);
}