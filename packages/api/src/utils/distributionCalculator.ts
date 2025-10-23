import type { Associate } from '../sci/sci.types.js';

interface DistributionLine {
  associateId: string;
  amount: number;
}

export const calculateDistribution = (associates: Associate[], totalAmount: number): DistributionLine[] => {
  try {
    if (!associates || associates.length === 0) {
      throw new Error('No associates provided for distribution');
    }

    // Validate that share percentages sum to 100%
    const totalPercentage = associates.reduce((sum, associate) => sum + associate.sharePercentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) { // Allow small floating point tolerance
      throw new Error(`Associate share percentages must sum to 100%, got ${totalPercentage}%`);
    }

    // Calculate distribution per associate based on share percentage
    const distributionLines: DistributionLine[] = associates.map((associate) => ({
      associateId: associate.id,
      amount: parseFloat((totalAmount * associate.sharePercentage / 100).toFixed(2)) // Round to 2 decimal places
    }));

    return distributionLines;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Error calculating distribution: ${errorMessage}`);
  }
};
