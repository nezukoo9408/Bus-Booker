import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

async function fixSpecificBus() {
  try {
    await mongoose.connect('mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0');
    
    const busId = '698d7f7a82b4d772b7060e7f';
    
    // Find the specific bus
    const bus = await Bus.findById(busId);
    
    if (!bus) {
      console.log('❌ Bus not found');
      return;
    }
    
    console.log('🚌 Current Bus Data:');
    console.log(`   ID: ${bus._id}`);
    console.log(`   Bus Name: ${bus.busName}`);
    console.log(`   hasTwoDecks: ${bus.hasTwoDecks}`);
    console.log(`   Total Seats: ${bus.totalSeats}`);
    console.log(`   Lower Seats: ${bus.seatsLower?.length || 0}`);
    console.log(`   Upper Seats: ${bus.seatsUpper?.length || 0}`);
    
    // Fix the bus to have two decks
    if (!bus.hasTwoDecks || bus.seatsUpper?.length === 0) {
      console.log('\n🔧 Fixing bus to have two decks...');
      
      // Generate upper deck seats (copy of lower deck with different prefix and lower price)
      const upperSeats = bus.seatsLower.map(seat => ({
        number: seat.number.replace('L', 'U'), // Replace L with U for upper deck
        type: seat.type,
        status: 'available',
        price: seat.price - 100, // Upper deck cheaper by 100
        isLadies: false,
        deck: 'upper'
      }));
      
      // Update the bus
      await Bus.findByIdAndUpdate(busId, {
        hasTwoDecks: true,
        seatsUpper: upperSeats,
        totalSeats: bus.seatsLower.length + upperSeats.length
      });
      
      console.log('✅ Bus fixed with two decks!');
      console.log(`   New Total Seats: ${bus.seatsLower.length + upperSeats.length}`);
      console.log(`   Upper Deck Seats: ${upperSeats.length}`);
      
      // Verify the fix
      const updatedBus = await Bus.findById(busId);
      console.log('\n🔍 Updated Bus Data:');
      console.log(`   hasTwoDecks: ${updatedBus.hasTwoDecks}`);
      console.log(`   Total Seats: ${updatedBus.totalSeats}`);
      console.log(`   Lower Seats: ${updatedBus.seatsLower?.length || 0}`);
      console.log(`   Upper Seats: ${updatedBus.seatsUpper?.length || 0}`);
      
      if (updatedBus.seatsUpper && updatedBus.seatsUpper.length > 0) {
        console.log(`   Sample Upper Seat: ${updatedBus.seatsUpper[0].number} (₹${updatedBus.seatsUpper[0].price})`);
      }
      
    } else {
      console.log('✅ Bus already has two decks');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixSpecificBus();
