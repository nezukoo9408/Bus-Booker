import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

// Just 4 major cities to save space
const cities = ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'];

// Bus types with different comfort levels and prices
const busTypes = [
  { type: 'Non-AC Seater', layout: '2+2', decks: false, baseFare: 200, seats: 40, comfort: 'Basic' },
  { type: 'AC Seater', layout: '2+2', decks: false, baseFare: 350, seats: 40, comfort: 'Standard' },
  { type: 'AC Semi-Sleeper', layout: '2+1', decks: false, baseFare: 500, seats: 30, comfort: 'Comfort' },
  { type: 'Volvo AC Sleeper', layout: '1+1', decks: true, baseFare: 800, seats: 24, comfort: 'Premium' },
  { type: 'Luxury AC Sleeper', layout: '1+1', decks: true, baseFare: 1200, seats: 20, comfort: 'Luxury' },
  { type: 'Business Class', layout: '1+1', decks: true, baseFare: 2000, seats: 16, comfort: 'Business' },
  { type: 'Economy Non-AC', layout: '2+2', decks: false, baseFare: 100, seats: 45, comfort: 'Economy' }
];

// Bus companies
const busCompanies = ['VRL', 'SRS', 'Sugama', 'Seabird', 'Orange', 'Intercity'];

// Generate seats based on bus type
function generateSeats(busType, totalSeats, deck) {
  const seats = [];
  const seatType = busType.layout.includes('1+1') || busType.layout.includes('Sleeper') ? 'sleeper' : 'seater';
  const basePrice = busType.baseFare / totalSeats; // Distribute base fare across seats
  
  for (let i = 1; i <= totalSeats; i++) {
    const row = Math.ceil(i / (busType.layout === '1+1' ? 2 : busType.layout === '1+2' ? 3 : 4));
    const position = i % (busType.layout === '1+1' ? 2 : busType.layout === '1+2' ? 3 : 4);
    const seatNumber = `${row}${String.fromCharCode(65 + position)}`;
    
    // Add some price variation
    const priceVariation = basePrice + (Math.random() * 50 - 25);
    
    seats.push({
      number: seatNumber,
      type: seatType,
      status: 'available',
      price: Math.round(priceVariation),
      isLadies: i <= 2,
      deck: deck
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
              // Use different bus types for variety
              const busType = busTypes[busIndex % busTypes.length];
              const company = busCompanies[Math.floor(Math.random() * busCompanies.length)];
              
              const busNumber = `${source.substring(0, 3).toUpperCase()}-${destination.substring(0, 3).toUpperCase()}-${date.replace(/-/g, '')}-${String(busIndex + 1).padStart(2, '0')}`;
              
              // Generate seats based on bus type
              const seatsLower = generateSeats(busType, busType.hasTwoDecks ? busType.seats / 2 : busType.seats, 'lower');
              const seatsUpper = busType.hasTwoDecks ? generateSeats(busType, busType.seats / 2, 'upper') : [];
              
              // Generate amenities based on comfort level
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

              const bus = new Bus({
                busNumber: busNumber,
                busName: `${company} - ${busType.type}`,
                busType: busType.type,
                source: source,
                destination: destination,
                departureTime: '06:00',
                arrivalTime: '09:00',
                journeyDate: date,
                fare: busType.baseFare,
                totalSeats: busType.seats,
                seatLayout: busType.layout,
                hasTwoDecks: busType.hasTwoDecks,
                seatsLower: seatsLower,
                seatsUpper: seatsUpper,
                amenities: amenities
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
    console.log(`💰 Price range: ₹100-₹2000 based on comfort level`);
    console.log(`🎯 Comfort levels: Economy, Basic, Standard, Comfort, Premium, Luxury, Business`);
    
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
