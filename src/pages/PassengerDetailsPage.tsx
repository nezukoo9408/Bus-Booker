// src/pages/PassengerDetailsPage.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PassengerDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const bookingInfo = state?.bookingInfo || JSON.parse(sessionStorage.getItem("bookingInfo") || '{}');

  const initialContact = bookingInfo.contactInfo || {};

  const [name, setName] = useState(initialContact.name || '');
  const [email, setEmail] = useState(initialContact.email || '');
  const [phone, setPhone] = useState(initialContact.phone || '');

  if (!bookingInfo) return <div className="p-6 text-red-600">Booking info missing</div>;

  const handleNext = () => {
    if (!name || !email || !phone) return alert("Fill all fields");

    const updatedBooking = {
      ...bookingInfo,
      contactInfo: { name, email, phone }
    };

    sessionStorage.setItem("bookingInfo", JSON.stringify(updatedBooking));
    navigate("/booking/payment", { state: { bookingInfo: updatedBooking } });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Passenger Details</h1>
      <input className="w-full p-2 border mb-2" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input className="w-full p-2 border mb-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="w-full p-2 border mb-4" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleNext}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default PassengerDetailsPage;
