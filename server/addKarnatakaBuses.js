import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// All Karnataka cities
const karnatakaCities = [
  'Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore', 'Udupi', 'Shimoga',
  'Davanagere', 'Gulbarga', 'Bellary', 'Hospet', 'Chikmagalur', 'Hassan',
  'Tumkur', 'Raichur', 'Bijapur', 'Karwar', 'Bidar', 'Mandya', 'Kolar'
];

// Bus companies
const busCompanies = [
  'Sugama', 'Seabird', 'Shreekumar', 'VRL', 'Anand Travels',
  'Limousine Tours and Travels', 'Greenline', 'SRS Travels', 'Intercity',
  'Durgamba', 'Ganesh Travels', 'National Travels', 'Pragathi Travels'
];

// Bus types and configurations
const busTypes = [
  { type: 'Volvo AC Sleeper', layout: '1+1', decks: true, baseFare: 800, seats: 24 },
  { type: 'Volvo AC Semi-Sleeper', layout: '2+1', decks: false, baseFare: 600, seats: 30 },
  { type: 'AC Seater Pushback', layout: '2+2', decks: false, baseFare: 400, seats: 40 },
  { type: 'Non-AC Seater', layout: '2+2', decks: false, baseFare: 300, seats: 45 },
  { type: 'AC Sleeper', layout: '1+2', decks: true, baseFare: 700, seats: 30 },
  { type: 'Non-AC Sleeper', layout: '1+2', decks: true, baseFare: 500, seats: 32 },
  { type: 'Volvo Multi-Axle', layout: '2+2', decks: false, baseFare: 750, seats: 50 },
  { type: 'Mini AC Bus', layout: '2+1', decks: false, baseFare: 350, seats: 25 }
];

// Amenities
const allAmenities = [
  'WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 
  'Snacks', 'TV', 'Reading Light', 'Pillow', 
  'Emergency Exit', 'CCTV', 'GPS Tracking', 'USB Port',
  'Air Conditioning', 'Recliner Seats', 'Mobile Charging'
];

// Calculate distance between cities (simplified)
function calculateDistance(source, destination) {
  const cityCoordinates = {
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Mysore': { lat: 12.2958, lng: 76.6394 },
    'Hubli': { lat: 15.3647, lng: 75.1240 },
    'Belgaum': { lat: 15.8497, lng: 74.4977 },
    'Mangalore': { lat: 12.8764, lng: 74.8439 },
    'Udupi': { lat: 13.3409, lng: 74.7421 },
    'Shimoga': { lat: 13.9289, lng: 75.5698 },
    'Davanagere': { lat: 14.4643, lng: 75.9218 },
    'Gulbarga': { lat: 17.3355, lng: 76.8314 },
    'Bellary': { lat: 15.1394, lng: 76.9214 },
    'Hospet': { lat: 15.2719, lng: 76.3954 },
    'Chikmagalur': { lat: 13.3257, lng: 75.7779 },
    'Hassan': { lat: 13.0099, lng: 76.0955 },
    'Tumkur': { lat: 13.3378, lng: 77.1125 },
    'Raichur': { lat: 16.2076, lng: 77.3496 },
    'Bijapur': { lat: 16.8302, lng: 75.7126 },
    'Karwar': { lat: 14.8122, lng: 74.1242 },
    'Bidar': { lat: 17.9118, lng: 77.5170 },
    'Mandya': { lat: 12.5225, lng: 76.8950 },
    'Kolar': { lat: 13.1363, lng: 78.1325 }
  };

  const coord1 = cityCoordinates[source];
  const coord2 = cityCoordinates[destination];
  
  if (!coord1 || !coord2) return 200; // Default distance
  
  // Simple distance calculation (not accurate but good for pricing)
  const distance = Math.sqrt(
    Math.pow(coord2.lat - coord1.lat, 2) + 
    Math.pow(coord2.lng - coord1.lng, 2)
  ) * 100; // Convert to approximate km
  
  return Math.max(distance, 100); // Minimum 100km
}

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
      price: Math.round(basePrice + (Math.random() * 50 - 25)), // Add price variation
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

