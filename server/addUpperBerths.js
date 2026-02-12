import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// Generate proper upper and lower berth seats
function generateBerthSeats(totalSeats, basePrice, busType) {
  const seats = [];
  const isSleeper = busType.includes('Sleeper');
  
  // For sleeper buses, create proper lower/upper berths
  if (isSleeper && totalSeats >= 20) {
    const lowerBerths = Math.floor(totalSeats * 0.6); // 60% lower berths
    const upperBerths = totalSeats - lowerBerths; // 40% upper berths
    
    // Generate lower berths (more expensive)
    for (let i = 1; i <= lowerBerths; i++) {
      const row = Math.ceil(i / 2);
      const side = i % 2 === 1 ? 'L' : 'R'; // Left/Right
      seats.push({
        number: `L${row}${side}`,
        type: 'sleeper',
        status: 'available',
        price: basePrice + Math.floor(Math.random() * 100), // Higher price for lower
        isLadies: i <= 5, // First 5 are ladies seats
        deck: 'lower'
      });
    }
    
    // Generate upper berths (less expensive)
    for (let i = 1; i <= upperBerths; i++) {
      const row = Math.ceil(i / 2);
      const side = i % 2 === 1 ? 'L' : 'R'; // Left/Right
      seats.push({
        number: `U${row}${side}`,
        type: 'sleeper',
        status: 'available',
        price: basePrice - Math.floor(Math.random() * 100), // Lower price for upper
        isLadies: i <= 3, // First 3 are ladies seats
        deck: 'upper'
      });
    }
  } else {
    // For seater buses, all seats on lower deck
    for (let i = 1; i <= totalSeats; i++) {
      const row = Math.ceil(i / 4);
      const position = i % 4 || 4;
      seats.push({
        number: `${row}${String.fromCharCode(64 + position)}`,
        type: 'seater',
        status: 'available',
        price: basePrice,
        isLadies: i <= 5,
        deck: 'lower'
      });
    }
  }
  
  return seats;
}

async function addUpperBerths() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Update sleeper buses to have proper lower/upper berths
    const sleeperBuses = await Bus.find({ 
      busType: { $in: ['Volvo AC Sleeper', 'Luxury AC Sleeper', 'Business Class'] }
    });

    console.log(`🛌 Found ${sleeperBuses.length} sleeper buses to update...`);

    for (const bus of sleeperBuses) {
      const allSeats = generateBerthSeats(bus.totalSeats, bus.fare, bus.busType);
      const seatsLower = allSeats.filter(seat => seat.deck === 'lower');
      const seatsUpper = allSeats.filter(seat => seat.deck === 'upper');
      
      await Bus.findByIdAndUpdate(bus._id, {
        hasTwoDecks: true,
        seatsLower: seatsLower,
        seatsUpper: seatsUpper
      });
      
      console.log(`✅ Updated ${bus.busName} - ${bus.seatsLower.length} lower, ${bus.seatsUpper.length} upper`);
    }

    // Update some AC Semi-Sleepers to have berths
    const semiSleeperBuses = await Bus.find({ busType: 'AC Semi-Sleeper' }).limit(100);
    
    console.log(`🛏️ Updating ${semiSleeperBuses.length} semi-sleeper buses...`);

    for (const bus of semiSleeperBuses) {
      const allSeats = generateBerthSeats(bus.totalSeats, bus.fare, bus.busType);
      const seatsLower = allSeats.filter(seat => seat.deck === 'lower');
      const seatsUpper = allSeats.filter(seat => seat.deck === 'upper');
      
      await Bus.findByIdAndUpdate(bus._id, {
        hasTwoDecks: true,
        seatsLower: seatsLower,
        seatsUpper: seatsUpper
      });
      
      console.log(`✅ Updated ${bus.busName} - ${bus.seatsLower.length} lower, ${bus.seatsUpper.length} upper`);
    }

    // Show final stats
    const twoDeckCount = await Bus.countDocuments({ hasTwoDecks: true });
    const singleDeckCount = await Bus.countDocuments({ hasTwoDecks: false });
    
    console.log(`\n📊 Final Deck Distribution:`);
    console.log(`  Two Deck Buses: ${twoDeckCount}`);
    console.log(`  Single Deck Buses: ${singleDeckCount}`);

    // Show sample
    const sampleBus = await Bus.findOne({ hasTwoDecks: true });
    if (sampleBus) {
      console.log(`\n📋 Sample Two-Deck Bus:`);
      console.log(`  Bus: ${sampleBus.busName}`);
      console.log(`  Route: ${sampleBus.source} → ${sampleBus.destination}`);
      console.log(`  Lower Berths: ${sampleBus.seatsLower.length} seats`);
      console.log(`  Upper Berths: ${sampleBus.seatsUpper.length} seats`);
      
      const lowerPrice = sampleBus.seatsLower[0]?.price || 0;
      const upperPrice = sampleBus.seatsUpper[0]?.price || 0;
      console.log(`  Price Difference: Lower ₹${lowerPrice} vs Upper ₹${upperPrice}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

addUpperBerths();
