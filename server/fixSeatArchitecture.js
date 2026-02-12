import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// Generate realistic bus seat layout: 5 single + 10 double per deck = 30 seats per deck
function generateRealisticBusSeats(basePrice, busType) {
  const seats = [];
  const isSleeper = busType.includes('Sleeper');
  
  // Generate LOWER DECK seats (30 seats)
  // 5 single seats (1+1 layout for premium/sleeper, 2+2 for seater)
  for (let i = 1; i <= 5; i++) {
    seats.push({
      number: `L${i}A`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + 50, // Single seats cost more
      isLadies: i <= 2, // First 2 single seats are ladies
      deck: 'lower'
    });
  }
  
  // 10 double seats (20 seats total)
  for (let i = 1; i <= 10; i++) {
    // Left seat
    seats.push({
      number: `L${i}B`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice,
      isLadies: i === 1, // First double seat left is ladies
      deck: 'lower'
    });
    
    // Right seat
    seats.push({
      number: `L${i}C`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice,
      isLadies: false,
      deck: 'lower'
    });
  }
  
  // Generate UPPER DECK seats (30 seats) - only for sleeper buses
  const upperSeats = [];
  if (isSleeper) {
    // 5 single seats
    for (let i = 1; i <= 5; i++) {
      upperSeats.push({
        number: `U${i}A`,
        type: 'sleeper',
        status: 'available',
        price: basePrice - 30, // Upper deck cheaper
        isLadies: i <= 2,
        deck: 'upper'
      });
    }
    
    // 10 double seats (20 seats total)
    for (let i = 1; i <= 10; i++) {
      // Left seat
      upperSeats.push({
        number: `U${i}B`,
        type: 'sleeper',
        status: 'available',
        price: basePrice - 50,
        isLadies: i === 1,
        deck: 'upper'
      });
      
      // Right seat
      upperSeats.push({
        number: `U${i}C`,
        type: 'sleeper',
        status: 'available',
        price: basePrice - 50,
        isLadies: false,
        deck: 'upper'
      });
    }
  }
  
  return { lower: seats, upper: upperSeats };
}

async function fixSeatArchitecture() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Update all two-deck buses with proper seat architecture
    const twoDeckBuses = await Bus.find({ hasTwoDecks: true });
    
    console.log(`🔧 Fixing ${twoDeckBuses.length} buses with proper seat architecture...`);

    for (const bus of twoDeckBuses) {
      const { lower, upper } = generateRealisticBusSeats(bus.fare, bus.busType);
      
      await Bus.findByIdAndUpdate(bus._id, {
        seatsLower: lower,
        seatsUpper: upper,
        totalSeats: lower.length + upper.length
      });
      
      console.log(`✅ Updated ${bus.busName}:`);
      console.log(`   Lower: ${lower.length} seats (5 single + 10 double)`);
      console.log(`   Upper: ${upper.length} seats (5 single + 10 double)`);
      console.log(`   Total: ${lower.length + upper.length} seats`);
    }

    // Update single-deck buses to have 30 seats
    const singleDeckBuses = await Bus.find({ hasTwoDecks: false }).limit(100);
    
    console.log(`\n🔧 Updating ${singleDeckBuses.length} single-deck buses to 30 seats...`);

    for (const bus of singleDeckBuses) {
      const { lower } = generateRealisticBusSeats(bus.fare, bus.busType);
      
      await Bus.findByIdAndUpdate(bus._id, {
        seatsLower: lower,
        totalSeats: lower.length
      });
      
      console.log(`✅ Updated ${bus.busName}: ${lower.length} seats`);
    }

    // Show final stats
    const finalStats = await Bus.aggregate([
      { $match: { hasTwoDecks: true } },
      { $limit: 1 },
      { $project: {
        busName: 1,
        busType: 1,
        totalSeats: 1,
        lowerCount: { $size: '$seatsLower' },
        upperCount: { $size: '$seatsUpper' },
        sampleLower: { $slice: ['$seatsLower', 3] },
        sampleUpper: { $slice: ['$seatsUpper', 3] }
      }}
    ]);

    if (finalStats.length > 0) {
      const bus = finalStats[0];
      console.log(`\n📋 Final Bus Architecture:`);
      console.log(`  Bus: ${bus.busName}`);
      console.log(`  Type: ${bus.busType}`);
      console.log(`  Total Seats: ${bus.totalSeats}`);
      console.log(`  Lower Deck: ${bus.lowerCount} seats`);
      console.log(`  Upper Deck: ${bus.upperCount} seats`);
      
      console.log(`\n🪑 Sample Lower Deck Seats:`);
      bus.sampleLower.forEach(seat => {
        console.log(`   ${seat.number}: ₹${seat.price}, Ladies: ${seat.isLadies}`);
      });
      
      console.log(`\n🪑 Sample Upper Deck Seats:`);
      bus.sampleUpper.forEach(seat => {
        console.log(`   ${seat.number}: ₹${seat.price}, Ladies: ${seat.isLadies}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixSeatArchitecture();
