const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  spent: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    required: true,
    enum: ['weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  alerts: {
    enabled: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 80 // percentage
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for user queries
budgetSchema.index({ user: 1, category: 1 });

// Virtual for remaining amount
budgetSchema.virtual('remaining').get(function() {
  return this.amount - this.spent;
});

// Virtual for percentage used
budgetSchema.virtual('percentageUsed').get(function() {
  return this.amount > 0 ? (this.spent / this.amount) * 100 : 0;
});

module.exports = mongoose.model('Budget', budgetSchema);
