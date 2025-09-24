// Script de test de connexion API
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

async function testAPIConnection() {
  console.log('🔍 Test de connexion API SCI Solia Invest...\n');

  try {
    // 1. Test Health Check
    console.log('1. Test Health Check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ Health Check OK:', healthData);
    } else {
      console.log('❌ Health Check échoué');
      return;
    }

    // 2. Test Register
    console.log('\n2. Test Register...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!'
    };

    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });

    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ Register OK:', { user: registerResult.user });
      
      // 3. Test Login
      console.log('\n3. Test Login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        })
      });

      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        console.log('✅ Login OK:', { user: loginResult.user });
        
        // 4. Test Auth Token
        console.log('\n4. Test Auth Token...');
        const meResponse = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${loginResult.token}` }
        });

        if (meResponse.ok) {
          const meResult = await meResponse.json();
          console.log('✅ Auth Token OK:', meResult.user);
        } else {
          console.log('❌ Auth Token échoué');
        }
      } else {
        console.log('❌ Login échoué');
      }
    } else {
      const error = await registerResponse.json();
      console.log('❌ Register échoué:', error);
    }

    console.log('\n🎉 Tests de connexion terminés!');

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('\n💡 Assurez-vous que l\'API est démarrée avec: npm run dev');
  }
}

// Exécuter les tests
testAPIConnection();