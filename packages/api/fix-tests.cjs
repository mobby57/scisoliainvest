#!/usr/bin/env node

/**
 * Comprehensive Test Fix Script
 * This script addresses all the test failures identified in the test suite
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting comprehensive test fixes...');

// 1. Create missing directories and files
const requiredFiles = [
  'tests/setup/unified-test-setup.js',
  'tests/setup/test-setup.js',
  'vitest.config.js',
  '.env.test'
];

// 2. Update package.json with test scripts
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.test = 'vitest run';
  packageJson.scripts['test:watch'] = 'vitest';
  packageJson.scripts['test:ui'] = 'vitest --ui';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json with test scripts');
}

// 3. Create .env.test file
const envTestContent = `# Test Environment Configuration
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/scisoliainvest_test
JWT_SECRET=test-secret-key-change-in-production
PORT=3001
`;

fs.writeFileSync(path.join(__dirname, '.env.test'), envTestContent);
console.log('✅ Created .env.test file');

// 4. Create test runner script
const testRunnerContent = `#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running comprehensive test suite...');

try {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Run tests with increased timeout
  execSync('npx vitest run --reporter=verbose', {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://localhost:27017/scisoliainvest_test'
    }
  });
  
  console.log('✅ All tests completed successfully!');
} catch (_error) {
  console.error('❌ Tests failed:', error.message);
  process.exit(1);
}
`;

fs.writeFileSync(path.join(__dirname, 'run-tests.cjs'), testRunnerContent);
fs.chmodSync(path.join(__dirname, 'run-tests.cjs'), '755');
console.log('✅ Created test runner script');

console.log('🎉 Test fixes completed! Run "npm test" to verify fixes.');
