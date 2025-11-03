#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Configuration des utilisateurs de test
const USERS_CONFIG = {
  tenant: {
    id: uuidv4(),
    name: 'SCI Solia Invest - Test',
    subscriptionPlan: 'ENTERPRISE',
    maxUsers: 100,
    maxSCI: 50
  },
  users: [
    {
      email: 'admin@scisoliainvest.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'System',
      role: 'ADMIN',
      isVerified: true,
      kycStatus: 'APPROVED'
    },
    {
      email: 'owner@scisoliainvest.com', 
      password: 'Owner123!',
      firstName: 'Jean',
      lastName: 'Propriétaire',
      role: 'OWNER',
      isVerified: true,
      kycStatus: 'APPROVED'
    },
    {
      email: 'gestionnaire@scisoliainvest.com',
      password: 'Gest123!',
      firstName: 'Marie',
      lastName: 'Gestionnaire',
      role: 'GESTIONNAIRE',
      isVerified: true,
      kycStatus: 'APPROVED'
    },
    {
      email: 'notaire@scisoliainvest.com',
      password: 'Notaire123!',
      firstName: 'Pierre',
      lastName: 'Notaire',
      role: 'NOTAIRE',
      isVerified: true,
      kycStatus: 'APPROVED'
    },
    {
      email: 'avocat@scisoliainvest.com',
      password: 'Avocat123!',
      firstName: 'Sophie',
      lastName: 'Avocat',
      role: 'AVOCAT',
      isVerified: true,
      kycStatus: 'APPROVED'
    },
    {
      email: 'investor@scisoliainvest.com',
      password: 'Invest123!',
      firstName: 'Paul',
      lastName: 'Investisseur',
      role: 'INVESTOR',
      isVerified: true,
      kycStatus: 'APPROVED'
    }
  ]
};

async function createTenant() {
  console.log('🏢 Création du tenant de test...');
  
  const existingTenant = await prisma.tenant.findFirst({
    where: { name: USERS_CONFIG.tenant.name }
  });

  if (existingTenant) {
    console.log('✅ Tenant existant trouvé:', existingTenant.name);
    return existingTenant;
  }

  const tenant = await prisma.tenant.create({
    data: USERS_CONFIG.tenant
  });

  console.log('✅ Tenant créé:', tenant.name);
  return tenant;
}

async function createUsers(tenant) {
  console.log('👥 Création des utilisateurs de test...');
  
  for (const userData of USERS_CONFIG.users) {
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  Utilisateur existant: ${userData.email}`);
        continue;
      }

      // Hasher le mot de passe
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: userData.email,
          passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          isVerified: userData.isVerified,
          kycStatus: userData.kycStatus,
          isActive: true
        }
      });

      console.log(`✅ Utilisateur créé: ${userData.email} (${userData.role})`);
      
    } catch (error) {
      console.error(`❌ Erreur création ${userData.email}:`, error.message);
    }
  }
}

async function listExistingUsers() {
  console.log('\n📋 Utilisateurs existants:');
  
  const users = await prisma.user.findMany({
    include: {
      tenant: true
    },
    orderBy: { createdAt: 'desc' }
  });

  if (users.length === 0) {
    console.log('Aucun utilisateur trouvé.');
    return;
  }

  users.forEach(user => {
    console.log(`📧 ${user.email} | ${user.role} | ${user.isActive ? '✅' : '❌'} | ${user.tenant.name}`);
  });
}

async function main() {
  try {
    console.log('🚀 Script de création d\'utilisateurs SCI Solia Invest\n');

    // Créer le tenant
    const tenant = await createTenant();

    // Créer les utilisateurs
    await createUsers(tenant);

    // Lister les utilisateurs existants
    await listExistingUsers();

    console.log('\n🎉 Script terminé avec succès!');
    console.log('\n📝 Identifiants de connexion:');
    USERS_CONFIG.users.forEach(user => {
      console.log(`${user.role}: ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour nettoyer les données de test
async function cleanup() {
  console.log('🧹 Nettoyage des données de test...');
  
  const testEmails = USERS_CONFIG.users.map(u => u.email);
  
  await prisma.user.deleteMany({
    where: { email: { in: testEmails } }
  });

  await prisma.tenant.deleteMany({
    where: { name: USERS_CONFIG.tenant.name }
  });

  console.log('✅ Nettoyage terminé');
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes('--cleanup')) {
  cleanup();
} else {
  main();
}