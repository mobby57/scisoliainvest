// scripts/checkEnv.js
const fs = require('fs');
const path = require('path');

const required = [
  'NODE_ENV',
  'PORT',
  // in production require secrets
  ...(process.env.NODE_ENV === 'production' ? ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'CSRF_SECRET'] : [])
];

const missing = required.filter((k) => !process.env[k]);

if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

console.log('Environment variables OK');