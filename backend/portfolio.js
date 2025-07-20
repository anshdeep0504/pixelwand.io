const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Portfolio schema
const portfolioSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  holdings: [
    {
      ticker: String,
      quantity: Number,
      companyName: String,
      price: Number,
      sector: String,
      value: Number,
    }
  ],
  cash: Number,
  totalValue: Number,
  aiInsights: Object,
  createdAt: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: true },
  views: { type: Number, default: 0 }, // <-- add this line
});
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Auth middleware
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// Create or update portfolio (only one per user)
router.post('/', auth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ ownerId: req.user.id });
    if (portfolio) {
      // Update existing portfolio
      Object.assign(portfolio, req.body);
      await portfolio.save();
      return res.json({ id: portfolio._id });
    } else {
      // Create new portfolio
      portfolio = new Portfolio({ ...req.body, ownerId: req.user.id });
      await portfolio.save();
      return res.json({ id: portfolio._id });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to create or update portfolio' });
  }
});

// Get all portfolios for user
router.get('/mine', auth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch portfolios' });
  }
});

// Public endpoint to fetch a portfolio by ID (no auth)
router.get('/public/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    if (portfolio.isPublic === false) {
      return res.status(403).json({ message: 'Admin has revoked permissions for this portfolio.' });
    }
    portfolio.views = (portfolio.views || 0) + 1;
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
});

// Get portfolio by id (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    if (portfolio.ownerId.toString() !== req.user.id) return res.status(403).json({ message: 'Permission denied' });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
});

// Update portfolio
router.put('/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    if (portfolio.ownerId.toString() !== req.user.id) return res.status(403).json({ message: 'Permission denied' });
    Object.assign(portfolio, req.body);
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update portfolio' });
  }
});

// Delete portfolio
router.delete('/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    if (portfolio.ownerId.toString() !== req.user.id) return res.status(403).json({ message: 'Permission denied' });
    portfolio.isPublic = false;
    await portfolio.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to revoke portfolio' });
  }
});

module.exports = router; 