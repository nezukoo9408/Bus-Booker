// src/pages/BookingSummaryPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookingSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem('bookingInfo');

  if (!stored) {
    return <div className="p-6 text-red-600">No booking info found.</div>;
  }

  const bookingInfo = JSON.parse(stored);

  const handleContinue = () => {
    navigate("/booking/passenger", { state: { bookingInfo } });

  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Summary</h1>
      <p><strong>Bus:</strong> {bookingInfo.busName} ({bookingInfo.busNumber})</p>
      <p><strong>Route:</strong> {bookingInfo.source} → {bookingInfo.destination}</p>
      <p><strong>Date:</strong> {bookingInfo.journeyDate}</p>
      <p><strong>Seats:</strong> {bookingInfo.selectedSeats.map((s: any) => s.number).join(', ')}</p>
      <p><strong>Total Fare:</strong> ₹{bookingInfo.totalPrice}</p>

      <button
        className="bg-blue-600 text-white px-6 py-2 mt-4 rounded"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
};

export default BookingSummaryPage;
