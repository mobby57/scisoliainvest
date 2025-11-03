const jwt = require('jsonwebtoken');

// Test expired token
const payload = {
  userId: 'test-user',
  iat: Math.floor(Date.now() / 1000) - 7200, // issued 2 hours ago
  exp: Math.floor(Date.now() / 1000) - 3600  // expired 1 hour ago
};

try {
  const expiredToken = jwt.sign(payload, 'test-jwt-secret');
  console.log('Expired token created:', expiredToken);
  
  const decoded = jwt.verify(expiredToken, 'test-jwt-secret');
  console.log('Token verified (should not happen):', decoded);
} catch (error) {
  console.log('Error caught:', error.name, error.message);
}

// Test not-before token
const payload2 = {
  userId: 'test-user',
  iat: Math.floor(Date.now() / 1000),
  nbf: Math.floor(Date.now() / 1000) + 3600, // not before 1 hour from now
  exp: Math.floor(Date.now() / 1000) + 7200  // expires in 2 hours
};

try {
  const futureToken = jwt.sign(payload2, 'test-jwt-secret');
  console.log('Future token created:', futureToken);
  
  const decoded = jwt.verify(futureToken, 'test-jwt-secret');
  console.log('Token verified (should not happen):', decoded);
} catch (error) {
  console.log('Error caught:', error.name, error.message);
}