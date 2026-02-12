import mongoose from 'mongoose';
import Bus from './models/Bus.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkSeats() {
  try {
    await mongoose.connect('mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0');
    
    // Find a bus with two decks
    const sampleBus = await Bus.findOne({ hasTwoDecks: true });
    
    if (sampleBus) {
      console.log('🚌 Sample Bus with Lower/Upper Berths:');
      console.log('Bus:', sampleBus.busName);
      console.log('Route:', sampleBus.source, '→', sampleBus.destination);
      console.log('Has Two Decks:', sampleBus.hasTwoDecks);
      console.log('Total Seats:', sampleBus.totalSeats);
      console.log('Lower Deck Seats:', sampleBus.seatsLower.length);
      console.log('Upper Deck Seats:', sampleBus.seatsUpper.length);
      console.log('');
      
      console.log('📋 Lower Deck Sample Seats:');
      sampleBus.seatsLower.slice(0, 5).forEach(seat => {
        console.log(`  Seat ${seat.number}: ₹${seat.price}, Ladies: ${seat.isLadies}, Deck: ${seat.deck}`);
      });
      console.log('');
      
      console.log('📋 Upper Deck Sample Seats:');
      sampleBus.seatsUpper.slice(0, 5).forEach(seat => {
        console.log(`  Seat ${seat.number}: ₹${seat.price}, Ladies: ${seat.isLadies}, Deck: ${seat.deck}`);
      });
      
      console.log('');
      console.log('💰 Price Comparison:');
      const lowerAvg = sampleBus.seatsLower.reduce((sum, seat) => sum + seat.price, 0) / sampleBus.seatsLower.length;
      const upperAvg = sampleBus.seatsUpper.reduce((sum, seat) => sum + seat.price, 0) / sampleBus.seatsUpper.length;
      console.log(`Lower Deck Average: ₹${Math.round(lowerAvg)}`);
      console.log(`Upper Deck Average: ₹${Math.round(upperAvg)}`);
      console.log(`Lower deck is ₹${Math.round(lowerAvg - upperAvg)} more expensive`);
      
    } else {
      console.log('No bus with two decks found');
      
      // Show a single deck bus for comparison
      const singleDeckBus = await Bus.findOne({ hasTwoDecks: false });
      if (singleDeckBus) {
        console.log('🚌 Sample Single Deck Bus:');
        console.log('Bus:', singleDeckBus.busName);
        console.log('Route:', singleDeckBus.source, '→', singleDeckBus.destination);
        console.log('Has Two Decks:', singleDeckBus.hasTwoDecks);
        console.log('Total Seats:', singleDeckBus.totalSeats);
        console.log('Lower Deck Seats:', singleDeckBus.seatsLower.length);
        console.log('Upper Deck Seats:', singleDeckBus.seatsUpper.length);
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSeats();
