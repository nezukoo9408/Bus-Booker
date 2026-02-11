import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// Major Karnataka cities (reduced to save space)
const karnatakaCities = [
  'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Shimoga'
];

// Bus companies
const busCompanies = ['VRL', 'SRS', 'Sugama', 'Seabird'];

// Minimal bus types
const busTypes = [
  { type: 'Non-AC Seater', layout: '2+2', decks: false, baseFare: 200, seats: 40 },
  { type: 'AC Seater', layout: '2+2', decks: false, baseFare: 300, seats: 40 }
];

// Generate minimal seats
function generateSeats(layout, totalSeats, deck) {
  const seats = [];
  const basePrice = deck === 'lower' ? 200 : 250;
  
  for (let i = 1; i <= totalSeats; i++) {
    const row = Math.ceil(i / 4);
    const position = i % 4;
    const seatNumber = `${row}${String.fromCharCode(65 + position)}`;
    
    seats.push({
      number: seatNumber,
      type: 'seater',
      status: 'available',
      price: basePrice,
      isLadies: i <= 2,
      deck: deck
    });
  }
  
  return seats;
}

// Generate journey dates for next 15 days (reduced from 30)
function generateJourneyDates() {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

// Generate simple times
function generateTimes() {
  const times = [
    { departure: '06:00', arrival: '09:00' },
    { departure: '12:00', arrival: '15:00' },
    { departure: '18:00', arrival: '21:00' }
  ];
  
  return times[Math.floor(Math.random() * times.length)];
}

async function addMinimalBuses() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing buses
    console.log('🗑️ Clearing existing buses...');
    await Bus.deleteMany({});
    console.log('✅ Cleared existing buses');

    const journeyDates = generateJourneyDates();
    let totalBusesAdded = 0;

    console.log('🚌 Adding minimal buses for major routes...');

    // Generate routes between major cities
    for (let i = 0; i < karnatakaCities.length; i++) {
      for (let j = 0; j < karnatakaCities.length; j++) {
        if (i !== j) {
          const source = karnatakaCities[i];
          const destination = karnatakaCities[j];
          
          console.log(`📍 Processing route: ${source} to ${destination}`);
          
          for (const date of journeyDates) {
            // Add only 5 buses per route per day (reduced from 15)
            for (let busIndex = 0; busIndex < 5; busIndex++) {
              const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
              const company = busCompanies[Math.floor(Math.random() * busCompanies.length)];
              const times = generateTimes();
              
              const fare = busType.baseFare;
              const routeIndex = i * 10 + j;
              const busNumber = `${source.substring(0, 3).toUpperCase()}-${destination.substring(0, 3).toUpperCase()}-${date.replace(/-/g, '')}-${String(busIndex + 1).padStart(2, '0')}`;
              
              // Generate minimal seats
              const seatsLower = generateSeats(busType.layout, busType.seats, 'lower');

              const bus = new Bus({
                busNumber: busNumber,
                busName: `${company} - ${busType.type}`,
                busType: busType.type,
                source: source,
                destination: destination,
                departureTime: times.departure,
                arrivalTime: times.arrival,
                journeyDate: date,
                fare: fare,
                totalSeats: busType.seats,
                seatLayout: busType.layout,
                hasTwoDecks: false,
                seatsLower: seatsLower,
                seatsUpper: [],
                amenities: ['Air Conditioning'] // Minimal amenities
              });

              await bus.save();
              totalBusesAdded++;
            }
          }
        }
      }
    }

    console.log(`🎉 Successfully added ${totalBusesAdded} buses to the database!`);
    console.log(`📍 Cities covered: ${karnatakaCities.length} major cities`);
    console.log(`📅 Days covered: ${journeyDates.length} days`);
    console.log(`🚌 Buses per route per day: 5`);
    console.log(`💰 Price range: ₹200-₹300`);
    
    // Show summary
    const busCount = await Bus.countDocuments();
    console.log(`📊 Total buses in database: ${busCount}`);
    
    // Show sample buses
    const sampleBuses = await Bus.find({}).limit(3);
    console.log('\n📋 Sample buses:');
    sampleBuses.forEach((bus, index) => {
      console.log(`  ${index + 1}. ${bus.busNumber} - ${bus.source} to ${bus.destination} on ${bus.journeyDate}`);
      console.log(`     ${bus.busName}, Fare: ₹${bus.fare}, Seats: ${bus.totalSeats}`);
    });

  } catch (error) {
    console.error('❌ Error adding buses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

addMinimalBuses();
