import express from 'express';
import Booking from '../models/Booking.js';
import Bus from '../models/Bus.js';

const router = express.Router();

// POST: Create a new booking
router.post('/', async (req, res) => {
  try {
    const { userId, busId, seats, totalFare, journeyDate, contactInfo } = req.body;

    // Log the received data
    console.log('📩 Booking request received:', req.body);

    // Validate required fields with detailed error
    const missingFields = [];
    if (!busId) missingFields.push('busId');
    if (!seats || !Array.isArray(seats) || seats.length === 0) missingFields.push('seats');
    if (!totalFare && totalFare !== 0) missingFields.push('totalFare');
    if (!journeyDate) missingFields.push('journeyDate');
    if (!contactInfo || !contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      missingFields.push('contactInfo (name/email/phone)');
    }

    if (missingFields.length > 0) {
      console.warn('⚠ Missing or invalid fields:', missingFields);
      return res.status(400).json({ error: `Missing or invalid fields: ${missingFields.join(', ')}` });
    }

    // Ensure that each seat has the isLadies flag (if missing, set to false)
    const updatedSeats = seats.map(seat => ({
      ...seat,
      isLadies: seat.isLadies || false // Add isLadies if not provided
    }));

    // Create the booking with updated seats
    const booking = new Booking({
      userId,
      busId,
      seats: updatedSeats,
      totalFare,
      journeyDate,
      contactInfo,
    });

    await booking.save();

    // Optional: Update seat status in Bus
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    // Update seat status in bus (lower or upper deck)
    updatedSeats.forEach(seat => {
      const seatList = seat.deck === 'lower' ? bus.seatsLower : bus.seatsUpper;
      const seatIndex = seatList.findIndex(s => s.number === seat.number);
      if (seatIndex !== -1) {
        seatList[seatIndex].status = 'booked';
      } else {
        console.warn(`Seat ${seat.number} not found in ${seat.deck} deck.`);
      }
    });

    await bus.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    console.error('❌ Booking Save Error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET: Fetch all bookings with full bus details
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('busId') // populate bus reference
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:bookingId', async (req, res) => {
  try {
    // Find the booking by its bookingId
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Optionally, update the bus seats to mark them as available
    const bus = await Bus.findById(booking.busId);
    if (bus) {
      booking.seats.forEach(seat => {
        const seatList = seat.deck === 'lower' ? bus.seatsLower : bus.seatsUpper;
        const seatIndex = seatList.findIndex(s => s.number === seat.number);
        if (seatIndex !== -1) seatList[seatIndex].status = 'available';
      });
      await bus.save();
    }

    // Delete the booking
    await Booking.deleteOne({ bookingId: req.params.bookingId });

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error("Deletion Error:", err);
    res.status(500).json({ error: err.message });
  }
});
export default router;
