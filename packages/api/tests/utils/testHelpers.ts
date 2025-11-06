import jwt from 'jsonwebtoken';

export function generateTestToken(payload: any): string {
  return jwt.sign(payload, 'test-secret', { expiresIn: '1h' });
}

export function mockUser() {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'INVESTOR',
  };
}
