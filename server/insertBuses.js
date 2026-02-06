import mongoose from 'mongoose';
import Bus from './models/Bus.js'; // Adjust path if needed

const MONGO_URI = 'mongodb+srv://Admin:1234ramsha%40@cluster0.72cqtd0.mongodb.net/bus?retryWrites=true&w=majority&appName=Cluster0';

const busCompanies = [
  'Sugama', 'Seabird', 'Shreekumar', 'VRL', 'Anand Travels',
  'Limousine Tours and Travels', 'Greenline', 'SRS Travels', 'Intercity'
];

const karnatakaCities = [
  'Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore', 'Udupi', 'Shimoga',
  'Davanagere', 'Gulbarga', 'Bellary', 'Hospet', 'Chikmagalur', 'Hassan',
  'Tumkur', 'Raichur', 'Bijapur', 'Karwar', 'Bidar', 'Mandya', 'Kolar'
];

const generateSeats = (deck) => {
  const seats = [];
  const price = deck === 'lower' ? 500 : 600;
  let count = 1;

  // 5 single
  for (let i = 0; i < 5; i++) {
    seats.push({
      number: `${deck[0].toUpperCase()}S${count++}`,
      type: 'sleeper',
      status: 'available',
      price,
      deck
    });
  }

  // 10 double
  for (let i = 0; i < 10; i++) {
    seats.push({
      number: `${deck[0].toUpperCase()}D${count++}`,
      type: 'sleeper',
      status: 'available',
      price: price + 50,
      deck
    });
  }

  return seats;
};

const insertBuses = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const buses = [];

    for (let d = 0; d < 30; d++) {
      const date = new Date();
      date.setDate(date.getDate() + d);
      const journeyDate = date.toISOString().split('T')[0];

      for (const company of busCompanies) {
        for (let i = 0; i < karnatakaCities.length; i++) {
          for (let j = 0; j < karnatakaCities.length; j++) {
            if (i === j) continue;

            const source = karnatakaCities[i];
            const destination = karnatakaCities[j];
            const busNumber = `${company.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}-${d}`;

            buses.push({
              busNumber,
              busName: company,
              busType: 'Sleeper AC',
              source,
              destination,
              departureTime: '22:00',
              arrivalTime: '06:00',
              journeyDate,
              fare: 800,
              totalSeats: 30,
              seatLayout: '2+1',
              hasTwoDecks: true,
              seatsLower: generateSeats('lower'),
              seatsUpper: generateSeats('upper'),
              amenities: ['Water Bottle', 'Charging Point', 'Blanket']
            });
          }
        }
      }
    }

    console.log(`🚀 Inserting ${buses.length} buses...`);
    await Bus.insertMany(buses);
    console.log(`✅ Successfully inserted ${buses.length} buses for next 30 days.`);
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Insertion error:', error);
    mongoose.disconnect();
  }
};

insertBuses();