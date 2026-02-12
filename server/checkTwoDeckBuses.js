import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

async function checkTwoDeckBuses() {
  try {
    await mongoose.connect('mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0');
    
    // Find buses with two decks
    const twoDeckBuses = await Bus.find({ hasTwoDecks: true }).limit(3);
    
    console.log(`🔍 Found ${twoDeckBuses.length} two-deck buses:`);
    
    twoDeckBuses.forEach((bus, index) => {
      console.log(`\n${index + 1}. ${bus.busName}`);
      console.log(`   ID: ${bus._id}`);
      console.log(`   Route: ${bus.source} → ${bus.destination}`);
      console.log(`   Date: ${bus.journeyDate}`);
      console.log(`   Has Two Decks: ${bus.hasTwoDecks} (type: ${typeof bus.hasTwoDecks})`);
      console.log(`   Total Seats: ${bus.totalSeats}`);
      console.log(`   Lower Seats: ${bus.seatsLower?.length || 0}`);
      console.log(`   Upper Seats: ${bus.seatsUpper?.length || 0}`);
      
      // Check if upper seats exist
      if (bus.seatsUpper && bus.seatsUpper.length > 0) {
        console.log(`   ✅ Upper deck has seats`);
        console.log(`   Sample Upper: ${bus.seatsUpper[0].number} (₹${bus.seatsUpper[0].price})`);
      } else {
        console.log(`   ❌ Upper deck has no seats`);
      }
    });
    
    if (twoDeckBuses.length > 0) {
      console.log(`\n🎯 Test this bus ID in frontend: ${twoDeckBuses[0]._id}`);
      console.log(`URL: https://bus-booker.onrender.com/bus/${twoDeckBuses[0]._id}/seats?date=${twoDeckBuses[0].journeyDate}`);
      
      // Test API call
      console.log(`\n🌐 Testing API call...`);
      const response = await fetch(`https://busbooker-api.onrender.com/api/buses/${twoDeckBuses[0]._id}?date=${twoDeckBuses[0].journeyDate}`);
      if (response.ok) {
        const busData = await response.json();
        console.log(`✅ API Response:`);
        console.log(`   hasTwoDecks: ${busData.hasTwoDecks}`);
        console.log(`   seatsLower: ${busData.seatsLower?.length || 0}`);
        console.log(`   seatsUpper: ${busData.seatsUpper?.length || 0}`);
      } else {
        console.log(`❌ API call failed: ${response.status}`);
      }
    } else {
      console.log('❌ No two-deck buses found!');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTwoDeckBuses();
