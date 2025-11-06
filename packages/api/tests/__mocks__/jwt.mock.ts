import jwt from 'jsonwebtoken';

/**
 * JWT Mock for Testing
 * This module provides mock JWT tokens for testing purposes
 */

const TEST_JWT_SECRET = 'test-secret-key-for-unit-tests-only';
const TEST_JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-unit-tests-only';

export interface MockUser {
  id: string;
  email: string;
  role: string;
  tenantId: string;
}

/**
 * Generate a mock JWT access token for testing
 */
export function generateMockAccessToken(user: Partial<MockUser> = {}): string {
  const payload = {
    id: user.id || 'test-user-123',
    email: user.email || 'test@example.com',
    role: user.role || 'INVESTOR',
    tenantId: user.tenantId || 'test-tenant-123',
    type: 'access',
  };

  return jwt.sign(payload, TEST_JWT_SECRET, {
    expiresIn: '15m',
  });
}

/**
 * Generate a mock JWT refresh token for testing
 */
export function generateMockRefreshToken(user: Partial<MockUser> = {}): string {
  const payload = {
    id: user.id || 'test-user-123',
    email: user.email || 'test@example.com',
    type: 'refresh',
  };

  return jwt.sign(payload, TEST_JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateMockTokenPair(user: Partial<MockUser> = {}) {
  return {
    accessToken: generateMockAccessToken(user),
    refreshToken: generateMockRefreshToken(user),
  };
}

/**
 * Decode a mock token (for testing)
 */
export function decodeMockToken(token: string): any {
  try {
    return jwt.verify(token, TEST_JWT_SECRET);
  } catch (error) {
    try {
      return jwt.verify(token, TEST_JWT_REFRESH_SECRET);
    } catch (refreshError) {
      throw new Error('Invalid test token');
    }
  }
}

/**
 * Generate an expired token for testing
 */
export function generateExpiredToken(user: Partial<MockUser> = {}): string {
  const payload = {
    id: user.id || 'test-user-123',
    email: user.email || 'test@example.com',
    role: user.role || 'INVESTOR',
    type: 'access',
  };

  return jwt.sign(payload, TEST_JWT_SECRET, {
    expiresIn: '-1h', // Expired 1 hour ago
  });
}

/**
 * Generate a token with invalid signature
 */
export function generateInvalidSignatureToken(user: Partial<MockUser> = {}): string {
  const payload = {
    id: user.id || 'test-user-123',
    email: user.email || 'test@example.com',
    role: user.role || 'INVESTOR',
    type: 'access',
  };

  return jwt.sign(payload, 'wrong-secret', {
    expiresIn: '15m',
  });
}

/**
 * Mock user fixtures for testing
 */
export const mockUsers = {
  investor: {
    id: 'investor-123',
    email: 'investor@example.com',
    role: 'INVESTOR',
    tenantId: 'tenant-123',
  },
  admin: {
    id: 'admin-123',
    email: 'admin@example.com',
    role: 'ADMIN',
    tenantId: 'tenant-123',
  },
  portfolioManager: {
    id: 'manager-123',
    email: 'manager@example.com',
    role: 'PORTFOLIO_MANAGER',
    tenantId: 'tenant-123',
  },
};

/**
 * Generate tokens for predefined mock users
 */
export const mockTokens = {
  investor: generateMockAccessToken(mockUsers.investor),
  admin: generateMockAccessToken(mockUsers.admin),
  portfolioManager: generateMockAccessToken(mockUsers.portfolioManager),
  expired: generateExpiredToken(),
  invalidSignature: generateInvalidSignatureToken(),
};

/**
 * Helper to create authorization header
 */
export function createAuthHeader(token: string): { Authorization: string } {
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Helper to create mock request with auth
 */
export function createMockAuthRequest(user: Partial<MockUser> = {}) {
  const token = generateMockAccessToken(user);
  return {
    headers: createAuthHeader(token),
    user: {
      id: user.id || 'test-user-123',
      email: user.email || 'test@example.com',
      role: user.role || 'INVESTOR',
      tenantId: user.tenantId || 'test-tenant-123',
    },
  };
}
