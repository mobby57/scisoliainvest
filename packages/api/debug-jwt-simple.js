import jwt from 'jsonwebtoken';

// Test JWT creation directly
const TEST_SECRET = 'test-jwt-secret-32-characters-long-for-testing-purposes';

console.log('Testing JWT creation...');

try {
  const payload = {
    userId: 'test-user-id',
    email: 'test@scisoliainvest.com',
    role: 'INVESTOR',
    tenantId: 'test-tenant',
    iss: 'scisoliainvest.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  
  const token = jwt.sign(payload, TEST_SECRET, { algorithm: 'HS256' });
  console.log('✅ Token created successfully:', token ? 'YES' : 'NO');
  console.log('Token length:', token?.length || 0);
  
  if (token) {
    const decoded = jwt.decode(token);
    console.log('✅ Token decoded successfully:', decoded ? 'YES' : 'NO');
    console.log('Decoded payload:', decoded);
  }
  
} catch (error) {
  console.error('❌ JWT creation failed:', error.message);
}