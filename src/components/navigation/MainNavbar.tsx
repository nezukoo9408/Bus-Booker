import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, ChevronDown, Bus, User, LogOut } from 'lucide-react';

const MainNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Using default values to prevent errors if user is undefined or null
  const { user = {}, isAuthenticated = false, logout } = useAuth();
  
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary-600"
          >
            <Bus size={28} />
            <span className="text-xl font-bold">BusBooker</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `${isActive ? 'text-primary-600 font-medium' : 'text-slate-700 hover:text-primary-600'} transition-colors`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/search" 
              className={({ isActive }) => 
                `${isActive ? 'text-primary-600 font-medium' : 'text-slate-700 hover:text-primary-600'} transition-colors`
              }
            >
              Find Buses
            </NavLink>
            {isAuthenticated && (
              <NavLink 
                to="/user/mybookings" 
                className={({ isActive }) => 
                  `${isActive ? 'text-primary-600 font-medium' : 'text-slate-700 hover:text-primary-600'} transition-colors`
                }
              >
                My Bookings
              </NavLink>
            )}
            
            {/* Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 text-slate-700 hover:text-primary-600"
                >
                  <span>Hi, {user?.name ? user.name.split(' ')[0] : 'Guest'}</span>
                  <ChevronDown size={16} />
                </button>
                
                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-slate-200"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/user/dashboard"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-700 hover:text-primary-600">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-slate-200 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `${isActive ? 'text-primary-600 font-medium' : 'text-slate-700'} block py-1`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/search" 
                className={({ isActive }) => 
                  `${isActive ? 'text-primary-600 font-medium' : 'text-slate-700'} block py-1`
                }
              >
                Find Buses
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink 
                    to="/user/bookings" 
                    className={({ isActive }) => 
                      `${isActive ? 'text-primary-600 font-medium' : 'text-slate-700'} block py-1`
                    }
                  >
                    My Bookings
                  </NavLink>
                  <NavLink 
                    to="/user/dashboard" 
                    className={({ isActive }) => 
                      `${isActive ? 'text-primary-600 font-medium' : 'text-slate-700'} block py-1`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    to="/user/profile" 
                    className={({ isActive }) => 
                      `${isActive ? 'text-primary-600 font-medium' : 'text-slate-700'} block py-1`
                    }
                  >
                    Profile
                  </NavLink>
                  {user?.role === 'admin' && (
                    <NavLink 
                      to="/admin/dashboard" 
                      className={({ isActive }) => 
                        `${isActive ? 'text-primary-600 font-medium' : 'text-slate-700'} block py-1`
                      }
                    >
                      Admin Dashboard
                    </NavLink>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center text-slate-700 py-1"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/login" className="btn-outline w-full">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary w-full">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavbar;
