const API_URL = 'http://localhost:5000/api';

async function testIntegration() {
  console.log('🧪 Test d\'intégration complet...\n');
  
  try {
    // 1. Health check
    const health = await fetch(`${API_URL}/health`);
    console.log('✅ Health:', (await health.json()).status);
    
    // 2. Register
    const register = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const registerData = await register.json();
    console.log('✅ Register:', registerData.user?.name);
    const token = registerData.token;
    
    // 3. Login
    const login = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    console.log('✅ Login:', login.ok ? 'OK' : 'FAIL');
    
    // 4. Test protected routes
    const users = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Users route:', users.ok ? 'OK' : 'FAIL');
    
    // 5. Test SCI creation
    const sci = await fetch(`${API_URL}/sci`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test SCI',
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345'
      })
    });
    console.log('✅ SCI creation:', sci.ok ? 'OK' : 'FAIL');
    
    // 6. Test SCI calculator
    const calc = await fetch(`${API_URL}/sci/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        regime: 'IR',
        rentalIncome: 50000,
        expenses: 15000,
        associates: [{ name: 'Test', share: 100, marginalRate: 30 }]
      })
    });
    console.log('✅ SCI calculator:', calc.ok ? 'OK' : 'FAIL');
    
    console.log('\n🎉 Tous les tests passés !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testIntegration();