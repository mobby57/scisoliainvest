// Seed multi-tenant SCI Solia Invest

// Ce script crée des SCI, utilisateurs, biens, contrats et paiements pour plusieurs tenants
// Utilisation : node scripts/seed-multitenant.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Exemple de tenants
  const tenants = [
    { name: 'TenantA', id: 'tenant-a' },
    { name: 'TenantB', id: 'tenant-b' }
  ];

  for (const tenant of tenants) {
    // Crée une SCI pour chaque tenant
    const sci = await prisma.sci.create({
      data: {
        name: `${tenant.name} SCI`,
        tenantId: tenant.id,
        address: '1 rue de la SCI',
        capital: 100000
      }
    });

    // Crée un utilisateur propriétaire
    const user = await prisma.user.create({
      data: {
        email: `${tenant.id}@sci.com`,
        firstName: 'Admin',
        lastName: tenant.name,
        role: 'admin',
        tenantId: tenant.id
      }
    });

    // Crée un bien
    await prisma.property.create({
      data: {
        sciId: sci.id,
        address: '2 rue du Bien',
        purchasePrice: 50000,
        currentValue: 60000,
        tenantId: tenant.id
      }
    });
    // ... Ajoute contrats, paiements, etc.
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
