const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname);
const invalidRoutePattern = /\/:(?![a-zA-Z0-9_])|\/\*(?![a-zA-Z0-9_])/;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    const match = line.match(/(['"`])([^'"`]*?)\1/g);
    if (match) {
      match.forEach(str => {
        if (invalidRoutePattern.test(str)) {
          console.log('Invalid route path found in ' + filePath + ' at line ' + (index + 1) + ': ' + str);
        }
      });
    }
  });
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && /\.(js|ts|jsx|tsx)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  });
}

console.log('Scanning project for invalid route paths...');
scanDir(projectDir);
console.log('Scan complete.');
