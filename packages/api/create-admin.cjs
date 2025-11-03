const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Simple User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  profile: {
    firstName: String,
    lastName: String,
    phone: String
  }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/solia_invest";
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@solia-invest.com' });
    if (existingAdmin) {
      console.log('✅ Admin already exists: admin@solia-invest.com');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await User.create({
      email: 'admin@solia-invest.com',
      password: hashedPassword,
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'SO LIA',
        phone: '+33-1-23-45-67-89'
      }
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@solia-invest.com');
    console.log('🔑 Password: Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();