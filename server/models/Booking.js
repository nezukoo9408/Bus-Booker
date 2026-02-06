import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: () => new mongoose.Types.ObjectId(), // 🔧 Always generate new user ID
  required: false
},
bookingId: {
  type: String,
  unique: true,
  default: () => 'B' + Math.floor(100000 + Math.random() * 900000)  // e.g., B123456
},

  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
 seats: [{
  id: String,
  number: String,
  price: Number,
  deck: {
    type: String,
    enum: ['lower', 'upper'],
    required: true
  },
  isLadies: {
    type: Boolean,
    default: false
  }
}],

  totalFare: {
    type: Number,
    required: true
  },
  journeyDate: {
    type: String,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  paymentInfo: {
    paymentId: String,
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    }
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String
  }
}, {
  timestamps: true
});

// Create compound indexes for searching bookings by userId and status, or busId and journeyDate
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ busId: 1, journeyDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
