// Test the API call directly
const testApi = async () => {
  try {
    const busId = '698d7f7a82b4d772b7060e7f';
    const date = '2026-02-12';
    
    console.log('🌐 Testing API call...');
    console.log(`URL: https://busbooker-api.onrender.com/api/buses/${busId}?date=${date}`);
    
    const response = await fetch(`https://busbooker-api.onrender.com/api/buses/${busId}?date=${date}`);
    
    if (!response.ok) {
      console.log(`❌ API call failed: ${response.status} ${response.statusText}`);
      return;
    }
    
    const data = await response.json();
    
    console.log('✅ API Response:');
    console.log(`   _id: ${data._id}`);
    console.log(`   busName: ${data.busName}`);
    console.log(`   hasTwoDecks: ${data.hasTwoDecks} (type: ${typeof data.hasTwoDecks})`);
    console.log(`   totalSeats: ${data.totalSeats}`);
    console.log(`   seatsLower: ${data.seatsLower?.length || 0}`);
    console.log(`   seatsUpper: ${data.seatsUpper?.length || 0}`);
    
    if (data.seatsLower && data.seatsLower.length > 0) {
      console.log(`   Sample Lower: ${data.seatsLower[0].number} (₹${data.seatsLower[0].price})`);
    }
    
    if (data.seatsUpper && data.seatsUpper.length > 0) {
      console.log(`   Sample Upper: ${data.seatsUpper[0].number} (₹${data.seatsUpper[0].price})`);
    }
    
    // Check if hasTwoDecks is properly boolean
    console.log(`\n🔍 Data Type Check:`);
    console.log(`   hasTwoDecks === true: ${data.hasTwoDecks === true}`);
    console.log(`   hasTwoDecks == true: ${data.hasTwoDecks == true}`);
    console.log(`   Boolean(hasTwoDecks): ${Boolean(data.hasTwoDecks)}`);
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
};

testApi();
