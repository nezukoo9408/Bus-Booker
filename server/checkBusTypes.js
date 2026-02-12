import mongoose from 'mongoose';
import Bus from './models/Bus.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkBusTypes() {
  try {
    await mongoose.connect('mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0');
    
    const busTypes = await Bus.distinct('busType');
    console.log('🚌 Bus Types in Database:');
    busTypes.forEach((type, i) => console.log(`  ${i+1}. ${type}`));
    
    const twoDeckBuses = await Bus.countDocuments({ hasTwoDecks: true });
    const singleDeckBuses = await Bus.countDocuments({ hasTwoDecks: false });
    console.log(`\n📊 Deck Distribution:`);
    console.log(`  Two Deck Buses: ${twoDeckBuses}`);
    console.log(`  Single Deck Buses: ${singleDeckBuses}`);
    
    // Find a sleeper bus (should have two decks)
    const sleeperBus = await Bus.findOne({ busType: { $regex: /Sleeper/i } });
    if (sleeperBus) {
      console.log(`\n🛌 Sample Sleeper Bus:`);
      console.log(`  Bus: ${sleeperBus.busName}`);
      console.log(`  Type: ${sleeperBus.busType}`);
      console.log(`  Has Two Decks: ${sleeperBus.hasTwoDecks}`);
      console.log(`  Lower Deck: ${sleeperBus.seatsLower.length} seats`);
      console.log(`  Upper Deck: ${sleeperBus.seatsUpper.length} seats`);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBusTypes();
