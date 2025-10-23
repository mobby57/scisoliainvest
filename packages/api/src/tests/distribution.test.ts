import { describe, it, expect } from 'vitest';
import { calculateDistribution } from '../utils/distributionCalculator.js';
import type { Associate } from '../sci/sci.types.js';

describe('distribution', () => {
  it('distributes rent per shares percent and sums to total', () => {
    const associates: Associate[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        shares: 100,
        sharePercentage: 33.33
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        shares: 100,
        sharePercentage: 33.33
      },
      {
        id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        shares: 100,
        sharePercentage: 33.34
      }
    ];

    const total = 1000;
    const distribution = calculateDistribution(associates, total);

    // Verify we get 3 distribution lines
    expect(distribution).toHaveLength(3);

    // Verify the amounts are correct
    expect(distribution[0].amount).toBe(333.3);
    expect(distribution[1].amount).toBe(333.3);
    expect(distribution[2].amount).toBe(333.4);

    // Verify the sum equals the total
    const sum = distribution.reduce((total, line) => total + line.amount, 0);
    expect(sum).toBe(total);
  });

  it('handles equal share percentages correctly', () => {
    const associates: Associate[] = [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@example.com',
        shares: 50,
        sharePercentage: 50
      },
      {
        id: '2',
        firstName: 'Charlie',
        lastName: 'Wilson',
        email: 'charlie@example.com',
        shares: 50,
        sharePercentage: 50
      }
    ];

    const total = 1200;
    const distribution = calculateDistribution(associates, total);

    expect(distribution).toHaveLength(2);
    expect(distribution[0].amount).toBe(600);
    expect(distribution[1].amount).toBe(600);

    const sum = distribution.reduce((total, line) => total + line.amount, 0);
    expect(sum).toBe(total);
  });

  it('throws error when share percentages do not sum to 100%', () => {
    const associates: Associate[] = [
      {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        shares: 100,
        sharePercentage: 50
      }
    ];

    expect(() => calculateDistribution(associates, 1000)).toThrow('Associate share percentages must sum to 100%');
  });

  it('throws error when no associates provided', () => {
    expect(() => calculateDistribution([], 1000)).toThrow('No associates provided for distribution');
  });
});
