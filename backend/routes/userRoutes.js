const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   POST /api/users
 * @desc    Register a new user
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, age, city } = req.body;

    // Simple validation check before database operations
    if (!fullName || !email || !phone || !age || !city) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists with the same email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create and save new user
    const newUser = new User({
      fullName,
      email,
      phone,
      age: Number(age),
      city,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: savedUser,
    });
  } catch (error) {
    console.error('Error in user registration:', error);

    // Mongoose validation error handling
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    // Duplicate key error handler (if the email index check is bypassed somehow)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }); // Get latest users first
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error, failed to retrieve users' });
  }
});

module.exports = router;
