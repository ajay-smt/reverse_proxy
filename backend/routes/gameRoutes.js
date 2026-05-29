const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bet = require('../models/Bet');
const Settings = require('../models/Settings');

/**
 * Helper: Ensure global settings record exists and return it
 */
async function getOrCreateSettings() {
  let settings = await Settings.findOne({});
  if (!settings) {
    settings = new Settings({
      winPercentage: 40,
      winMultiplier: 2.0,
      houseProfit: 0,
    });
    await settings.save();
  }
  return settings;
}

/**
 * @route   GET /api/admin/settings
 * @desc    Fetch game settings (win percentage, multiplier, house stats)
 * @access  Public (simplified for the exercise, normally admin-only)
 */
router.get('/admin/settings', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error, failed to retrieve settings' });
  }
});

/**
 * @route   POST /api/admin/settings
 * @desc    Update win percentage and multiplier
 * @access  Public
 */
router.post('/admin/settings', async (req, res) => {
  try {
    const { winPercentage, winMultiplier } = req.body;

    if (winPercentage === undefined || winMultiplier === undefined) {
      return res.status(400).json({ message: 'Please provide winPercentage and winMultiplier' });
    }

    const percentage = Number(winPercentage);
    const multiplier = Number(winMultiplier);

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return res.status(400).json({ message: 'Win percentage must be between 0 and 100' });
    }
    if (isNaN(multiplier) || multiplier < 1.0) {
      return res.status(400).json({ message: 'Win multiplier must be at least 1.0' });
    }

    const settings = await getOrCreateSettings();
    settings.winPercentage = percentage;
    settings.winMultiplier = multiplier;
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error, failed to update settings' });
  }
});

/**
 * @route   POST /api/users/:id/deposit
 * @desc    Deposit mock money into a user's wallet
 * @access  Public
 */
router.post('/users/:id/deposit', async (req, res) => {
  try {
    const { amount } = req.body;
    const depositAmount = Number(amount);

    if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid deposit amount greater than 0' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.balance += depositAmount;
    user.totalDeposited += depositAmount;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Successfully deposited ₹${depositAmount}`,
      balance: user.balance,
      user,
    });
  } catch (error) {
    console.error('Error in deposit:', error);
    res.status(500).json({ message: 'Server error, deposit failed' });
  }
});

/**
 * @route   POST /api/users/:id/bet
 * @desc    Place a bet
 * @access  Public
 */
router.post('/users/:id/bet', async (req, res) => {
  try {
    const { amount } = req.body;
    const betAmount = Number(amount);

    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid bet amount greater than 0' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.balance < betAmount) {
      return res.status(400).json({ message: 'Insufficient balance to place this bet' });
    }

    const settings = await getOrCreateSettings();
    const winPercentage = settings.winPercentage;
    const winMultiplier = settings.winMultiplier;

    // Roll dice (1 to 100)
    const roll = Math.floor(Math.random() * 100) + 1;
    const isWin = roll <= winPercentage;

    let payout = 0;
    let outcome = 'lose';

    if (isWin) {
      payout = Math.round(betAmount * winMultiplier);
      outcome = 'win';
      user.balance += (payout - betAmount); // Net gain
      user.totalWon += payout;
      settings.houseProfit -= (payout - betAmount);
    } else {
      user.balance -= betAmount; // Net loss
      settings.houseProfit += betAmount;
      outcome = 'lose';
    }

    user.totalWagered += betAmount;
    await user.save();
    await settings.save();

    // Create Bet record
    const bet = new Bet({
      userId: user._id,
      amount: betAmount,
      outcome,
      payout,
      winRateApplied: winPercentage,
      multiplierApplied: winMultiplier,
    });
    await bet.save();

    res.status(200).json({
      success: true,
      outcome,
      roll,
      winPercentage,
      winMultiplier,
      payout,
      newBalance: user.balance,
      bet,
    });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ message: 'Server error, failed to place bet' });
  }
});

/**
 * @route   GET /api/users/:id/bets
 * @desc    Get user's bet history
 * @access  Public
 */
router.get('/users/:id/bets', async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bets.length,
      bets,
    });
  } catch (error) {
    console.error('Error fetching user bets:', error);
    res.status(500).json({ message: 'Server error, failed to retrieve bets' });
  }
});

/**
 * @route   POST /api/admin/users/:id/balance
 * @desc    Admin manually update user balance
 * @access  Public
 */
router.post('/admin/users/:id/balance', async (req, res) => {
  try {
    const { balance } = req.body;
    const newBalance = Number(balance);

    if (balance === undefined || isNaN(newBalance) || newBalance < 0) {
      return res.status(400).json({ message: 'Please provide a valid balance greater than or equal to 0' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const difference = newBalance - user.balance;
    user.balance = newBalance;
    await user.save();

    // Track in house profit if needed, or keep separate
    res.status(200).json({
      success: true,
      message: `Updated player balance to ₹${newBalance}`,
      user,
    });
  } catch (error) {
    console.error('Error updating player balance:', error);
    res.status(500).json({ message: 'Server error, failed to update balance' });
  }
});

module.exports = router;
