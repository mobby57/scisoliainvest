// Test de connexion API
const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🔍 Test de connexion API...\n');
  
  try {
    // Test health
    const health = await fetch(`${API_URL}/health`);
    const healthData = await health.json();
    console.log('✅ Health check:', healthData.status);
    
    // Test register
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Register:', registerData.user.name);
      
      // Test login
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login:', loginData.user.name);
        console.log('✅ Token:', loginData.token ? 'OK' : 'Missing');
      }
    }
    
    console.log('\n🎉 Tous les tests passés !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAPI();