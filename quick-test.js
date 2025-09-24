// Test rapide du backend
const { spawn } = require('child_process');
const fetch = require('node-fetch');

console.log('🚀 Démarrage du backend SCI Solia Invest...');

// Démarrer le serveur
const server = spawn('node', ['server.js'], {
  cwd: './packages/api',
  env: { ...process.env, PORT: '3000' }
});

server.stdout.on('data', (data) => {
  console.log(`📡 ${data}`);
});

// Attendre 3 secondes puis tester
setTimeout(async () => {
  console.log('\n🧪 Test de connexion...');
  
  try {
    // Test Health
    const health = await fetch('http://localhost:3000/api/health');
    const healthData = await health.json();
    console.log('✅ Health:', healthData.status);
    
    // Test Register
    const register = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!'
      })
    });
    
    if (register.ok) {
      const userData = await register.json();
      console.log('✅ Register:', userData.user.name);
      
      // Test Login
      const login = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPass123!'
        })
      });
      
      if (login.ok) {
        const loginData = await login.json();
        console.log('✅ Login:', loginData.user.email);
        console.log('✅ Token généré');
        
        console.log('\n🎉 Backend opérationnel!');
        console.log('📋 API disponible sur: http://localhost:3000');
      }
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}, 3000);

// Arrêter proprement
process.on('SIGINT', () => {
  server.kill();
  process.exit();
});