import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// Generate exactly 15 seats per deck: 5 single + 5 double = 15 seats
function generate15SeatsPerDeck(basePrice, busType, deck) {
  const seats = [];
  const isSleeper = busType.includes('Sleeper');
  const prefix = deck === 'lower' ? 'L' : 'U';
  
  // 5 single seats (1+1 layout)
  for (let i = 1; i <= 5; i++) {
    seats.push({
      number: `${prefix}${i}A`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + (deck === 'lower' ? 100 : 0), // Lower deck costs more
      isLadies: false, // No default ladies seats
      deck: deck
    });
  }
  
  // 5 double seats (10 seats total) - Left and Right
  for (let i = 1; i <= 5; i++) {
    // Left seat
    seats.push({
      number: `${prefix}${i}B`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + (deck === 'lower' ? 50 : -50), // Lower deck costs more
      isLadies: false, // No default ladies seats
      deck: deck
    });
    
    // Right seat
    seats.push({
      number: `${prefix}${i}C`,
      type: isSleeper ? 'sleeper' : 'seater',
      status: 'available',
      price: basePrice + (deck === 'lower' ? 50 : -50), // Lower deck costs more
      isLadies: false, // No default ladies seats
      deck: deck
    });
  }
  
  return seats; // Total: 5 single + 10 double = 15 seats per deck
}

async function fixSeatsTo15() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Update all two-deck buses with exactly 15 seats per deck
    const twoDeckBuses = await Bus.find({ hasTwoDecks: true });
    
    console.log(`🔧 Fixing ${twoDeckBuses.length} buses with exactly 15 seats per deck...`);

    for (const bus of twoDeckBuses) {
      const lower = generate15SeatsPerDeck(bus.fare, bus.busType, 'lower');
      const upper = generate15SeatsPerDeck(bus.fare, bus.busType, 'upper');
      
      await Bus.findByIdAndUpdate(bus._id, {
        seatsLower: lower,
        seatsUpper: upper,
        totalSeats: lower.length + upper.length
      });
      
      console.log(`✅ Updated ${bus.busName}:`);
      console.log(`   Lower: ${lower.length} seats (5 single + 5 double = 15)`);
      console.log(`   Upper: ${upper.length} seats (5 single + 5 double = 15)`);
      console.log(`   Total: ${lower.length + upper.length} seats`);
      
      // Show price difference
      const lowerSingle = lower.find(s => s.number.includes('A'));
      const upperSingle = upper.find(s => s.number.includes('A'));
      console.log(`   Price: Lower ₹${lowerSingle?.price} vs Upper ₹${upperSingle?.price}`);
    }

    // Update single-deck buses to have 15 seats
    const singleDeckBuses = await Bus.find({ hasTwoDecks: false }).limit(50);
    
    console.log(`\n🔧 Updating ${singleDeckBuses.length} single-deck buses to 15 seats...`);

    for (const bus of singleDeckBuses) {
      const lower = generate15SeatsPerDeck(bus.fare, bus.busType, 'lower');
      
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
      console.log(`   Difference: Lower costs ₹${lowerSingle?.price - upperSingle?.price} more`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixSeatsTo15();
