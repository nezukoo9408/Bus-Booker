import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

async function findTwoDeckBuses() {
  try {
    await mongoose.connect('mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0');
    
    // Find buses with two decks
    const twoDeckBuses = await Bus.find({ hasTwoDecks: true }).limit(5);
    
    console.log(`🔍 Found ${twoDeckBuses.length} two-deck buses:`);
    
    twoDeckBuses.forEach((bus, index) => {
      console.log(`\n${index + 1}. ${bus.busName}`);
      console.log(`   ID: ${bus._id}`);
      console.log(`   Route: ${bus.source} → ${bus.destination}`);
      console.log(`   Date: ${bus.journeyDate}`);
      console.log(`   Has Two Decks: ${bus.hasTwoDecks}`);
      console.log(`   Lower Seats: ${bus.seatsLower?.length || 0}`);
      console.log(`   Upper Seats: ${bus.seatsUpper?.length || 0}`);
      console.log(`   Total Seats: ${bus.totalSeats}`);
      
      if (bus.seatsLower && bus.seatsLower.length > 0) {
        console.log(`   Sample Lower: ${bus.seatsLower[0].number} (₹${bus.seatsLower[0].price})`);
      }
      if (bus.seatsUpper && bus.seatsUpper.length > 0) {
        console.log(`   Sample Upper: ${bus.seatsUpper[0].number} (₹${bus.seatsUpper[0].price})`);
      }
    });
    
    if (twoDeckBuses.length > 0) {
      console.log(`\n🎯 Test this bus ID in frontend: ${twoDeckBuses[0]._id}`);
      console.log(`URL: https://bus-booker.onrender.com/bus/${twoDeckBuses[0]._id}/seats?date=${twoDeckBuses[0].journeyDate}`);
    } else {
      console.log('❌ No two-deck buses found!');
      
      // Find some sleeper buses that should have two decks
      const sleeperBuses = await Bus.find({ 
        busType: { $regex: /Sleeper/i } 
      }).limit(3);
      
      console.log(`\n🛌 Found ${sleeperBuses.length} sleeper buses (should have two decks):`);
      sleeperBuses.forEach((bus, index) => {
        console.log(`${index + 1}. ${bus.busName} - hasTwoDecks: ${bus.hasTwoDecks}`);
      });
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

findTwoDeckBuses();
