const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    winPercentage: {
      type: Number,
      required: true,
      default: 40,
      min: [0, 'Win percentage cannot be negative'],
      max: [100, 'Win percentage cannot exceed 100'],
    },
    winMultiplier: {
      type: Number,
      required: true,
      default: 2.0,
      min: [1.0, 'Multiplier must be at least 1.0'],
    },
    houseProfit: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
