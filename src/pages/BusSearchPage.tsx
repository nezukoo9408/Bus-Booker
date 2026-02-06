import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, ArrowRight, CheckCircle, Calendar, MapPin } from 'lucide-react';
import SearchForm from '../components/search/SearchForm';

const BusSearchPage: React.FC = () => {
  const popularRoutes = [
    { from: "New York", to: "Washington D.C.", price: 45 },
    { from: "Los Angeles", to: "San Francisco", price: 65 },
    { from: "Chicago", to: "Detroit", price: 35 },
    { from: "Miami", to: "Orlando", price: 29 },
    { from: "Dallas", to: "Houston", price: 25 },
    { from: "Seattle", to: "Portland", price: 30 }
  ];
  
  const benefits = [
    {
      icon: <Bus size={24} className="text-primary-500" />,
      title: "Comprehensive Selection",
      description: "Access to thousands of buses across all major routes"
    },
    {
      icon: <Calendar size={24} className="text-primary-500" />,
      title: "Flexible Scheduling",
      description: "Multiple departures to fit your travel plans"
    },
    {
      icon: <MapPin size={24} className="text-primary-500" />,
      title: "Live Tracking",
      description: "Real-time updates on bus location and arrival times"
    },
    {
      icon: <CheckCircle size={24} className="text-primary-500" />,
      title: "Secure Bookings",
      description: "Instant confirmations and secure payment options"
    }
  ];
  
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero section */}
      <div className="bg-primary-700 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Find and Book Your Perfect Bus Journey
            </h1>
            <p className="text-lg text-primary-100 mb-8">
              Compare prices, select your seats, and travel with confidence.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto transform transition duration-500 hover:scale-[1.02]">
            <h2 className="text-xl font-bold text-primary-900 mb-4">
              Search for Buses
            </h2>
            <SearchForm />
          </div>
        </div>
      </div>
      
      {/* Popular routes section */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Popular Routes
            </h2>
            <p className="mt-2 text-slate-600">
              Find the best deals on our most traveled routes
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm hover:shadow-md border border-slate-100 p-6 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <MapPin size={18} className="text-primary-500 mr-2" />
                      <span className="text-slate-900 font-medium">{route.from}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={18} className="text-accent-500 mr-2" />
                      <span className="text-slate-900 font-medium">{route.to}</span>
                    </div>
                  </div>
                  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ${route.price}+
                  </div>
                </div>
                <Link
                  to={`/buses?from=${route.from}&to=${route.to}`}
                  className="mt-auto btn-primary w-full flex items-center justify-center"
                >
                  <span>View Buses</span>
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Benefits section */}
      <div className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Why Book With BusBooker
            </h2>
            <p className="mt-2 text-slate-600 max-w-3xl mx-auto">
              We're committed to making your bus travel experience simple, convenient, and enjoyable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Book Your Next Journey?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied travelers who book with BusBooker every day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/search" className="btn-accent btn-lg">
              Search Buses
            </Link>
            <Link to="/register" className="btn bg-white/10 text-white hover:bg-white/20 btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSearchPage;