import React from 'react';
import HomePageTest from './HomePage-test';

function App() {
  console.log('App is rendering');
  return (
    <div>
      <nav style={{ backgroundColor: 'gray', padding: '10px', color: 'white' }}>
        Navigation Bar
      </nav>
      <main>
        <HomePageTest />
      </main>
    </div>
  );
}

export default App;
