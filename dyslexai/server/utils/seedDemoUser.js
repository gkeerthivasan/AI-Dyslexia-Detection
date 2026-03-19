const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Demo user data
const demoUser = {
  name: 'Demo User',
  email: 'demo@dyslexai.com',
  password: 'demo123',
  age: 25,
  hasDyslexia: true
};

async function seedDemoUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const User = require('../models/User');
    
    // Check if demo user already exists
    const existingUser = await User.findOne({ email: demoUser.email });
    if (existingUser) {
      console.log('Demo user already exists');
      console.log('Email:', demoUser.email);
      console.log('Password:', demoUser.password);
      return;
    }
    
    // Create demo user
    const user = new User({
      name: demoUser.name,
      email: demoUser.email.toLowerCase(),
      passwordHash: demoUser.password, // Will be hashed by pre-save middleware
      age: demoUser.age,
      hasDyslexia: demoUser.hasDyslexia
    });
    
    await user.save();
    console.log('Demo user created successfully!');
    console.log('Email:', demoUser.email);
    console.log('Password:', demoUser.password);
    
  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedDemoUser();
}

module.exports = { seedDemoUser };
