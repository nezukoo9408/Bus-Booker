import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// Define routes (up and down)
const routes = [
  { source: 'Bangalore', destination: 'Mysore' },
  { source: 'Mysore', destination: 'Bangalore' },
  { source: 'Bangalore', destination: 'Chennai' },
  { source: 'Chennai', destination: 'Bangalore' },
  { source: 'Bangalore', destination: 'Hyderabad' },
  { source: 'Hyderabad', destination: 'Bangalore' },
  { source: 'Bangalore', destination: 'Mumbai' },
  { source: 'Mumbai', destination: 'Bangalore' },
  { source: 'Chennai', destination: 'Hyderabad' },
  { source: 'Hyderabad', destination: 'Chennai' },
  { source: 'Delhi', destination: 'Mumbai' },
  { source: 'Mumbai', destination: 'Delhi' }
];

// Bus types and configurations
const busTypes = [
  { type: 'Volvo AC Sleeper', layout: '1+1', decks: true, baseFare: 800 },
  { type: 'Volvo AC Semi-Sleeper', layout: '2+1', decks: false, baseFare: 600 },
  { type: 'AC Seater Pushback', layout: '2+2', decks: false, baseFare: 400 },
  { type: 'Non-AC Seater', layout: '2+2', decks: false, baseFare: 300 },
  { type: 'AC Sleeper', layout: '1+2', decks: true, baseFare: 700 }
];

// Bus operators
const operators = [
  'VRL Travels',
  'SRS Travels',
  'KPN Travels',
  'Orange Travels',
  'SRM Travels'
];

// Amenities
const allAmenities = [
  'WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 
  'Snacks', 'TV', 'Reading Light', 'Pillow', 
  'Emergency Exit', 'CCTV', 'GPS Tracking'
];

// Generate seats for bus
function generateSeats(layout, totalSeats, basePrice, deck) {
  const seats = [];
  const seatTypes = layout === '1+1' ? ['sleeper'] : ['seater'];
  
  for (let i = 1; i <= totalSeats; i++) {
    const row = Math.ceil(i / (layout === '1+1' ? 2 : layout === '1+2' ? 3 : 4));
    const position = i % (layout === '1+1' ? 2 : layout === '1+2' ? 3 : 4);
    const seatNumber = `${row}${String.fromCharCode(65 + position)}`;
    
    seats.push({
      number: seatNumber,
      type: seatTypes[0],
      status: 'available',
      price: basePrice + (Math.random() * 100 - 50), // Add some price variation
      isLadies: i <= 2, // First 2 seats are ladies seats
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
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
  }
  
  return dates;
}

// Generate random departure and arrival times
function generateTimes(source, destination) {
  const times = [
    { departure: '06:00', arrival: '08:30' },
    { departure: '08:00', arrival: '10:30' },
    { departure: '10:00', arrival: '12:30' },
    { departure: '12:00', arrival: '14:30' },
    { departure: '14:00', arrival: '16:30' },
    { departure: '16:00', arrival: '18:30' },
    { departure: '18:00', arrival: '20:30' },
    { departure: '20:00', arrival: '22:30' },
    { departure: '22:00', arrival: '00:30' },
    { departure: '23:30', arrival: '02:00' }
  ];
  
  return times[Math.floor(Math.random() * times.length)];
}

// Generate random amenities
function generateAmenities() {
  const numAmenities = Math.floor(Math.random() * 6) + 3; // 3 to 8 amenities
  const shuffled = [...allAmenities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numAmenities);
}

async function addBuses() {
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

    console.log('🚌 Adding buses...');

    for (const route of routes) {
      for (const date of journeyDates) {
        // Add 15 buses for each route and date
        for (let i = 0; i < 15; i++) {
          const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
          const operator = operators[Math.floor(Math.random() * operators.length)];
          const times = generateTimes(route.source, route.destination);
          
          // Calculate fare based on distance and bus type
          const distanceMultiplier = Math.abs(route.source.length - route.destination.length) * 50 + 200;
          const fare = Math.round(busType.baseFare + distanceMultiplier + (Math.random() * 200 - 100));
          
          // Generate seat count based on bus type
          const totalSeats = busType.layout === '1+1' ? 24 : busType.layout === '1+2' ? 30 : 40;
          
          // Generate seats
          const seatsLower = generateSeats(busType.layout, busType.hasTwoDecks ? totalSeats / 2 : totalSeats, fare / totalSeats, 'lower');
          const seatsUpper = busType.hasTwoDecks ? generateSeats(busType.layout, totalSeats / 2, fare / totalSeats, 'upper') : [];

          const bus = new Bus({
            busNumber: `${route.source.substring(0, 3).toUpperCase()}-${route.destination.substring(0, 3).toUpperCase()}-${date.replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`,
            busName: `${operator} - ${busType.type}`,
            busType: busType.type,
            source: route.source,
            destination: route.destination,
            departureTime: times.departure,
            arrivalTime: times.arrival,
            journeyDate: date,
            fare: fare,
            totalSeats: totalSeats,
            seatLayout: busType.layout,
            hasTwoDecks: busType.hasTwoDecks,
            seatsLower: seatsLower,
            seatsUpper: seatsUpper,
            amenities: generateAmenities()
          });

          await bus.save();
          totalBusesAdded++;

          if (totalBusesAdded % 100 === 0) {
            console.log(`📊 Added ${totalBusesAdded} buses...`);
          }
        }
      }
    }

    console.log(`🎉 Successfully added ${totalBusesAdded} buses to the database!`);
    
    // Show summary
    const busCount = await Bus.countDocuments();
    console.log(`📊 Total buses in database: ${busCount}`);
    
    // Show sample buses
    const sampleBuses = await Bus.find({}).limit(5);
    console.log('\n📋 Sample buses:');
    sampleBuses.forEach((bus, index) => {
      console.log(`  ${index + 1}. ${bus.busNumber} - ${bus.source} to ${bus.destination} on ${bus.journeyDate}`);
      console.log(`     Type: ${bus.busType}, Fare: ₹${bus.fare}, Seats: ${bus.totalSeats}`);
    });

  } catch (error) {
    console.error('❌ Error adding buses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

addBuses();
