#!/usr/bin/env node
/**
 * Auto telemetry implementation script
 * Runs telemetry setup automatically with predefined parameters
 */

import { execSync } from 'child_process';
import path from 'path';

const configs = [
  {
    metric: 'distribution_calculate',
    files: ['packages/api/src/lib/distribution.ts', 'packages/api/middleware/authMiddleware.ts'],
    func: 'calculateDistributions'
  }
];

function runTelemetryScript(config) {
  const { metric, files, func } = config;
  const filesArg = files.join(' ');
  
  console.log(`\n=== Auto-implementing telemetry for ${metric} ===`);
  
  try {
    const cmd = `node scripts/implement-telemetry.js --metric ${metric} --files "${filesArg}" --func ${func} --commit`;
    console.log(`Running: ${cmd}`);
    
    execSync(cmd, { 
      stdio: 'inherit', 
      cwd: process.cwd() 
    });
    
    console.log(`✅ Completed telemetry for ${metric}`);
  } catch (error) {
    console.error(`❌ Failed telemetry for ${metric}:`, error.message);
  }
}

console.log('🚀 Starting automated telemetry implementation...');

configs.forEach(config => {
  runTelemetryScript(config);
});

console.log('\n🎉 Automated telemetry implementation complete!');