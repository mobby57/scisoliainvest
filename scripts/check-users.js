#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Vérification de la base de données...\n');

    // Vérifier la connexion
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');

    // Compter les tenants
    const tenantCount = await prisma.tenant.count();
    console.log(`📊 Tenants: ${tenantCount}`);

    // Compter les utilisateurs par rôle
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });

    console.log('\n👥 Utilisateurs par rôle:');
    usersByRole.forEach(group => {
      console.log(`   ${group.role}: ${group._count.role}`);
    });

    // Lister tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isVerified: true,
        kycStatus: true,
        createdAt: true,
        tenant: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('\n📋 Liste complète des utilisateurs:');
    console.log('─'.repeat(80));
    
    if (users.length === 0) {
      console.log('Aucun utilisateur trouvé dans la base de données.');
    } else {
      users.forEach((user, index) => {
        const status = user.isActive ? '🟢' : '🔴';
        const verified = user.isVerified ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${user.email}`);
        console.log(`   👤 ${user.firstName} ${user.lastName} | ${user.role}`);
        console.log(`   🏢 ${user.tenant.name} | Vérifié: ${verified} | KYC: ${user.kycStatus}`);
        console.log(`   📅 Créé: ${user.createdAt.toLocaleDateString('fr-FR')}`);
        console.log('');
      });
    }

    // Statistiques générales
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const verifiedUsers = users.filter(u => u.isVerified).length;

    console.log('📈 Statistiques:');
    console.log(`   Total: ${totalUsers}`);
    console.log(`   Actifs: ${activeUsers}`);
    console.log(`   Vérifiés: ${verifiedUsers}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();