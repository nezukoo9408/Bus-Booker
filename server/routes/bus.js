// routes/bus.js
const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const { authenticateUser } = require('../middleware/auth');

router.post('/:busId/waitlist', authenticateUser, async (req, res) => {
  try {
    const { busId } = req.params;
    const { seatType } = req.body;
    const userId = req.user.id;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Check if user is already on the waiting list
    const alreadyInWaitlist = bus.waitingList.some(
      (entry) => entry.userId.toString() === userId
    );
    if (alreadyInWaitlist) {
      return res.status(400).json({ message: 'Already in waiting list' });
    }

    bus.waitingList.push({ userId, seatType });
    await bus.save();

    res.status(200).json({ message: 'Added to waiting list' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
