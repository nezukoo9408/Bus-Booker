import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Bus, Calendar, Clock, Info, MapPin, Users, ArrowRight } from 'lucide-react';

// Types
interface Seat {
  id: string;
  number: string;
  type: 'seater' | 'sleeper';
  status: 'available' | 'booked' | 'selected' | 'reserved';
  price: number;
  isLadies?: boolean;
  deck: 'lower' | 'upper';
}

interface BusType {
  _id: string;
  busName: string;
  busNumber: string;
  busType: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  journeyDate: string;
  hasTwoDecks: boolean;
  seatsLower: Seat[];
  seatsUpper: Seat[];
}

const SeatSelectionPage: React.FC = () => {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bus, setBus] = useState<BusType | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');

  const selectedDate = new URLSearchParams(location.search).get('date') || '';

  useEffect(() => {
    if (!busId) {
      toast.error("Invalid bus ID in URL.");
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL || ''}/api/buses/${busId}?date=${selectedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("Bus not found");
        return res.json();
      })
      .then((data) => {
        setBus(data);
        setLoading(false);
        console.log("✅ Bus fetched:", data);
      })
      .catch((err) => {
        console.error("❌ Error fetching bus:", err);
        toast.error("Failed to load bus details.");
        setLoading(false);
      });
  }, [busId, selectedDate]);

const toggleSeat = (seat: Seat) => {
  if (seat.status !== 'available') return;

  const alreadySelected = selectedSeats.find(s => s.id === seat.id);
  if (alreadySelected) {
    setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
  } else {
    const genderedSeat = {
      ...seat,
      isLadies: selectedGender === 'female',
    };
    setSelectedSeats(prev => [...prev, genderedSeat]);
  }
};


  const totalFare = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleContinue = () => {
    if (!user) {
      toast.error("Please log in to continue.");
      return;
    }

    if (!bus || selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    const bookingInfo = {
      busId: bus._id,
      busName: bus.busName,
      busNumber: bus.busNumber,
      source: bus.source,
      destination: bus.destination,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      journeyDate: selectedDate,
      selectedSeats: selectedSeats.map(seat => ({
  ...seat,
  isLadies: selectedGender === 'female',
})),

      totalPrice: totalFare
    };

    sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
    navigate("/booking/summary");
  };

  if (loading) return <LoadingSpinner />;

  if (!bus) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load bus. Please try again later.
      </div>
    );
  }

const renderSeatLayout = (seats: Seat[]) => {
  const singleSeats = seats.filter(seat => /^[LU]?[1-5]$/.test(seat.number));      // L1–L5, U1–U5
  const doubleSeats = seats.filter(seat => /^[LU]?1[1-9]$|^[LU]?20$/.test(seat.number)); // L11–L20, U11–U20

  return (
    <div className="flex flex-col items-center space-y-4">
      {Array.from({ length: 5 }).map((_, i) => {
        const single = singleSeats[i];
        const double1 = doubleSeats[i * 2];
        const double2 = doubleSeats[i * 2 + 1];

        return (
          <div key={i} className="flex justify-center items-center space-x-8">
            {/* Single seat on the left */}
            <div className="w-14 flex justify-center">{single && renderSeat(single)}</div>

            {/* Aisle */}
            <div className="w-6"></div>

            {/* Double seats on the right */}
            <div className="flex space-x-4">
              {double1 && renderSeat(double1)}
              {double2 && renderSeat(double2)}
            </div>
          </div>
        );
      })}
    </div>
  );
};



const renderSeat = (seat: Seat) => {
  const isSelected = selectedSeats.some(s => s.id === seat.id);
  const isBooked = seat.status === 'booked';
  const isLadies = seat.isLadies;
  const isReserved = seat.status === 'reserved';

  let seatStyle =
    'cursor-pointer w-12 h-12 rounded-md flex flex-col justify-center items-center text-sm font-medium border shadow-sm transition-all duration-200 ';

  // Seat selection styling logic
  if (isSelected) {
    seatStyle += 'bg-green-600 text-white border-green-700';
  } else if (isBooked) {
    seatStyle += 'bg-gray-400 text-white border-gray-500 pointer-events-none'; // Booked seats
  } else if (isReserved) {
    seatStyle += 'bg-yellow-400 text-white border-yellow-600 pointer-events-none'; // Reserved seats
  } else if (isLadies) {
    seatStyle += 'bg-pink-400 text-white border-pink-600'; // Female seats
  } else {
    seatStyle += 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'; // Available seats
  }

  return (
    <div key={seat.id} className={seatStyle} onClick={() => toggleSeat(seat)}>
      <span>{seat.number}</span>
      {isLadies && <span className="text-[10px] leading-none">Ladies</span>}
    </div>
  );
};


