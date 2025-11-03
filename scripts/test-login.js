#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

const TEST_USERS = [
  { email: 'admin@scisoliainvest.com', password: 'Admin123!', role: 'ADMIN' },
  { email: 'owner@scisoliainvest.com', password: 'Owner123!', role: 'OWNER' },
  { email: 'gestionnaire@scisoliainvest.com', password: 'Gest123!', role: 'GESTIONNAIRE' },
  { email: 'notaire@scisoliainvest.com', password: 'Notaire123!', role: 'NOTAIRE' },
  { email: 'avocat@scisoliainvest.com', password: 'Avocat123!', role: 'AVOCAT' },
  { email: 'investor@scisoliainvest.com', password: 'Invest123!', role: 'INVESTOR' }
];

async function testLogin(user) {
  try {
    console.log(`🔐 Test connexion: ${user.email}`);
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${user.role}: Connexion réussie`);
      console.log(`   Token: ${data.data.accessToken.substring(0, 20)}...`);
      console.log(`   Utilisateur: ${data.data.user.firstName} ${data.data.user.lastName}`);
      return { success: true, token: data.data.accessToken };
    } else {
      console.log(`❌ ${user.role}: ${data.message}`);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log(`❌ ${user.role}: Erreur réseau - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testProfile(token, role) {
  try {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${role}: Profil récupéré`);
      return true;
    } else {
      console.log(`❌ ${role}: Erreur profil - ${data.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${role}: Erreur profil - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🧪 Test des connexions utilisateurs\n');
  
  let successCount = 0;
  const results = [];

  for (const user of TEST_USERS) {
    const loginResult = await testLogin(user);
    
    if (loginResult.success) {
      const profileResult = await testProfile(loginResult.token, user.role);
      if (profileResult) {
        successCount++;
      }
      results.push({ ...user, success: true });
    } else {
      results.push({ ...user, success: false, error: loginResult.error });
    }
    
    console.log(''); // Ligne vide
  }

  console.log('📊 Résumé des tests:');
  console.log(`✅ Réussis: ${successCount}/${TEST_USERS.length}`);
  console.log(`❌ Échecs: ${TEST_USERS.length - successCount}/${TEST_USERS.length}`);

  if (successCount === TEST_USERS.length) {
    console.log('\n🎉 Tous les tests de connexion ont réussi!');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez:');
    console.log('   - Que l\'API est démarrée (npm run dev dans packages/api)');
    console.log('   - Que les utilisateurs ont été créés');
    console.log('   - Que la base de données est accessible');
  }
}

main();