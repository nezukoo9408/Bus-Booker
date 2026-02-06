import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Seat {
  number: string;
  deck: string;
  isLadies?: boolean;
}

interface Bus {
  name: string;
  source: string;
  destination: string;
}

interface Booking {
  _id: string;
  bookingId: string;
  journeyDate: string;
  seats: Seat[];
  totalFare: number;
  busId: Bus;
  status: string; // Add status here
}

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null); // Store bookingId for confirmation

  const fetchBookings = () => {
    axios
      .get('http://localhost:5000/api/bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => console.error('Error fetching bookings:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const handleDelete = async () => {
    if (!confirmId) return;

    try {
      // Send the delete request
      await axios.delete(`http://localhost:5000/api/bookings/${confirmId}`);

      // Update the status of the cancelled booking directly in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === confirmId
            ? { ...booking, status: 'cancelled' }  // Update the status to 'cancelled'
            : booking
        )
      );

      setConfirmId(null);
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Something went wrong.');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`border border-gray-300 rounded-lg shadow-sm p-6 bg-white ${
                booking.status === 'cancelled' ? 'bg-gray-200' : ''
              }`} // Add a conditional background for cancelled bookings
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold text-blue-600">{booking.busId?.name}</h2>
                  <p className="text-gray-600 text-sm">
                    {booking.busId?.source} → {booking.busId?.destination}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Journey Date:{' '}
                    <span className="font-medium">
                      {new Date(booking.journeyDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="mt-2">
                    <strong>Seats:</strong>{' '}
                    {booking.seats.map((seat) => `${seat.number} (${seat.deck})`).join(', ')}
                  </p>
                  <p className="mt-1">
                    <strong>Total Fare:</strong> ₹{booking.totalFare}
                  </p>

                  {/* Display booking status */}
                  {booking.status === 'cancelled' ? (
                    <p className="mt-2 text-red-500 font-semibold">Cancelled</p> // Indicate cancellation
                  ) : (
                    <p className="mt-2 text-green-500 font-semibold">Confirmed</p> // Show confirmation if not cancelled
                  )}
                </div>

                {booking.status !== 'cancelled' && ( // Only show cancel button if not cancelled
                  <button
                    onClick={() => setConfirmId(booking.bookingId)} // Use bookingId for deletion
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You have no bookings.</p>
      )}

      {/* Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Confirm Cancellation</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmId(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
