// Run this in your browser console to diagnose the network issue

console.log('🔍 Testing CoinGecko API Connection...\n');

async function testConnection() {
  try {
    console.log('1️⃣ Testing basic connectivity...');
    const pingResponse = await fetch('https://api.coingecko.com/api/v3/ping', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    console.log(`   Status: ${pingResponse.ok ? '✅ SUCCESS' : '❌ FAILED'} (${pingResponse.status})`);
    
    if (pingResponse.ok) {
      const pingData = await pingResponse.json();
      console.log('   Response:', pingData);
    }
    
    console.log('\n2️⃣ Testing coin data endpoint...');
    const coinResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&sparkline=false', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    console.log(`   Status: ${coinResponse.ok ? '✅ SUCCESS' : '❌ FAILED'} (${coinResponse.status})`);
    
    if (coinResponse.ok) {
      const coinData = await coinResponse.json();
      console.log('   Bitcoin price:', coinData[0]?.current_price);
    } else {
      const errorText = await coinResponse.text();
      console.log('   Error response:', errorText.substring(0, 200));
    }
    
    console.log('\n3️⃣ Checking CORS headers...');
    const corsHeaders = {
      'Access-Control-Allow-Origin': coinResponse.headers.get('Access-Control-Allow-Origin'),
      'Content-Type': coinResponse.headers.get('Content-Type'),
    };
    console.log('   Headers:', corsHeaders);
    
    console.log('\n4️⃣ Network diagnostics complete!');
    console.log('\n💡 If tests failed:');
    console.log('   - Check your internet connection');
    console.log('   - Try refreshing the page');
    console.log('   - Check https://www.coingeckostatus.com/ for API outages');
    console.log('   - Wait a few minutes if rate limited (429 status)');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('\n💡 Possible causes:');
    console.error('   - No internet connection');
    console.error('   - Firewall blocking CoinGecko API');
    console.error('   - DNS resolution failure');
    console.error('   - Browser extension blocking requests');
  }
}

testConnection();
