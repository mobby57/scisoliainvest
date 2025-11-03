// Debug script to understand what's happening
import jwt from 'jsonwebtoken';

// Test 1: Create a minimal token
const minimalToken = jwt.sign(
  { userId: 'minimal-user' },
  'test-jwt-secret'
);

console.log('Minimal token payload:');
console.log(jwt.decode(minimalToken));

// Test 2: Create a token without userId
const tokenWithoutUserId = jwt.sign(
  { email: 'test@example.com' },
  'test-jwt-secret'
);

console.log('\nToken without userId payload:');
console.log(jwt.decode(tokenWithoutUserId));

// Test 3: Create an expired token
const expiredToken = jwt.sign(
  { userId: 'test', exp: Math.floor(Date.now() / 1000) - 3600 },
  'test-jwt-secret'
);

console.log('\nExpired token payload:');
console.log(jwt.decode(expiredToken));

// Test 4: Try to verify expired token
try {
  jwt.verify(expiredToken, 'test-jwt-secret');
  console.log('\nExpired token verified successfully (unexpected)');
} catch (error) {
  console.log('\nExpired token verification failed (expected):');
  console.log('Error name:', error.name);
  console.log('Error message:', error.message);
}