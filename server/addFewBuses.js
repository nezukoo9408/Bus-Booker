import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// Just 4 major cities to save space
const cities = ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'];

// Generate minimal seats (only 10 seats per bus to save space)
function generateMinimalSeats() {
  const seats = [];
  for (let i = 1; i <= 10; i++) {
    seats.push({
      number: `S${i}`,
      type: 'seater',
      status: 'available',
      price: 200,
      isLadies: i <= 1,
      deck: 'lower'
    });
  }
  return seats;
}

// Generate just 7 days
function generateJourneyDates() {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

async function addFewBuses() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing buses and users to save space
    console.log('🗑️ Clearing existing data...');
    await Bus.deleteMany({});
    console.log('✅ Cleared existing buses');

    const journeyDates = generateJourneyDates();
    let totalBusesAdded = 0;

    console.log('🚌 Adding minimal buses...');

    // Add 7 buses per route per day
    for (let i = 0; i < cities.length; i++) {
      for (let j = 0; j < cities.length; j++) {
        if (i !== j) {
          const source = cities[i];
          const destination = cities[j];
          
          console.log(`📍 Processing route: ${source} to ${destination}`);
          
          for (const date of journeyDates) {
            for (let busIndex = 0; busIndex < 7; busIndex++) {
              const busNumber = `${source.substring(0, 3).toUpperCase()}-${destination.substring(0, 3).toUpperCase()}-${date.replace(/-/g, '')}-${String(busIndex + 1).padStart(2, '0')}`;
              
              const bus = new Bus({
                busNumber: busNumber,
                busName: `VRL - Non-AC Seater`,
                busType: 'Non-AC Seater',
                source: source,
                destination: destination,
                departureTime: '06:00',
                arrivalTime: '09:00',
                journeyDate: date,
                fare: 200,
                totalSeats: 10,
                seatLayout: '2+2',
                hasTwoDecks: false,
                seatsLower: generateMinimalSeats(),
                seatsUpper: [],
                amenities: ['Air Conditioning']
              });

              await bus.save();
              totalBusesAdded++;
            }
          }
        }
      }
    }

    console.log(`🎉 Successfully added ${totalBusesAdded} buses to the database!`);
    console.log(`📍 Cities covered: ${cities.join(', ')}`);
    console.log(`📅 Days covered: ${journeyDates.length} days`);
    console.log(`🚌 Buses per route per day: 7`);
    console.log(`💰 Price: ₹200 per seat`);
    
    const busCount = await Bus.countDocuments();
    console.log(`📊 Total buses in database: ${busCount}`);

  } catch (error) {
    console.error('❌ Error adding buses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

addFewBuses();
