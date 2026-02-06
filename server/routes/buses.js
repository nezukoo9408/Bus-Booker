import express from 'express';
import mongoose from 'mongoose';
import Bus from '../models/Bus.js';

const router = express.Router();

// ✅ FIXED: Place this first to avoid being caught by /:id
router.get('/search', async (req, res) => {
  const { source, destination, journeyDate } = req.query;
  try {
    const buses = await Bus.find({ source, destination, journeyDate });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 ID-based route must come after /search
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  console.log("⬅️  Received ID from frontend:", id);
  console.log("🧠 Mongoose ObjectId.isValid:", mongoose.Types.ObjectId.isValid(id));
  console.log("📂 Connected DB:", mongoose.connection.name);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid bus ID' });
  }

  try {
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Optional: Add POST endpoint to insert new buses
router.post('/', async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
