const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'SCI Solia Invest API is operational',
    timestamp: new Date().toISOString()
  });
});

// Test Prisma connection - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });
    res.json({ 
      status: 'success',
      data: users 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch users' 
    });
  }
});

// Get all SCIs
app.get('/api/scis', async (req, res) => {
  try {
    const scis = await prisma.sCI.findMany({
      include: {
        properties: true,
        investments: true
      }
    });
    res.json({ 
      status: 'success',
      data: scis 
    });
  } catch (error) {
    console.error('Error fetching SCIs:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch SCIs' 
    });
  }
});

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        sci: true
      }
    });
    res.json({ 
      status: 'success',
      data: properties 
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch properties' 
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Prisma connected to database`);
});