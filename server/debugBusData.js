import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

async function debugBusData() {
  try {
    await mongoose.connect('mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0');
    
    // Get a sample bus
    const sampleBus = await Bus.findOne({}).limit(1);
    
    if (sampleBus) {
      console.log('🚌 Sample Bus Data Structure:');
      console.log('ID:', sampleBus._id);
      console.log('Bus Name:', sampleBus.busName);
      console.log('Has Two Decks:', sampleBus.hasTwoDecks);
      console.log('Total Seats:', sampleBus.totalSeats);
      console.log('Seats Lower Count:', sampleBus.seatsLower?.length || 0);
      console.log('Seats Upper Count:', sampleBus.seatsUpper?.length || 0);
      
      console.log('\n🪑 Sample Lower Seats:');
      if (sampleBus.seatsLower && sampleBus.seatsLower.length > 0) {
        sampleBus.seatsLower.slice(0, 3).forEach(seat => {
          console.log(`  ${seat.number}: ${seat.status}, ₹${seat.price}, Ladies: ${seat.isLadies}, Deck: ${seat.deck}`);
        });
      } else {
        console.log('  No lower seats found!');
      }
      
      console.log('\n🪑 Sample Upper Seats:');
      if (sampleBus.seatsUpper && sampleBus.seatsUpper.length > 0) {
        sampleBus.seatsUpper.slice(0, 3).forEach(seat => {
          console.log(`  ${seat.number}: ${seat.status}, ₹${seat.price}, Ladies: ${seat.isLadies}, Deck: ${seat.deck}`);
        });
      } else {
        console.log('  No upper seats found!');
      }
      
      // Check if the bus has proper structure for frontend
      console.log('\n🔍 Frontend Compatibility Check:');
      console.log('✅ Has _id:', !!sampleBus._id);
      console.log('✅ Has busName:', !!sampleBus.busName);
      console.log('✅ Has hasTwoDecks:', !!sampleBus.hasTwoDecks !== undefined);
      console.log('✅ Has seatsLower array:', Array.isArray(sampleBus.seatsLower));
      console.log('✅ Has seatsUpper array:', Array.isArray(sampleBus.seatsUpper));
      console.log('✅ Seats have number field:', sampleBus.seatsLower?.[0]?.number !== undefined);
      console.log('✅ Seats have status field:', sampleBus.seatsLower?.[0]?.status !== undefined);
      console.log('✅ Seats have price field:', sampleBus.seatsLower?.[0]?.price !== undefined);
      
    } else {
      console.log('❌ No buses found in database!');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugBusData();
