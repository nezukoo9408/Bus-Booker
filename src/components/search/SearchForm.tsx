import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Search, Calendar, MapPin } from 'lucide-react';

const SearchForm: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [errors, setErrors] = useState({
    from: '',
    to: '',
    date: ''
  });
  
  const navigate = useNavigate();
  
  // Mock popular cities for demo
  const popularCities = [
    "Bangalore", "Mysore", "Hubli", "Belgaum", "Mangalore",
    "Udupi", "Shimoga", "Davangere", "Gulbarga", "Bellary",
    "Hospet", "Chikmangaluru", "Hassan", "Tumkur", "Raichur","Bijapur","Karwar","Bidar","Mandya","Kolar"
  ];
  
  const validateForm = (): boolean => {
    const newErrors = {
      from: '',
      to: '',
      date: ''
    };
    
    let isValid = true;
    
    if (!from.trim()) {
      newErrors.from = 'Origin city is required';
      isValid = false;
    }
    
    if (!to.trim()) {
      newErrors.to = 'Destination city is required';
      isValid = false;
    }
    
    if (from.trim() && to.trim() && from.trim() === to.trim()) {
      newErrors.to = 'Origin and destination cannot be the same';
      isValid = false;
    }
    
    if (!date) {
      newErrors.date = 'Travel date is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      navigate(`/buses?from=${from}&to=${to}&date=${date?.toISOString().split('T')[0]}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="from" className="form-label flex items-center">
          <MapPin size={16} className="mr-1" />
          From
        </label>
        <input
          id="from"
          type="text"
          className="form-input text-black bg-white border border-gray-300"
          placeholder="Enter origin city"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          list="from-cities"
        />
        <datalist id="from-cities">
          {popularCities.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
        {errors.from && <p className="form-error">{errors.from}</p>}
      </div>
      
      <div>
        <label htmlFor="to" className="form-label flex items-center">
          <MapPin size={16} className="mr-1" />
          To
        </label>
        <input
          id="to"
          type="text"
          className="form-input text-black bg-white border border-gray-300"
          placeholder="Enter destination city"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          list="to-cities"
        />
        <datalist id="to-cities">
          {popularCities.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
        {errors.to && <p className="form-error">{errors.to}</p>}
      </div>
      
      <div>
        <label htmlFor="date" className="form-label flex items-center">
          <Calendar size={16} className="mr-1" />
          Travel Date
        </label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          minDate={new Date()}
          dateFormat="MMMM d, yyyy"
          className="form-input text-black bg-white border border-gray-300"
          placeholderText="Select date"
        />
        {errors.date && <p className="form-error">{errors.date}</p>}
      </div>
      
      <button type="submit" className="btn-accent w-full flex items-center justify-center">
        <Search size={18} className="mr-2" />
        Search Buses
      </button>
    </form>
  );
};

export default SearchForm;