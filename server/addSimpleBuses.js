import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// Karnataka cities
const karnatakaCities = [
  'Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore', 'Udupi', 'Shimoga',
  'Davanagere', 'Gulbarga', 'Bellary', 'Hospet', 'Chikmagalur', 'Hassan',
  'Tumkur', 'Raichur', 'Bijapur', 'Karwar', 'Bidar', 'Mandya', 'Kolar'
];

// Bus companies
const busCompanies = [
  'Sugama', 'Seabird', 'Shreekumar', 'VRL', 'Anand Travels',
  'Limousine Tours and Travels', 'Greenline', 'SRS Travels', 'Intercity'
];

// Simple bus types with minimal pricing
const busTypes = [
  { type: 'Non-AC Seater', layout: '2+2', decks: false, baseFare: 200, seats: 40 },
  { type: 'AC Seater', layout: '2+2', decks: false, baseFare: 300, seats: 40 },
  { type: 'Sleeper', layout: '1+2', decks: true, baseFare: 350, seats: 30 },
  { type: 'Semi-Sleeper', layout: '2+1', decks: false, baseFare: 250, seats: 30 }
];

// Generate simple seats
function generateSeats(layout, totalSeats, deck) {
  const seats = [];
  const seatType = layout.includes('1+1') || layout.includes('1+2') ? 'sleeper' : 'seater';
  const basePrice = deck === 'lower' ? 200 : 250;
  
  for (let i = 1; i <= totalSeats; i++) {
    const row = Math.ceil(i / (layout === '1+1' ? 2 : layout === '1+2' ? 3 : 4));
    const position = i % (layout === '1+1' ? 2 : layout === '1+2' ? 3 : 4);
    const seatNumber = `${row}${String.fromCharCode(65 + position)}`;
    
    seats.push({
      number: seatNumber,
      type: seatType,
      status: 'available',
      price: basePrice,
      isLadies: i <= 2,
      deck: deck
    });
  }
  
  return seats;
}

// Generate journey dates for next 30 days
function generateJourneyDates() {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
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
    { departure: '08:00', arrival: '11:00' },
    { departure: '10:00', arrival: '13:00' },
    { departure: '12:00', arrival: '15:00' },
    { departure: '14:00', arrival: '17:00' },
    { departure: '16:00', arrival: '19:00' },
    { departure: '18:00', arrival: '21:00' },
    { departure: '20:00', arrival: '23:00' },
    { departure: '22:00', arrival: '01:00' },
    { departure: '23:30', arrival: '02:30' }
  ];
  
  return times[Math.floor(Math.random() * times.length)];
}

async function addSimpleBuses() {
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
    let totalRoutes = 0;

    console.log('🚌 Adding 15 buses for each route...');

    // Generate all possible routes between cities
    for (let i = 0; i < karnatakaCities.length; i++) {
      for (let j = 0; j < karnatakaCities.length; j++) {
        if (i !== j) { // Skip same city
          const source = karnatakaCities[i];
          const destination = karnatakaCities[j];
          totalRoutes++;
          
          console.log(`📍 Processing route: ${source} to ${destination}`);
          
          for (const date of journeyDates) {
            // Add exactly 15 buses for each route and date
            for (let busIndex = 0; busIndex < 15; busIndex++) {
              const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
              const company = busCompanies[Math.floor(Math.random() * busCompanies.length)];
              const times = generateTimes();
              
              // Minimal fare calculation
              const fare = busType.baseFare + Math.floor(Math.random() * 100);
              
              // Generate unique bus number
              const routeIndex = i * 100 + j;
              const busNumber = `${source.substring(0, 3).toUpperCase()}-${destination.substring(0, 3).toUpperCase()}-${date.replace(/-/g, '')}-${routeIndex}-${String(busIndex + 1).padStart(3, '0')}`;
              
              // Generate seats
              const seatsLower = generateSeats(busType.layout, busType.hasTwoDecks ? busType.seats / 2 : busType.seats, 'lower');
              const seatsUpper = busType.hasTwoDecks ? generateSeats(busType.layout, busType.seats / 2, 'upper') : [];

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
                hasTwoDecks: busType.hasTwoDecks,
                seatsLower: seatsLower,
                seatsUpper: seatsUpper,
                amenities: ['Air Conditioning', 'Emergency Exit'] // Minimal amenities
              });

              await bus.save();
              totalBusesAdded++;
            }
          }
        }
      }
    }

    console.log(`🎉 Successfully added ${totalBusesAdded} buses to the database!`);
    console.log(`📍 Total routes covered: ${totalRoutes}`);
    console.log(`📅 Days covered: ${journeyDates.length} days`);
    console.log(`🚌 Buses per route per day: 15`);
    console.log(`💰 Price range: ₹200-₹450`);
    
    // Show summary
    const busCount = await Bus.countDocuments();
    console.log(`📊 Total buses in database: ${busCount}`);
    
    // Show sample buses
    const sampleBuses = await Bus.find({}).limit(5);
    console.log('\n📋 Sample buses:');
    sampleBuses.forEach((bus, index) => {
      console.log(`  ${index + 1}. ${bus.busNumber} - ${bus.source} to ${bus.destination} on ${bus.journeyDate}`);
      console.log(`     ${bus.busName}, Fare: ₹${bus.fare}, Seats: ${bus.totalSeats}`);
    });

    // Show route coverage
    const uniqueRoutes = await Bus.distinct('source');
    console.log(`\n🌍 Cities covered: ${uniqueRoutes.length} cities`);
    console.log(`Cities: ${uniqueRoutes.join(', ')}`);

  } catch (error) {
    console.error('❌ Error adding buses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

addSimpleBuses();
