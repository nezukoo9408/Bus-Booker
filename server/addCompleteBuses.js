import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// All 20 Karnataka cities
const karnatakaCities = [
  'Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore', 'Udupi', 'Shimoga',
  'Davanagere', 'Gulbarga', 'Bellary', 'Hospet', 'Chikmagalur', 'Hassan',
  'Tumkur', 'Raichur', 'Bijapur', 'Karwar', 'Bidar', 'Mandya', 'Kolar'
];

// Bus companies
const busCompanies = ['VRL', 'SRS', 'Sugama', 'Seabird', 'Orange', 'Intercity', 'Durgamba', 'Ganesh'];

// Bus types with price range 800-1500
const busTypes = [
  { type: 'AC Seater', layout: '2+2', decks: false, baseFare: 800, seats: 40, comfort: 'Standard' },
  { type: 'AC Semi-Sleeper', layout: '2+1', decks: false, baseFare: 1000, seats: 30, comfort: 'Comfort' },
  { type: 'Volvo AC Sleeper', layout: '1+1', decks: true, baseFare: 1200, seats: 24, comfort: 'Premium' },
  { type: 'Luxury AC Sleeper', layout: '1+1', decks: true, baseFare: 1500, seats: 20, comfort: 'Luxury' },
  { type: 'Business Class', layout: '1+1', decks: true, baseFare: 1400, seats: 16, comfort: 'Business' }
];

// Generate realistic bus seat layout
function generateBusSeats(busType, totalSeats, basePrice) {
  const seats = [];
  const seatType = busType.layout.includes('Sleeper') ? 'sleeper' : 'seater';
  
  // Calculate deck distribution
  const lowerDeckSeats = busType.hasTwoDecks ? Math.floor(totalSeats * 0.6) : totalSeats;
  const upperDeckSeats = busType.hasTwoDecks ? Math.ceil(totalSeats * 0.4) : 0;
  
  // Lower deck seats (more expensive)
  for (let i = 1; i <= lowerDeckSeats; i++) {
    const row = Math.ceil(i / (busType.layout === '1+1' ? 2 : busType.layout === '1+2' ? 3 : 4));
    const position = i % (busType.layout === '1+1' ? 2 : busType.layout === '1+2' ? 3 : 4);
    const seatNumber = `L${row}${String.fromCharCode(65 + position)}`;
    
    // Price variation for lower deck (higher price)
    const priceVariation = basePrice + (Math.random() * 100 - 50);
    
    seats.push({
      number: seatNumber,
      type: seatType,
      status: 'available',
      price: Math.round(priceVariation),
      isLadies: i <= 5, // First 5 seats are ladies seats
      deck: 'lower'
    });
  }
  
  // Upper deck seats (less expensive)
  for (let i = 1; i <= upperDeckSeats; i++) {
    const row = Math.ceil(i / (busType.layout === '1+1' ? 2 : busType.layout === '1+2' ? 3 : 4));
    const position = i % (busType.layout === '1+1' ? 2 : busType.layout === '1+2' ? 3 : 4);
    const seatNumber = `U${row}${String.fromCharCode(65 + position)}`;
    
    // Price variation for upper deck (lower price)
    const priceVariation = (basePrice * 0.8) + (Math.random() * 80 - 40);
    
    seats.push({
      number: seatNumber,
      type: seatType,
      status: 'available',
      price: Math.round(priceVariation),
      isLadies: i <= 5, // First 5 seats are ladies seats
      deck: 'upper'
    });
  }
  
  return seats;
}

// Generate journey dates for next 15 days
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

// Generate departure and arrival times
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

// Generate amenities based on comfort level
function generateAmenities(busType) {
  let amenities = ['Emergency Exit'];
  
  if (busType.comfort === 'Business' || busType.comfort === 'Luxury') {
    amenities = ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 'Snacks', 'TV', 'Reading Light', 'Pillow', 'Air Conditioning', 'Emergency Exit'];
  } else if (busType.comfort === 'Premium') {
    amenities = ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 'Air Conditioning', 'Emergency Exit'];
  } else if (busType.comfort === 'Comfort') {
    amenities = ['Charging Point', 'Water Bottle', 'Air Conditioning', 'Emergency Exit'];
  } else if (busType.comfort === 'Standard') {
    amenities = ['Air Conditioning', 'Emergency Exit'];
  }
  
  return amenities;
}

