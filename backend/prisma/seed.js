const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@scisoliainvest.com' },
    update: {},
    create: {
      email: 'admin@scisoliainvest.com',
      password: '$2a$10$YourHashedPasswordHere', // In real app, hash this properly
      firstName: 'Admin',
      lastName: 'SCI Solia',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', adminUser.email);

  // Create investor user
  const investorUser = await prisma.user.upsert({
    where: { email: 'investor@scisoliainvest.com' },
    update: {},
    create: {
      email: 'investor@scisoliainvest.com',
      password: '$2a$10$YourHashedPasswordHere', // In real app, hash this properly
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'INVESTOR',
    },
  });
  console.log('✅ Created investor user:', investorUser.email);

  // Create a sample SCI
  const sci = await prisma.sCI.upsert({
    where: { siret: '12345678901234' },
    update: {},
    create: {
      name: 'SCI Solia Invest',
      siret: '12345678901234',
      address: '123 Rue de la République',
      capital: 100000,
      description: 'Société civile immobilière dédiée à l\'investissement locatif',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created SCI:', sci.name);

  // Create a sample property
  const property = await prisma.property.create({
    data: {
      sciId: sci.id,
      name: 'Appartement Centre Ville',
      address: '45 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      type: 'APARTMENT',
      surface: 85.5,
      value: 450000,
      description: 'Bel appartement T3 en centre ville avec balcon',
    },
  });
  console.log('✅ Created property:', property.name);

  // Create a sample investment
  const investment = await prisma.investment.create({
    data: {
      userId: investorUser.id,
      sciId: sci.id,
      shares: 50,
      amount: 50000,
      date: new Date(),
    },
  });
  console.log('✅ Created investment:', investment.shares, 'shares for', investment.amount.toString(), '€');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
