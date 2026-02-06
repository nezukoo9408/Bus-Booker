import mongoose from 'mongoose';

// Seat schema for individual seats
const seatSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['seater', 'sleeper'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'reserved'],
    default: 'available'
  },
  price: {
    type: Number,
    required: true
  },
  isLadies: {
    type: Boolean,
    default: false
  },
  deck: {
    type: String,
    enum: ['lower', 'upper'],
    required: true
  }
});

// Bus schema
const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  busName: {
    type: String,
    required: true,
    trim: true
  },
  busType: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  journeyDate: {
    type: String,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  seatLayout: {
    type: String,
    required: false,
    enum: ['1+1', '1+2', '2+1', '2+2']
  },
  hasTwoDecks: {
    type: Boolean,
    default: false
  },
  seatsLower: [seatSchema],
  seatsUpper: [seatSchema],
  amenities: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for searching buses by route and date
busSchema.index({ source: 1, destination: 1, journeyDate: 1 });

const Bus = mongoose.model('Bus', busSchema);

export default Bus;