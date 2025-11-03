import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Distributed lock using DB
async function getDbLock(lockName, ttlMinutes = 30) {
  const lockId = createHash('sha256').update(lockName).digest('hex');
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  
  try {
    await prisma.jobLock.create({
      data: { lockId, lockName, expiresAt }
    });
    return true;
  } catch (error) {
    // Lock already exists or expired
    const existing = await prisma.jobLock.findUnique({ where: { lockId } });
    if (existing && existing.expiresAt < new Date()) {
      await prisma.jobLock.delete({ where: { lockId } });
      return getDbLock(lockName, ttlMinutes);
    }
    return false;
  }
}

async function releaseDbLock(lockName) {
  const lockId = createHash('sha256').update(lockName).digest('hex');
  await prisma.jobLock.delete({ where: { lockId } }).catch(() => {});
}

async function distributeRent(tenantId, period) {
  const lockName = `distributeRent_${tenantId}_${period}`;
  
  if (!await getDbLock(lockName)) {
    console.log(`Job already running: ${lockName}`);
    return { success: false, reason: 'already_running' };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get properties with available rent for period
      const properties = await tx.property.findMany({
        where: { 
          tenantId,
          rentDistributions: {
            none: { period }
          }
        },
        include: { 
          investments: {
            include: { investor: true }
          }
        }
      });

      const results = [];

      for (const property of properties) {
        const totalShares = property.investments.reduce((sum, inv) => sum + inv.sharesPercent, 0);
        
        if (totalShares !== 100) {
          console.warn(`Property ${property.id}: shares total ${totalShares}% != 100%`);
          continue;
        }

        const rentAmount = property.monthlyRent;
        const allocations = [];

        for (const investment of property.investments) {
          // Check KYC status
          if (investment.investor.kycStatus !== 'APPROVED') {
            console.log(`Skipping investor ${investment.investorId}: KYC not approved`);
            continue;
          }

          const allocation = Math.round((rentAmount * investment.sharesPercent) / 100);
          
          allocations.push({
            investorId: investment.investorId,
            propertyId: property.id,
            amount: allocation,
            sharesPercent: investment.sharesPercent,
            period,
            tenantId
          });
        }

        // Create rent distribution record
        const distribution = await tx.rentDistribution.create({
          data: {
            propertyId: property.id,
            period,
            totalAmount: rentAmount,
            tenantId,
            allocations: {
              create: allocations
            }
          }
        });

        // Create audit log
        await tx.auditLog.create({
          data: {
            action: 'RENT_DISTRIBUTED',
            entityType: 'PROPERTY',
            entityId: property.id,
            tenantId,
            metadata: {
              period,
              totalAmount: rentAmount,
              allocationsCount: allocations.length,
              distributionId: distribution.id
            }
          }
        });

        results.push({
          propertyId: property.id,
          distributionId: distribution.id,
          allocationsCount: allocations.length,
          totalAmount: rentAmount
        });
      }

      return { success: true, results };
    });

  } catch (error) {
    console.error('Rent distribution failed:', error);
    return { success: false, error: error.message };
  } finally {
    await releaseDbLock(lockName);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const tenantId = process.env.TENANT_ID || process.argv[2];
  const period = process.env.PERIOD || process.argv[3] || new Date().toISOString().slice(0, 7); // YYYY-MM
  
  if (!tenantId) {
    console.error('Usage: node distributeRent.js <tenantId> [period]');
    process.exit(1);
  }

  distributeRent(tenantId, period)
    .then(result => {
      console.log('Distribution result:', JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { distributeRent };