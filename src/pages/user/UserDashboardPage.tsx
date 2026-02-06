import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  MapPin, 
  TicketCheck, 
  UserCircle,
  Bus,
  Settings,
  Bell,
  Star
} from 'lucide-react';

interface RecentBooking {
  id: string;
  busName: string;
  source: string;
  destination: string;
  journeyDate: string;
  departureTime: string;
  status: 'confirmed' | 'cancelled';
  seatCount: number;
  totalFare: number;
}

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [upcomingTrip, setUpcomingTrip] = useState<RecentBooking | null>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const mockRecentBookings: RecentBooking[] = [
      {
        id: 'BK123456',
        busName: 'Express Voyager',
        source: 'New York',
        destination: 'Washington DC',
        journeyDate: '2025-03-12',
        departureTime: '08:30',
        status: 'confirmed',
        seatCount: 2,
        totalFare: 90
      },
      {
        id: 'BK123455',
        busName: 'City Liner',
        source: 'Boston',
        destination: 'New York',
        journeyDate: '2025-02-28',
        departureTime: '09:15',
        status: 'confirmed',
        seatCount: 1,
        totalFare: 35
      },
      {
        id: 'BK123454',
        busName: 'Night Traveller',
        source: 'Chicago',
        destination: 'Detroit',
        journeyDate: '2025-02-15',
        departureTime: '22:00',
        status: 'cancelled',
        seatCount: 1,
        totalFare: 45
      }
    ];
    
    setRecentBookings(mockRecentBookings);
    
    // Set upcoming trip (the soonest confirmed booking)
    const upcomingBookings = mockRecentBookings.filter(
      booking => booking.status === 'confirmed' && new Date(booking.journeyDate) > new Date()
    );
    
    if (upcomingBookings.length > 0) {
      // Sort by date (ascending) and take the first one
      upcomingBookings.sort((a, b) => 
        new Date(a.journeyDate).getTime() - new Date(b.journeyDate).getTime()
      );
      setUpcomingTrip(upcomingBookings[0]);
    }
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome card */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md p-6 text-white">
           <h2 className="text-xl font-semibold mb-2">
  Welcome back, {(user?.name ?? 'Traveler').split(' ')[0]}!
</h2>

            <p className="opacity-90 mb-4">Ready for your next journey?</p>
            <Link to="/search" className="inline-block px-4 py-2 bg-white text-primary-700 rounded-md font-medium hover:bg-primary-50 transition-colors">
              Book a Trip
            </Link>
          </div>
          
          {/* Upcoming trip card */}
          {upcomingTrip ? (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Your Upcoming Trip</h2>
                <Link to="/user/bookings" className="text-sm text-primary-600 hover:text-primary-700">
                  View all bookings
                </Link>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-slate-900">{upcomingTrip.busName}</h3>
                    <p className="text-sm text-slate-500">Booking ID: {upcomingTrip.id}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="bg-success-100 text-success-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Confirmed
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-primary-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="font-medium text-sm">
                        {new Date(upcomingTrip.journeyDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-primary-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Departure</p>
                      <p className="font-medium text-sm">{upcomingTrip.departureTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TicketCheck className="w-5 h-5 text-primary-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Seats</p>
                      <p className="font-medium text-sm">{upcomingTrip.seatCount} seat(s)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center border-t border-slate-200 pt-4">
                  <div className="flex-1 mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-primary-500 mr-1" />
                      <span className="text-sm font-medium">{upcomingTrip.source}</span>
                      <span className="mx-2 text-slate-400">→</span>
                      <MapPin className="w-4 h-4 text-accent-500 mr-1" />
                      <span className="text-sm font-medium">{upcomingTrip.destination}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/user/bookings`} 
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
              <div className="flex flex-col items-center justify-center py-6">
                <Bus className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">No Upcoming Trips</h3>
                <p className="text-slate-500 text-center mb-4">You don't have any upcoming trips scheduled.</p>
                <Link to="/search" className="btn-primary">
                  Book a Trip Now
                </Link>
              </div>
            </div>
          )}
          
          {/* Recent bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
              <Link to="/user/bookings" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            
            {recentBookings.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {recentBookings.map(booking => (
                  <div key={booking.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-slate-900">{booking.busName}</h3>
                        <p className="text-sm text-slate-500">Booking ID: {booking.id}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        {booking.status === 'confirmed' ? (
                          <span className="bg-success-100 text-success-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Confirmed
                          </span>
                        ) : (
                          <span className="bg-error-100 text-error-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap mt-2">
                      <div className="w-full sm:w-1/2 md:w-1/4 mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-sm text-slate-600">
                            {new Date(booking.journeyDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2 md:w-1/4 mb-2">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-sm text-slate-600">{booking.departureTime}</span>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2 md:w-1/4 mb-2">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-sm text-slate-600">
                            {booking.source} → {booking.destination}
                          </span>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2 md:w-1/4 mb-2">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-sm text-slate-600">${booking.totalFare}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <Link 
                        to={`/user/bookings`} 
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">No booking history found.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* User profile card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xl">
  {(user?.name ?? 'T').charAt(0).toUpperCase()}
</div>

              <div className="ml-4">
                <h2 className="text-lg font-semibold text-slate-900">{user?.name}</h2>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link 
                to="/user/profile" 
                className="flex items-center p-2 rounded-md hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <UserCircle className="w-5 h-5 mr-3 text-primary-500" />
                <span>View Profile</span>
              </Link>
              <Link 
                to="/user/bookings" 
                className="flex items-center p-2 rounded-md hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <TicketCheck className="w-5 h-5 mr-3 text-primary-500" />
                <span>My Bookings</span>
              </Link>
              <Link 
                to="/user/profile" 
                className="flex items-center p-2 rounded-md hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <Settings className="w-5 h-5 mr-3 text-primary-500" />
                <span>Account Settings</span>
              </Link>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/search" className="btn-primary w-full flex justify-center items-center">
                <Bus className="h-4 w-4 mr-2" />
                Book a New Trip
              </Link>
              <Link to="/user/bookings" className="btn-outline w-full flex justify-center items-center">
                <TicketCheck className="h-4 w-4 mr-2" />
                View My Bookings
              </Link>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
              <Link to="#" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <Bell className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-900">Your trip to Washington DC is in 3 days.</p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-success-100 rounded-full p-2 mr-3">
                  <Star className="h-4 w-4 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-900">Rate your recent trip with City Liner.</p>
                  <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
