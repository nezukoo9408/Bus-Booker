import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Simple test component
const HomePage = () => (
  <div style={{ padding: '20px', backgroundColor: 'blue', color: 'white' }}>
    <h1>Home Page - Routing is working!</h1>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
