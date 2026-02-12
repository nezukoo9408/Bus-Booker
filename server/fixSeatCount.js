import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// Generate exactly 30 seats per deck: 15 single + 15 double = 30 seats
function generate30SeatsPerDeck(basePrice, busType, deck) {
  const seats = [];
  const isSleeper = busType.includes('Sleeper');
  const prefix = deck === 'lower' ? 'L' : 'U';
  
  // 15 single seats (1+1 layout)
  for (let i = 1; i <= 15; i++) {
    seats.push({
      number: `${prefix}${i}A`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + (deck === 'lower' ? 50 : 20), // Lower deck costs more
      isLadies: i <= 5, // First 5 single seats are ladies
      deck: deck
    });
  }
  
  // 15 double seats (30 seats total) - Left and Right
  for (let i = 1; i <= 15; i++) {
    // Left seat
    seats.push({
      number: `${prefix}${i}B`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + (deck === 'lower' ? 0 : -30), // Lower deck costs more
      isLadies: i <= 3, // First 3 double seats left are ladies
      deck: deck
    });
    
    // Right seat
    seats.push({
      number: `${prefix}${i}C`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + (deck === 'lower' ? 0 : -30), // Lower deck costs more
      isLadies: false,
      deck: deck
    });
  }
  
  return seats; // Total: 15 single + 30 double = 45 seats per deck
}

// Alternative: 5 single + 10 double = 25 seats (what you originally wanted)
function generate25SeatsPerDeck(basePrice, busType, deck) {
  const seats = [];
  const isSleeper = busType.includes('Sleeper');
  const prefix = deck === 'lower' ? 'L' : 'U';
  
  // 5 single seats
  for (let i = 1; i <= 5; i++) {
    seats.push({
      number: `${prefix}${i}A`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + (deck === 'lower' ? 50 : 20),
      isLadies: i <= 2,
      deck: deck
    });
  }
  
  // 10 double seats (20 seats total)
  for (let i = 1; i <= 10; i++) {
    // Left seat
    seats.push({
      number: `${prefix}${i}B`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + (deck === 'lower' ? 0 : -30),
      isLadies: i === 1,
      deck: deck
    });
    
    // Right seat
    seats.push({
      number: `${prefix}${i}C`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + (deck === 'lower' ? 0 : -30),
      isLadies: false,
      deck: deck
    });
  }
  
  return seats; // Total: 5 single + 20 double = 25 seats per deck
}

async function fixSeatCount() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Update all two-deck buses with exactly 25 seats per deck
    const twoDeckBuses = await Bus.find({ hasTwoDecks: true });
    
    console.log(`🔧 Fixing ${twoDeckBuses.length} buses with exactly 25 seats per deck...`);

    for (const bus of twoDeckBuses) {
      const lower = generate25SeatsPerDeck(bus.fare, bus.busType, 'lower');
      const upper = generate25SeatsPerDeck(bus.fare, bus.busType, 'upper');
      
      await Bus.findByIdAndUpdate(bus._id, {
        seatsLower: lower,
        seatsUpper: upper,
        totalSeats: lower.length + upper.length
      });
      
      console.log(`✅ Updated ${bus.busName}:`);
      console.log(`   Lower: ${lower.length} seats (5 single + 10 double = 25)`);
      console.log(`   Upper: ${upper.length} seats (5 single + 10 double = 25)`);
      console.log(`   Total: ${lower.length + upper.length} seats`);
    }

    // Update single-deck buses to have 25 seats
    const singleDeckBuses = await Bus.find({ hasTwoDecks: false }).limit(50);
    
    console.log(`\n🔧 Updating ${singleDeckBuses.length} single-deck buses to 25 seats...`);

    for (const bus of singleDeckBuses) {
      const lower = generate25SeatsPerDeck(bus.fare, bus.busType, 'lower');
      
      await Bus.findByIdAndUpdate(bus._id, {
        seatsLower: lower,
        totalSeats: lower.length
      });
      
      console.log(`✅ Updated ${bus.busName}: ${lower.length} seats`);
    }

    // Show final stats
    const sampleBus = await Bus.findOne({ hasTwoDecks: true });
    if (sampleBus) {
      console.log(`\n📋 Final Correct Architecture:`);
      console.log(`  Bus: ${sampleBus.busName}`);
      console.log(`  Type: ${sampleBus.busType}`);
      console.log(`  Total Seats: ${sampleBus.totalSeats}`);
      console.log(`  Lower Deck: ${sampleBus.seatsLower.length} seats`);
      console.log(`  Upper Deck: ${sampleBus.seatsUpper.length} seats`);
      
      console.log(`\n🪑 Lower Deck Breakdown:`);
      const singleSeats = sampleBus.seatsLower.filter(s => s.number.includes('A'));
      const doubleSeats = sampleBus.seatsLower.filter(s => s.number.includes('B') || s.number.includes('C'));
      console.log(`   Single seats: ${singleSeats.length}`);
      console.log(`   Double seats: ${doubleSeats.length}`);
      console.log(`   Total: ${singleSeats.length + doubleSeats.length}`);
      
      console.log(`\n💰 Price Comparison:`);
      const lowerSingle = sampleBus.seatsLower.find(s => s.number.includes('A'));
      const lowerDouble = sampleBus.seatsLower.find(s => s.number.includes('B'));
      const upperSingle = sampleBus.seatsUpper.find(s => s.number.includes('A'));
      const upperDouble = sampleBus.seatsUpper.find(s => s.number.includes('B'));
      
      console.log(`   Lower Single: ₹${lowerSingle?.price}`);
      console.log(`   Lower Double: ₹${lowerDouble?.price}`);
      console.log(`   Upper Single: ₹${upperSingle?.price}`);
      console.log(`   Upper Double: ₹${upperDouble?.price}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixSeatCount();
