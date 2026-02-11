import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:1234ramsha%40@cluster0.8rqh5cq.mongodb.net/?appName=Cluster0';

async function testAuthFlow() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Test user data
    const testUser = {
      name: 'Test Auth User',
      email: `testauth${Date.now()}@example.com`,
      password: 'test123456'
    };

    console.log('\n🧪 === TESTING REGISTRATION ===');
    
    // 1. Test Registration
    console.log('📝 Creating new user...');
    const newUser = new User({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password
    });

    await newUser.save();
    console.log('✅ User registered successfully');
    console.log(`📋 User ID: ${newUser._id}`);
    console.log(`📋 Email: ${newUser.email}`);
    console.log(`📋 Role: ${newUser.role}`);
    console.log(`📋 Created: ${newUser.createdAt}`);

    // 2. Verify user exists in database
    console.log('\n🔍 Verifying user in database...');
    const foundUser = await User.findOne({ email: testUser.email });
    if (foundUser) {
      console.log('✅ User found in database');
      console.log(`📋 Found user ID: ${foundUser._id}`);
    } else {
      console.log('❌ User NOT found in database!');
      return;
    }

    // 3. Test Login - Find user with password
    console.log('\n🧪 === TESTING LOGIN ===');
    console.log('🔐 Testing login process...');
    const userForLogin = await User.findOne({ email: testUser.email }).select('+password');
    if (userForLogin) {
      console.log('✅ User found with password field');
      console.log(`📋 Password exists: ${!!userForLogin.password}`);
      console.log(`📋 Password hash length: ${userForLogin.password.length}`);
      
      // Test password comparison
      const isMatch = await userForLogin.comparePassword(testUser.password);
      console.log(`🔐 Password comparison result: ${isMatch}`);
      
      if (isMatch) {
        console.log('✅ Login authentication successful!');
      } else {
        console.log('❌ Password comparison failed!');
      }
    } else {
      console.log('❌ User not found for login test!');
    }

    // 4. Show all users in database
    console.log('\n📊 === CURRENT DATABASE STATE ===');
    const allUsers = await User.find({});
    console.log(`👥 Total users: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} - ${user.email} - ${user.role} - Created: ${user.createdAt.toLocaleString()}`);
    });

    console.log('\n🎉 Auth flow test completed successfully!');

  } catch (error) {
    console.error('❌ Auth test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testAuthFlow();