return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to bus list
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-start">
            <div className="w-full md:w-8/12">
              <div className="flex items-center mb-2">
                <Bus className="text-primary-500 mr-2" size={24} />
                <h1 className="text-2xl font-bold text-slate-900 mb-0">
                  {bus.busName} ({bus.busNumber})
                </h1>
              </div>
              <p className="text-slate-600 mb-4">{bus.busType}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><p className="text-sm text-slate-500 flex items-center"><MapPin size={14} className="mr-1" /> From</p><p className="font-medium">{bus.source}</p></div>
                <div><p className="text-sm text-slate-500 flex items-center"><MapPin size={14} className="mr-1" /> To</p><p className="font-medium">{bus.destination}</p></div>
                <div><p className="text-sm text-slate-500 flex items-center"><Calendar size={14} className="mr-1" /> Date</p><p className="font-medium">{new Date(bus.journeyDate).toLocaleDateString()}</p></div>
                <div><p className="text-sm text-slate-500 flex items-center"><Clock size={14} className="mr-1" /> Time</p><p className="font-medium">{bus.departureTime} - {bus.arrivalTime}</p></div>
              </div>
            </div>
          </div>
        </div>

        {bus.hasTwoDecks && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md flex items-center ${activeDeck === 'lower' ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                onClick={() => setActiveDeck('lower')}
              >
                <Bus size={18} className="mr-2" /> Lower Deck
              </button>
              <button
                className={`px-4 py-2 rounded-md flex items-center ${activeDeck === 'upper' ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                onClick={() => setActiveDeck('upper')}
              >
                <Bus size={18} className="mr-2" /> Upper Deck
              </button>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
  <h3 className="mb-2 text-sm font-medium text-slate-700">Select Gender:</h3>
  <div className="flex space-x-4">
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="gender"
        value="male"
        checked={selectedGender === 'male'}
        onChange={() => setSelectedGender('male')}
        className="accent-primary-600"
      />
      <span className="text-slate-800">Male</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="gender"
        value="female"
        checked={selectedGender === 'female'}
        onChange={() => setSelectedGender('female')}
        className="accent-primary-600"
      />
      <span className="text-slate-800">Female</span>
    </label>
  </div>
</div>


        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {activeDeck === 'lower' ? 'Lower' : 'Upper'} Deck Seats
                </h2>
                <div className="text-sm text-slate-500 flex items-center">
                  <Info size={16} className="mr-1" /> Click on a seat to select/deselect
                </div>
              </div>
              <div className="mb-10 w-20 ml-auto mr-2">
                <div className="bg-slate-200 rounded-t-lg p-2 text-center text-sm text-slate-700">Driver</div>
              </div>
              <div className="flex flex-wrap justify-center mb-10">
                {activeDeck === 'lower' ? renderSeatLayout(bus.seatsLower) : renderSeatLayout(bus.seatsUpper)}
              </div>
              <div className="w-32 mx-auto mt-8">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-2 text-center text-sm text-slate-500">
                  {activeDeck === 'lower' ? 'Entrance' : 'Stairs'}
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="bg-white rounded-lg shadow-sm sticky top-24">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Booking Summary</h2>
                <div className="space-y-4">
                  <div><p className="text-sm text-slate-500">Bus</p><p className="font-medium">{bus.busName}</p></div>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-slate-500">Date</p><p className="font-medium">{new Date(bus.journeyDate).toLocaleDateString()}</p></div>
                    <div className="text-right"><p className="text-sm text-slate-500">Time</p><p className="font-medium">{bus.departureTime}</p></div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm text-slate-500">From</p><p className="font-medium">{bus.source}</p></div>
                    <div className="text-right"><p className="text-sm text-slate-500">To</p><p className="font-medium">{bus.destination}</p></div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Selected Seats ({selectedSeats.length})</p>
                    {selectedSeats.length === 0 ? (
                      <p className="text-slate-500 italic text-sm">No seats selected</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(seat => (
                          <div key={seat.id} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                            {seat.number} (₹{seat.price})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-700">Base Fare</span>
                  <span className="font-medium text-slate-900">₹{totalFare}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-accent-600">₹{totalFare}</span>
                </div>
                <button
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                  className={`w-full mt-6 btn-accent flex items-center justify-center ${selectedSeats.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  Proceed to Payment <ArrowRight size={16} className="ml-2" />
                </button>
                {!user && (
                  <p className="text-sm text-slate-500 mt-4 text-center">
                    <Users size={14} className="inline mr-1" />
                    You need to{' '}
                    <button
                      onClick={() => navigate('/login', { state: { from: location.pathname + location.search } })}
                      className="text-primary-600 hover:text-primary-700 font-medium underline"
                    >
                      login
                    </button>{' '}
                    to continue with booking
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
