const express = require('express');
const jwt = require('jsonwebtoken');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all budgets for user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId })
      .sort({ createdAt: -1 });

    // Calculate spent amounts for each budget
    for (let budget of budgets) {
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: req.userId,
            category: budget.category,
            type: 'expense',
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      budget.spent = spent[0]?.total || 0;
    }

    res.json({ budgets });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get budget by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Calculate spent amount
    const spent = await Transaction.aggregate([
      {
        $match: {
          user: req.userId,
          category: budget.category,
          type: 'expense',
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    budget.spent = spent[0]?.total || 0;

    res.json({ budget });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create budget
router.post('/', auth, async (req, res) => {
  try {
    const budget = new Budget({
      ...req.body,
      user: req.userId
    });

    await budget.save();
    res.status(201).json({ budget });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ budget });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get budget alerts
router.get('/alerts/check', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.userId,
      'alerts.enabled': true
    });

    const alerts = [];

    for (let budget of budgets) {
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: req.userId,
            category: budget.category,
            type: 'expense',
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      const spentAmount = spent[0]?.total || 0;
      const percentageUsed = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

      if (percentageUsed >= budget.alerts.threshold) {
        alerts.push({
          budgetId: budget._id,
          name: budget.name,
          category: budget.category,
          spent: spentAmount,
          budget: budget.amount,
          percentageUsed: Math.round(percentageUsed),
          threshold: budget.alerts.threshold
        });
      }
    }

    res.json({ alerts });
  } catch (error) {
    console.error('Check alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
