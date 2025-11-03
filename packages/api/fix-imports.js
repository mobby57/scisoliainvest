const fs = require('fs');
const path = require('path');

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix winston import
  if (content.includes("import winston from 'winston'")) {
    content = content.replace(/import winston from 'winston';/g, "const winston = require('winston');");
    changed = true;
  }

  // Fix dotenv import
  if (content.includes("import dotenv from 'dotenv'")) {
    content = content.replace(/import dotenv from 'dotenv';/g, "import * as dotenv from 'dotenv';");
    changed = true;
  }

  // Fix jwt import
  if (content.includes("import jwt from 'jsonwebtoken'")) {
    content = content.replace(/import jwt from 'jsonwebtoken';/g, "import * as jwt from 'jsonwebtoken';");
    changed = true;
  }

  // Remove .js extensions from relative imports
  content = content.replace(/from ['"](\.\.[^'"]*?)\.js['"]/g, "from '$1'");
  content = content.replace(/from ['"](\.[^'"]*?)\.js['"]/g, "from '$1'");
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !['node_modules', 'dist', '.git'].includes(file)) {
      walkDir(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fixImports(filePath);
    }
  }
}

console.log('Fixing imports...');
walkDir('./src');
walkDir('./middleware');
walkDir('./controllers');
console.log('Done!');