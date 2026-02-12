import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './models/Bus.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

async function analyzeBuses() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get total bus count
    const totalBuses = await Bus.countDocuments();
    console.log(`📊 Total buses in database: ${totalBuses}`);

    // Get all unique sources
    const sources = await Bus.distinct('source');
    console.log(`\n📍 Available Sources (${sources.length}):`);
    sources.forEach((source, index) => {
      console.log(`  ${index + 1}. ${source}`);
    });

    // Get all unique destinations
    const destinations = await Bus.distinct('destination');
    console.log(`\n🎯 Available Destinations (${destinations.length}):`);
    destinations.forEach((destination, index) => {
      console.log(`  ${index + 1}. ${destination}`);
    });

    // Get all unique routes
    const routes = await Bus.aggregate([
      {
        $group: {
          _id: {
            source: '$source',
            destination: '$destination'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.source': 1, '_id.destination': 1 }
      }
    ]);

    console.log(`\n🛣️  Available Routes (${routes.length}):`);
    routes.forEach((route, index) => {
      console.log(`  ${index + 1}. ${route._id.source} → ${route._id.destination} (${route.count} buses)`);
    });

    // Get bus types
    const busTypes = await Bus.distinct('busType');
    console.log(`\n🚌 Bus Types Available (${busTypes.length}):`);
    busTypes.forEach((type, index) => {
      console.log(`  ${index + 1}. ${type}`);
    });

    // Get price range
    const priceStats = await Bus.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$fare' },
          maxPrice: { $max: '$fare' },
          avgPrice: { $avg: '$fare' }
        }
      }
    ]);

    if (priceStats.length > 0) {
      console.log(`\n💰 Price Range:`);
      console.log(`  Minimum: ₹${priceStats[0].minPrice}`);
      console.log(`  Maximum: ₹${priceStats[0].maxPrice}`);
      console.log(`  Average: ₹${Math.round(priceStats[0].avgPrice)}`);
    }

    // Get journey dates
    const dates = await Bus.distinct('journeyDate').sort();
    console.log(`\n📅 Journey Dates Available (${dates.length}):`);
    dates.forEach((date, index) => {
      if (index < 10) { // Show first 10 dates
        console.log(`  ${index + 1}. ${date}`);
      } else if (index === 10) {
        console.log(`  ... and ${dates.length - 10} more dates`);
      }
    });

    // Sample buses from each route
    console.log(`\n📋 Sample Buses:`);
    for (const route of routes.slice(0, 5)) { // Show first 5 routes
      const sampleBus = await Bus.findOne({
        source: route._id.source,
        destination: route._id.destination
      });
      if (sampleBus) {
        console.log(`  ${sampleBus.source} → ${sampleBus.destination}: ${sampleBus.busName} - ₹${sampleBus.fare}`);
      }
    }

  } catch (error) {
    console.error('❌ Error analyzing buses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

analyzeBuses();
