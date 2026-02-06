// src/pages/PaymentPage.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingInfo } = location.state || {};

  // ✅ Added validation check for contact info
  if (!bookingInfo || !bookingInfo.contactInfo) {
    return <div className="text-red-600 p-6">Missing booking or contact info.</div>;
  }

  const handlePayment = () => {
    // ✅ Save to sessionStorage so next page can recover even on refresh
    sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));

    // ✅ Simulate successful payment
    navigate("/booking/confirmation");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <p>Pay ₹{bookingInfo.totalPrice} for booking</p>
      <button
        className="bg-green-600 text-white px-6 py-2 mt-4 rounded"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