async function addCompleteBuses() {
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

    console.log('🚌 Adding buses for all 20 Karnataka cities...');

    // Generate all possible routes between cities
    for (let i = 0; i < karnatakaCities.length; i++) {
      for (let j = 0; j < karnatakaCities.length; j++) {
        if (i !== j) { // Skip same city
          const source = karnatakaCities[i];
          const destination = karnatakaCities[j];
          totalRoutes++;
          
          console.log(`📍 Processing route: ${source} to ${destination}`);
          
          for (const date of journeyDates) {
            // Add 7 buses for each route and date
            for (let busIndex = 0; busIndex < 7; busIndex++) {
              // Use different bus types for variety
              const busType = busTypes[busIndex % busTypes.length];
              const company = busCompanies[Math.floor(Math.random() * busCompanies.length)];
              const times = generateTimes();
              
              // Generate unique bus number
              const routeIndex = i * 100 + j;
              const busNumber = `${source.substring(0, 3).toUpperCase()}-${destination.substring(0, 3).toUpperCase()}-${date.replace(/-/g, '')}-${routeIndex}-${String(busIndex + 1).padStart(2, '0')}`;
              
              // Generate seats with proper layout
              const allSeats = generateBusSeats(busType, busType.seats, busType.baseFare);
              const seatsLower = allSeats.filter(seat => seat.deck === 'lower');
              const seatsUpper = allSeats.filter(seat => seat.deck === 'upper');

              const bus = new Bus({
                busNumber: busNumber,
                busName: `${company} - ${busType.type}`,
                busType: busType.type,
                source: source,
                destination: destination,
                departureTime: times.departure,
                arrivalTime: times.arrival,
                journeyDate: date,
                fare: busType.baseFare,
                totalSeats: busType.seats,
                seatLayout: busType.layout,
                hasTwoDecks: busType.hasTwoDecks,
                seatsLower: seatsLower,
                seatsUpper: seatsUpper,
                amenities: generateAmenities(busType)
              });

              await bus.save();
              totalBusesAdded++;

              if (totalBusesAdded % 1000 === 0) {
                console.log(`📊 Added ${totalBusesAdded} buses...`);
              }
            }
          }
        }
      }
    }

    console.log(`🎉 Successfully added ${totalBusesAdded} buses to the database!`);
    console.log(`📍 Total routes covered: ${totalRoutes}`);
    console.log(`📅 Days covered: ${journeyDates.length} days`);
    console.log(`🚌 Buses per route per day: 7`);
    console.log(`💰 Price range: ₹800-₹1500`);
    console.log(`🎯 Cities covered: All 20 Karnataka cities`);
    
    // Show summary
    const busCount = await Bus.countDocuments();
    console.log(`📊 Total buses in database: ${busCount}`);
    
    // Show sample buses
    const sampleBuses = await Bus.find({}).limit(5);
    console.log('\n📋 Sample buses:');
    sampleBuses.forEach((bus, index) => {
      console.log(`  ${index + 1}. ${bus.busNumber} - ${bus.source} to ${bus.destination} on ${bus.journeyDate}`);
      console.log(`     ${bus.busName}, Fare: ₹${bus.fare}, Seats: ${bus.totalSeats}`);
      console.log(`     Lower deck: ${bus.seatsLower.length} seats, Upper deck: ${bus.seatsUpper.length} seats`);
    });

    // Show route coverage
    const uniqueRoutes = await Bus.distinct('source');
    console.log(`\n🌍 Cities covered as source: ${uniqueRoutes.length}`);
    console.log(`Cities: ${uniqueRoutes.join(', ')}`);

  } catch (error) {
    console.error('❌ Error adding buses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

addCompleteBuses();
