// Mock utilities for testing

export function createMockModel<T>(): T {
  return {} as T;
}

export function createMockPrisma() {
  return {
    property: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };
}
