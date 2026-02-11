import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

async function testDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Count all users
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    // List all users
    const users = await User.find({});
    console.log('👥 All users in database:');
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user._id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Created: ${user.createdAt}`);
    });

    // Test creating a user
    console.log('\n🧪 Testing user creation...');
    const testUser = new User({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456'
    });

    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log(`📝 Test user ID: ${testUser._id}`);

    // Verify the user was saved
    const savedUser = await User.findOne({ email: testUser.email });
    if (savedUser) {
      console.log('✅ Test user verified in database');
    } else {
      console.log('❌ Test user NOT found in database!');
    }

    // New count after adding test user
    const newUserCount = await User.countDocuments();
    console.log(`📊 Total users after test: ${newUserCount}`);

  } catch (error) {
    console.error('❌ Database test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testDatabase();
