import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Types
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
  fare: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  ratings: number;
  hasTwoDecks: boolean;
}

const BusListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const fromParam = queryParams.get('from') || '';
  const toParam = queryParams.get('to') || '';
  const dateParam = queryParams.get('date') || '';

  const [buses, setBuses] = useState<BusType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ''}/api/buses/search?source=${fromParam}&destination=${toParam}&journeyDate=${dateParam}`
        );
        const data = await response.json();
        setBuses(data);
      } catch (err) {
        console.error("Error fetching buses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [fromParam, toParam, dateParam]);

  const formattedDate = dateParam
    ? new Date(dateParam).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Select a date';

  if (loading) {
    return (
      <div className="p-10 text-center">
        <LoadingSpinner />
        <p className="mt-4 text-slate-600">Searching for buses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {fromParam} → {toParam}
        </h1>
        <div className="text-gray-600 flex items-center mt-2">
          <Calendar size={16} className="mr-1" />
          {formattedDate}
        </div>
      </div>

      {buses.length === 0 ? (
        <p className="text-center text-gray-500">No buses found for the selected route.</p>
      ) : (
        <div className="space-y-4">
          {buses.map((bus) => (
            <div
              key={bus._id}
              className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{bus.busName}</h2>
                <p className="text-gray-600 text-sm">
                  {bus.busNumber} • {bus.busType}
                </p>
                <p className="text-sm mt-1">
                  Departure: {bus.departureTime} → Arrival: {bus.arrivalTime}
                </p>
              </div>

              <div className="text-right mt-4 md:mt-0">
                <p className="text-lg font-bold mb-2">₹{bus.fare}</p>
                <Link
                  to={`/bus/${bus._id}/seats?date=${dateParam}`}
                  className="btn-primary inline-flex items-center"
                >
                  Select Seats <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusListPage;
