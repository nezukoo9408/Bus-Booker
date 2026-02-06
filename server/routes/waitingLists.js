import express from 'express';
import WaitingList from '../models/WaitingList.js'; // Adjust path if needed

const router = express.Router();

// Add a user to the waiting list
router.post('/', async (req, res) => {
  try {
    const waitingEntry = new WaitingList(req.body);
    const savedEntry = await waitingEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all waiting list entries (optionally filtered by busId or journeyDate)
router.get('/', async (req, res) => {
  const { busId, journeyDate, status } = req.query;
  const query = {};
  if (busId) query.busId = busId;
  if (journeyDate) query.journeyDate = journeyDate;
  if (status) query.status = status;

  try {
    const entries = await WaitingList.find(query).populate('userId', 'name email').populate('busId');
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single waiting list entry by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await WaitingList.findById(req.params.id).populate('userId').populate('busId');
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a waiting list entry (e.g., change status)
router.put('/:id', async (req, res) => {
  try {
    const updatedEntry = await WaitingList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) return res.status(404).json({ error: 'Entry not found' });
    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a waiting list entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await WaitingList.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
