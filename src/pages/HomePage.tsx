import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bus, Calendar, CheckCircle, MapPin, Shield, Star, Users } from 'lucide-react';
import SearchForm from '../components/search/SearchForm';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Bus size={24} className="text-primary-500" />,
      title: "Wide Selection of Buses",
      description: "Choose from thousands of buses on diverse routes across the country"
    },
    {
      icon: <Shield size={24} className="text-primary-500" />,
      title: "Secure Bookings",
      description: "Guaranteed confirmations and secure payment options"
    },
    {
      icon: <CheckCircle size={24} className="text-primary-500" />,
      title: "Instant Confirmations",
      description: "Get your tickets instantly after booking confirmation"
    },
    {
      icon: <Calendar size={24} className="text-primary-500" />,
      title: "Flexible Scheduling",
      description: "Easy rescheduling and cancellation options"
    }
  ];
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frequent Traveler",
      quote: "BusBooker has made traveling so much easier. The seat selection feature is fantastic, and I love how I can see exactly which seats are available."
    },
    {
      name: "Michael Chen",
      role: "Business Traveler",
      quote: "I use BusBooker for all my business trips. The interface is clean, bookings are fast, and customer service is excellent when I need to make changes."
    },
    {
      name: "Emily Rodriguez",
      role: "Student",
      quote: "As a student who travels home often, I appreciate the affordable options and the waiting list feature when buses are full. It's saved me many times!"
    }
  ];
  
  const popularRoutes = [
    { from: "New York", to: "Washington D.C.", price: 45 },
    { from: "Los Angeles", to: "San Francisco", price: 65 },
    { from: "Chicago", to: "Detroit", price: 35 },
    { from: "Miami", to: "Orlando", price: 29 },
    { from: "Dallas", to: "Houston", price: 25 },
    { from: "Seattle", to: "Portland", price: 30 }
  ];
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/69866/pexels-photo-69866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                Book Bus Tickets Online with Ease
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Find and book bus tickets for thousands of routes across the country.
                Compare prices, select your seats, and enjoy a hassle-free journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/search" className="btn-accent btn-lg">
                  Book Now
                </Link>
                <a href="#how-it-works" className="btn bg-white/10 text-white hover:bg-white/20 btn-lg">
                  Learn More
                </a>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white rounded-lg shadow-xl p-6 transform transition duration-500 hover:scale-105">
                <h2 className="text-xl font-bold text-primary-900 mb-4">
                  Find Your Bus
                </h2>
                <SearchForm />
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L80,106.7C160,117,320,139,480,138.7C640,139,800,117,960,112C1120,107,1280,117,1360,122.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Why Choose BusBooker
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              We're committed to making your bus travel experience simple, 
              convenient, and enjoyable from booking to arrival.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/search" 
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              Search available buses <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Popular Routes Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Popular Routes
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Discover our most popular bus routes with competitive prices and frequent departures
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md border border-slate-100 p-6 transition-all duration-300 flex flex-col" 
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
                  to={`/search?from=${route.from}&to=${route.to}`}
                  className="mt-auto btn-primary w-full"
                >
                  View Buses
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/search" className="btn-outline">
              View All Routes
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                How BusBooker Works
              </h2>
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 text-xl font-bold">
                    1
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Search for buses
                    </h3>
                    <p className="text-slate-600">
                      Enter your origin, destination, and travel date to find available buses.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 text-xl font-bold">
                    2
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Select your seats
                    </h3>
                    <p className="text-slate-600">
                      Browse through the available buses, compare amenities and prices, and select your preferred seats.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 text-xl font-bold">
                    3
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Make payment
                    </h3>
                    <p className="text-slate-600">
                      Pay securely using your preferred payment method.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 text-xl font-bold">
                    4
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Get your e-ticket
                    </h3>
                    <p className="text-slate-600">
                      Receive your booking confirmation and e-ticket instantly via email and in your account.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/search" className="btn-primary">
                  Book Your Trip Now
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 relative">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Luxury bus interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                </div>
                <p className="text-sm font-medium text-slate-900 mt-1">Rated 4.8/5 by our customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what travelers think about BusBooker.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm p-6 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center space-x-1 mb-4">
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                </div>
                <blockquote className="text-slate-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book Your Next Journey?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied travelers who book with BusBooker every day.
            Find the perfect bus for your next trip now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/search" className="btn-accent btn-lg">
              Book a Bus
            </Link>
            <Link to="/register" className="btn bg-white/10 text-white hover:bg-white/20 btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;