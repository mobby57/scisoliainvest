import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Create test tenant
    const tenant = await prisma.tenant.upsert({
      where: { slug: 'test-tenant' },
      update: {},
      create: {
        name: 'Test Tenant',
        slug: 'test-tenant',
        domain: 'test.localhost',
        settings: {
          currency: 'EUR',
          timezone: 'Europe/Paris'
        }
      }
    });

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        tenantId: tenant.id,
        kycStatus: 'APPROVED'
      }
    });

    const investor1 = await prisma.user.upsert({
      where: { email: 'investor1@test.com' },
      update: {},
      create: {
        email: 'investor1@test.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Investor',
        role: 'INVESTOR',
        tenantId: tenant.id,
        kycStatus: 'APPROVED'
      }
    });

    const investor2 = await prisma.user.upsert({
      where: { email: 'investor2@test.com' },
      update: {},
      create: {
        email: 'investor2@test.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'INVESTOR',
        tenantId: tenant.id,
        kycStatus: 'PENDING'
      }
    });

    // Create test property
    const property = await prisma.property.upsert({
      where: { 
        address_tenantId: {
          address: '123 Test Street, Paris',
          tenantId: tenant.id
        }
      },
      update: {},
      create: {
        address: '123 Test Street, Paris',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        propertyType: 'APARTMENT',
        totalValue: 500000,
        monthlyRent: 2500,
        tenantId: tenant.id,
        managerId: adminUser.id
      }
    });

    // Create test investments
    await prisma.investment.upsert({
      where: {
        investorId_propertyId: {
          investorId: investor1.id,
          propertyId: property.id
        }
      },
      update: {},
      create: {
        investorId: investor1.id,
        propertyId: property.id,
        amount: 300000,
        sharesPercent: 60,
        investmentDate: new Date(),
        tenantId: tenant.id
      }
    });

    await prisma.investment.upsert({
      where: {
        investorId_propertyId: {
          investorId: investor2.id,
          propertyId: property.id
        }
      },
      update: {},
      create: {
        investorId: investor2.id,
        propertyId: property.id,
        amount: 200000,
        sharesPercent: 40,
        investmentDate: new Date(),
        tenantId: tenant.id
      }
    });

    // Seed MongoDB collections (if needed)
    if (process.env.MONGO_URI) {
      const mongoClient = new MongoClient(process.env.MONGO_URI);
      await mongoClient.connect();
      
      const db = mongoClient.db();
      
      // Seed documents collection
      await db.collection('documents').insertMany([
        {
          tenantId: tenant.id,
          userId: investor1.id,
          type: 'KYC_DOCUMENT',
          filename: 'passport_john.pdf',
          status: 'APPROVED',
          uploadedAt: new Date()
        },
        {
          tenantId: tenant.id,
          propertyId: property.id,
          type: 'PROPERTY_DEED',
          filename: 'deed_123_test_street.pdf',
          status: 'APPROVED',
          uploadedAt: new Date()
        }
      ]);

      await mongoClient.close();
    }

    console.log('✅ Database seeded successfully!');
    console.log(`📧 Admin: admin@test.com / password123`);
    console.log(`📧 Investor 1: investor1@test.com / password123`);
    console.log(`📧 Investor 2: investor2@test.com / password123`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };