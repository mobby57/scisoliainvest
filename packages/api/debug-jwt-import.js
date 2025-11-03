import { createTestToken, TokenFactory } from './src/tests/utils/jwtMock.ts';

console.log('Testing JWT mock imports...');

try {
  console.log('createTestToken function:', typeof createTestToken);
  console.log('TokenFactory object:', typeof TokenFactory);
  
  const token = createTestToken();
  console.log('✅ createTestToken result:', token ? 'SUCCESS' : 'FAILED');
  console.log('Token type:', typeof token);
  console.log('Token length:', token?.length || 0);
  
  const investorToken = TokenFactory.investor();
  console.log('✅ TokenFactory.investor result:', investorToken ? 'SUCCESS' : 'FAILED');
  console.log('Investor token type:', typeof investorToken);
  
} catch (error) {
  console.error('❌ Import or execution failed:', error.message);
  console.error('Stack:', error.stack);
}