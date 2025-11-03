// Debug server to identify import issues
console.log('🔍 Starting debug server...');

try {
  console.log('Testing basic imports...');
  
  // Test express
  const express = await import('express');
  console.log('✓ Express imported');
  
  // Test env config
  console.log('Testing env config...');
  const { env } = await import('./src/config/env.js');
  console.log('✓ Env config imported');
  
  // Test logger
  console.log('Testing logger...');
  const { logger } = await import('./src/config/logger.js');
  console.log('✓ Logger imported');
  
  // Test app
  console.log('Testing app import...');
  const appModule = await import('./src/app.js');
  console.log('✓ App imported');
  
  console.log('🎉 All imports successful!');
  
} catch (error) {
  console.error('❌ Import error:', error.message);
  console.error('Stack:', error.stack);
}