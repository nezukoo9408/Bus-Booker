import mongoose from 'mongoose';

const waitingListSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  journeyDate: {
    type: String,
    required: true
  },
  requestedSeats: {
    type: Number,
    required: true,
    min: 1
  },
  waitingPosition: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'allocated', 'expired', 'cancelled'],
    default: 'waiting'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String
  }
}, {
  timestamps: true
});

// Create compound indexes for searching
waitingListSchema.index({ busId: 1, journeyDate: 1, status: 1 });

const WaitingList = mongoose.model('WaitingList', waitingListSchema);

export default WaitingList;