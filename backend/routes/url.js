import express from 'express';
import Url from '../models/Url.js';

const router = express.Router();

// Create short URL
router.post('/', async (req, res) => {
  try {
    const { userId, originalUrl, shortCode, domain, expiresAt } = req.body;
    const url = new Url({ userId, originalUrl, shortCode, domain, expiresAt });
    await url.save();
    res.status(201).json(url);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all URLs for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.params.userId });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a URL
router.put('/:id', async (req, res) => {
  try {
    const url = await Url.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(url);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a URL
router.delete('/:id', async (req, res) => {
  try {
    await Url.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
