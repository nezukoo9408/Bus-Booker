import React from 'react';
import { Routes, Route } from 'react-router-dom';

const TestPage = () => (
  <div style={{ padding: '20px', backgroundColor: 'purple', color: 'white' }}>
    <h1>Test Page - Routing is working!</h1>
    <p>This is a simple test to verify routing works</p>
  </div>
);

function App() {
  console.log('App component is rendering');
  return (
    <div>
      <h1 style={{ color: 'red', textAlign: 'center' }}>APP IS LOADING!</h1>
      <Routes>
        <Route path="/" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;
