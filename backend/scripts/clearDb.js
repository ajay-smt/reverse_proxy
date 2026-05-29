const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Bet = require('../models/Bet');
const Settings = require('../models/Settings');

async function clearDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    console.log('Clearing users...');
    await User.deleteMany({});
    console.log('Users cleared.');

    console.log('Clearing bets...');
    await Bet.deleteMany({});
    console.log('Bets cleared.');

    console.log('Clearing settings...');
    await Settings.deleteMany({});
    console.log('Settings cleared.');

    // Initialize default settings
    console.log('Initializing default settings...');
    const settings = new Settings({
      winPercentage: 40,
      winMultiplier: 2.0,
      houseProfit: 0,
    });
    await settings.save();
    console.log('Default settings initialized.');

    console.log('Database cleared and initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