// Generate departure and arrival times based on distance
function generateTimes(distance) {
  const baseTime = 6; // Start from 6 AM
  const journeyHours = Math.max(2, distance / 50); // Approximate journey time
  
  const departureHour = baseTime + Math.floor(Math.random() * 16); // Between 6 AM and 10 PM
  const arrivalHour = departureHour + journeyHours;
  
  const departure = `${String(Math.floor(departureHour % 24)).padStart(2, '0')}:${String(Math.floor((departureHour % 1) * 60)).padStart(2, '0')}`;
  const arrival = `${String(Math.floor(arrivalHour % 24)).padStart(2, '0')}:${String(Math.floor((arrivalHour % 1) * 60)).padStart(2, '0')}`;
  
  return { departure, arrival };
}

// Generate random amenities
function generateAmenities(busType) {
  const basicAmenities = ['Air Conditioning', 'Emergency Exit'];
  const premiumAmenities = ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 'TV', 'Reading Light', 'Pillow'];
  const luxuryAmenities = ['CCTV', 'GPS Tracking', 'USB Port', 'Recliner Seats', 'Mobile Charging'];
  
  let amenities = [...basicAmenities];
  
  if (busType.includes('Volvo') || busType.includes('AC')) {
    amenities = [...amenities, ...premiumAmenities.slice(0, Math.floor(Math.random() * 4) + 2)];
  }
  
  if (busType.includes('Volvo Multi-Axle') || busType.includes('Sleeper')) {
    amenities = [...amenities, ...luxuryAmenities.slice(0, Math.floor(Math.random() * 3) + 1)];
  }
  
  return amenities;
}

async function addKarnatakaBuses() {
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

    console.log('🚌 Adding buses for all Karnataka cities...');

    // Generate all possible routes between cities
    for (let i = 0; i < karnatakaCities.length; i++) {
      for (let j = 0; j < karnatakaCities.length; j++) {
        if (i !== j) { // Skip same city
          const source = karnatakaCities[i];
          const destination = karnatakaCities[j];
          const distance = calculateDistance(source, destination);
          
          totalRoutes++;
          
          console.log(`📍 Processing route: ${source} to ${destination} (${Math.round(distance)}km)`);
          
          for (const date of journeyDates) {
            // Add 15 buses for each route and date
            for (let busIndex = 0; busIndex < 15; busIndex++) {
              const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
              const company = busCompanies[Math.floor(Math.random() * busCompanies.length)];
              const times = generateTimes(distance);
              
              // Calculate fare based on distance and bus type
              const baseFare = Math.round(distance * (busType.baseFare / 100));
              const fare = Math.round(baseFare + (Math.random() * 200 - 100));
              
              // Generate unique bus number with timestamp and route index
              const routeIndex = karnatakaCities.indexOf(source) * 100 + karnatakaCities.indexOf(destination);
              const busNumber = `${source.substring(0, 3).toUpperCase()}-${destination.substring(0, 3).toUpperCase()}-${date.replace(/-/g, '')}-${routeIndex}-${String(busIndex + 1).padStart(3, '0')}`;
              
              // Generate seats
              const seatsLower = generateSeats(busType.layout, busType.hasTwoDecks ? busType.seats / 2 : busType.seats, fare / busType.seats, 'lower');
              const seatsUpper = busType.hasTwoDecks ? generateSeats(busType.layout, busType.seats / 2, fare / busType.seats, 'upper') : [];

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
                amenities: generateAmenities(busType.type)
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
    console.log(`🚌 Buses per route per day: 15`);
    
    // Show summary
    const busCount = await Bus.countDocuments();
    console.log(`📊 Total buses in database: ${busCount}`);
    
    // Show sample buses from different routes
    const sampleBuses = await Bus.find({}).limit(10);
    console.log('\n📋 Sample buses from different routes:');
    sampleBuses.forEach((bus, index) => {
      console.log(`  ${index + 1}. ${bus.busNumber} - ${bus.source} to ${bus.destination} on ${bus.journeyDate}`);
      console.log(`     ${bus.busName}, Fare: ₹${bus.fare}, Seats: ${bus.totalSeats}`);
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

addKarnatakaBuses();
