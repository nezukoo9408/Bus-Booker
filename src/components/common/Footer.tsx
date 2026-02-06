import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 text-white">
              <Bus size={28} />
              <span className="text-xl font-bold">BusBooker</span>
            </Link>
            <p className="mt-4 text-slate-400 text-sm">
              Book bus tickets online for safe and comfortable journeys across 
              the country. Thousands of routes, transparent pricing, and 24/7 support.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white text-sm">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-slate-400 hover:text-white text-sm">Find Buses</Link>
              </li>
              <li>
                <Link to="/user/bookings" className="text-slate-400 hover:text-white text-sm">My Bookings</Link>
              </li>
              <li>
                <Link to="/user/profile" className="text-slate-400 hover:text-white text-sm">My Account</Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">About Us</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">Contact Us</a>
              </li>
            </ul>
          </div>
          
          {/* Popular Routes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Routes</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">New York to Washington</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">Los Angeles to San Francisco</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">Chicago to Detroit</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">Miami to Orlando</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">Dallas to Houston</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">Seattle to Portland</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-primary-400 mt-1 mr-2" />
                <span className="text-slate-400 text-sm">
                  123 Main Street, New York, NY 10001, USA
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-primary-400 mr-2" />
                <span className="text-slate-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-primary-400 mr-2" />
                <span className="text-slate-400 text-sm">support@busbooker.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} BusBooker. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-white text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-slate-400 hover:text-white text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;