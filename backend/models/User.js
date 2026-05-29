const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, 'Please fill a valid phone number'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be a positive number'],
      max: [120, 'Age must be less than 120'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    balance: {
      type: Number,
      default: 5000,
    },
    totalDeposited: {
      type: Number,
      default: 0,
    },
    totalWagered: {
      type: Number,
      default: 0,
    },
    totalWon: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Compile schema into model
const User = mongoose.model('User', userSchema);

module.exports = User;
