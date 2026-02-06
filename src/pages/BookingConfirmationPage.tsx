// src/pages/BookingConfirmationPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

interface Seat {
  id: string;
  number: string;
  type: 'seater' | 'sleeper';
  status: 'available' | 'booked' | 'selected' | 'reserved';
  price: number;
  deck: 'lower' | 'upper';
}

interface BookingInfo {
  busId: string;
  busName: string;
  busNumber: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  journeyDate: string;
  selectedSeats: Seat[];
  totalPrice: number;
}

const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  let info = location.state?.bookingInfo;

  if (!info) {
    const stored = sessionStorage.getItem('bookingInfo');
    if (stored) {
      info = JSON.parse(stored);
    }
  }

  if (!info || !user) {
    toast.error("Missing booking or user info.");
    navigate('/');
    return;
  }

  setBookingInfo(info);

  // Send to backend
axios.post('http://localhost:5000/api/bookings', {
  busId: info.busId,
  seats: info.selectedSeats,
  totalFare: info.totalPrice,
  journeyDate: info.journeyDate,
  contactInfo: info.contactInfo
  })
    .then((res) => {
      toast.success("Booking confirmed!");
      console.log("Booking stored:", res.data);
    })
    .catch((err) => {
      console.error("Booking failed:", err);
      toast.error("Booking failed to store.");
    })
    .finally(() => {
      setIsLoading(false);
    });
}, [location.state, user, navigate]);


  if (isLoading || !bookingInfo) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center">
        <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your seats have been successfully booked.</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin size={20} />
          <span>{bookingInfo.source} → {bookingInfo.destination}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={20} />
          <span>{bookingInfo.journeyDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={20} />
          <span>{bookingInfo.departureTime} - {bookingInfo.arrivalTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard size={20} />
          <span>Total Paid: ₹{bookingInfo.totalPrice}</span>
        </div>
        <div>
          <h2 className="font-semibold">Seats:</h2>
          <ul className="list-disc list-inside">
            {bookingInfo.selectedSeats.map((seat) => (
              <li key={seat.id}>{seat.number} ({seat.deck} deck)</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link to="/user/bookings" className="text-blue-600 underline">View My Bookings</Link>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
