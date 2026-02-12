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
        console.log("✅ Bus fetched:", data);
        console.log("🔍 Bus structure:", {
          _id: data._id,
          busName: data.busName,
          hasTwoDecks: data.hasTwoDecks,
          totalSeats: data.totalSeats,
          seatsLowerCount: data.seatsLower?.length || 0,
          seatsUpperCount: data.seatsUpper?.length || 0,
          sampleSeats: data.seatsLower?.slice(0, 2).map(s => ({ number: s.number, status: s.status, price: s.price }))
        });
        setBus(data);
        setLoading(false);
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
  // Add ID to each seat using seat number
  const seatsWithId = seats.map(seat => ({ ...seat, id: seat.number }));
  
  const singleSeats = seatsWithId.filter(seat => /^[LU]?\d+A$/.test(seat.number));      // L1A, L2A, L3A, L4A, L5A
  const doubleSeats = seatsWithId.filter(seat => /^[LU]?\d+[BC]$/.test(seat.number));   // L1B, L1C, L2B, L2C, etc.

  console.log(`🪑 Rendering seat layout:`, {
    totalSeats: seats.length,
    seatsWithId: seatsWithId.length,
    singleSeats: singleSeats.length,
    doubleSeats: doubleSeats.length,
    sampleSingle: singleSeats[0]?.number,
    sampleDouble: doubleSeats[0]?.number
  });

  return (
    <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
      {/* Bus layout with proper structure */}
      <div className="space-y-3">
        {/* Row 1: Driver area */}
        <div className="flex items-center justify-between">
          <div className="w-16 h-8 bg-slate-700 rounded text-white text-xs flex items-center justify-center">
            Driver
          </div>
          <div className="flex space-x-2">
            {/* Single seat in first row */}
            {singleSeats[0] && renderSeat(singleSeats[0])}
          </div>
        </div>
        
        {/* Rows 2-5: Single and double seats */}
        {Array.from({ length: 4 }).map((_, i) => {
          const single = singleSeats[i + 1];
          const double1 = doubleSeats[i * 2];
          const double2 = doubleSeats[i * 2 + 1];

          return (
            <div key={i} className="flex items-center justify-between">
              <div className="w-16"></div>
              <div className="flex space-x-2">
                {single && renderSeat(single)}
                <div className="w-4"></div> {/* Aisle */}
                {double1 && renderSeat(double1)}
                {double2 && renderSeat(double2)}
              </div>
            </div>
          );
        })}
        
        {/* Row 6: Last row of double seats */}
        <div className="flex items-center justify-between">
          <div className="w-16"></div>
          <div className="flex space-x-2">
            <div className="w-14"></div> {/* Space where single seat would be */}
            <div className="w-4"></div> {/* Aisle */}
            {doubleSeats[8] && renderSeat(doubleSeats[8])}
            {doubleSeats[9] && renderSeat(doubleSeats[9])}
          </div>
        </div>
      </div>
    </div>
  );
};



const renderSeat = (seat: Seat) => {
  const isSelected = selectedSeats.some(s => s.id === seat.id);
  const isBooked = seat.status === 'booked';
  const isReserved = seat.status === 'reserved';
  const isSingleSeat = seat.number.includes('A'); // Single seats end with A

  let seatStyle = isSingleSeat
    ? 'cursor-pointer w-14 h-10 rounded-lg flex flex-col justify-center items-center text-xs font-medium border shadow-md transition-all duration-200 '
    : 'cursor-pointer w-12 h-12 rounded-md flex flex-col justify-center items-center text-sm font-medium border shadow-sm transition-all duration-200 ';

  // Seat selection styling logic
  if (isSelected) {
    // If selected by female, show pink; otherwise show green
    if (selectedGender === 'female') {
      seatStyle += 'bg-pink-500 text-white border-pink-600'; // Pink for female selection
    } else {
      seatStyle += 'bg-green-600 text-white border-green-700'; // Green for male selection
    }
  } else if (isBooked) {
    // If booked by female, show pink; otherwise show gray
    if (seat.isLadies) {
      seatStyle += 'bg-pink-400 text-white border-pink-600 pointer-events-none'; // Pink for female booked
    } else {
      seatStyle += 'bg-gray-400 text-white border-gray-500 pointer-events-none'; // Gray for male booked
    }
  } else if (isReserved) {
    seatStyle += 'bg-yellow-400 text-white border-yellow-600 pointer-events-none'; // Reserved seats
  } else {
    seatStyle += 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'; // Available seats
  }

  return (
    <div className={seatStyle} onClick={() => toggleSeat(seat)}>
      <span>{seat.number}</span>
      {seat.isLadies && seat.status === 'booked' && <span className="text-[10px] leading-none">F</span>}
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

        {/* Debug deck visibility */}
        <div className="bg-yellow-50 p-2 mb-4 text-sm">
          Debug: hasTwoDecks = {bus.hasTwoDecks?.toString()}, activeDeck = {activeDeck}
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
              
              {/* Debug current deck */}
              <div className="bg-blue-50 p-2 mb-4 text-sm text-center">
                Currently showing: {activeDeck === 'lower' ? 'LOWER DECK' : 'UPPER DECK'} 
                ({activeDeck === 'lower' ? bus.seatsLower?.length || 0 : bus.seatsUpper?.length || 0} seats)
              </div>
              
              <div className="flex flex-wrap justify-center mb-10">
                {activeDeck === 'lower' ? renderSeatLayout(bus.seatsLower || []) : renderSeatLayout(bus.seatsUpper || [])}
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
