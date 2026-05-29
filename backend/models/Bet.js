const mongoose = require('mongoose');

const betSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Bet amount is required'],
      min: [1, 'Bet amount must be at least 1'],
    },
    outcome: {
      type: String,
      enum: ['win', 'lose'],
      required: true,
    },
    payout: {
      type: Number,
      required: true,
      default: 0,
    },
    winRateApplied: {
      type: Number,
      required: true,
    },
    multiplierApplied: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bet', betSchema);
