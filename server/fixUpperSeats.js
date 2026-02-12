import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

async function fixUpperSeats() {
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
    
    // Generate upper deck seats if they don't exist
    if (!bus.seatsUpper || bus.seatsUpper.length === 0) {
      console.log('\n🔧 Generating upper deck seats...');
      
      // Generate 15 upper deck seats (5 single + 5 double)
      const upperSeats = [];
      const basePrice = bus.fare || 1000;
      
      // 5 single seats
      for (let i = 1; i <= 5; i++) {
        upperSeats.push({
          number: `U${i}A`,
          type: bus.seatsLower[0]?.type || 'seater',
          status: 'available',
          price: basePrice - 100, // Upper deck cheaper
          isLadies: false,
          deck: 'upper'
        });
      }
      
      // 5 double seats (10 seats total)
      for (let i = 1; i <= 5; i++) {
        // Left seat
        upperSeats.push({
          number: `U${i}B`,
          type: bus.seatsLower[0]?.type || 'seater',
          status: 'available',
          price: basePrice - 150, // Upper deck cheaper
          isLadies: false,
          deck: 'upper'
        });
        
        // Right seat
        upperSeats.push({
          number: `U${i}C`,
          type: bus.seatsLower[0]?.type || 'seater',
          status: 'available',
          price: basePrice - 150, // Upper deck cheaper
          isLadies: false,
          deck: 'upper'
        });
      }
      
      // Update the bus
      await Bus.findByIdAndUpdate(busId, {
        hasTwoDecks: true,
        seatsUpper: upperSeats,
        totalSeats: (bus.seatsLower?.length || 0) + upperSeats.length
      });
      
      console.log('✅ Upper deck seats added!');
      console.log(`   Upper Deck Seats: ${upperSeats.length}`);
      console.log(`   New Total Seats: ${(bus.seatsLower?.length || 0) + upperSeats.length}`);
      
      // Show sample upper seats
      console.log('\n🪑 Sample Upper Seats:');
      upperSeats.slice(0, 5).forEach(seat => {
        console.log(`   ${seat.number}: ₹${seat.price}, Available: ${seat.status}`);
      });
      
    } else {
      console.log('✅ Upper deck seats already exist');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixUpperSeats();
