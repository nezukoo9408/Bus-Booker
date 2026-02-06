import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: ''
  });
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    current: '',
    new: '',
    confirm: ''
  });
  
  useEffect(() => {
    // Set initial profile from user context
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: '' // Assuming phone is not part of the basic user object
      });
    }
  }, [user]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
    
    // Clear error on change
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
    
    // Clear error on change
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateProfileForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      current: '',
      new: '',
      confirm: ''
    };
    
    let valid = true;
    
    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    if (profile.phone && !/^\d{10}$/.test(profile.phone)) {
      newErrors.phone = 'Phone should be 10 digits';
      valid = false;
    }
    
    setErrors({...errors, ...newErrors});
    return valid;
  };
  
  const validatePasswordForm = (): boolean => {
    const newErrors = {
      current: '',
      new: '',
      confirm: ''
    };
    
    let valid = true;
    
    if (!passwords.current) {
      newErrors.current = 'Current password is required';
      valid = false;
    }
    
    if (!passwords.new) {
      newErrors.new = 'New password is required';
      valid = false;
    } else if (passwords.new.length < 6) {
      newErrors.new = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (!passwords.confirm) {
      newErrors.confirm = 'Please confirm your new password';
      valid = false;
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match';
      valid = false;
    }
    
    setErrors({...errors, ...newErrors});
    return valid;
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsUpdatingProfile(true);
    
    try {
      // In a real app, this would be an API call to update the user profile
      // For now, we'll just simulate a delay and show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // In a real app, this would be an API call to change the password
      // For now, we'll just simulate a delay and show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password changed successfully');
      
      // Reset password fields
      setPasswords({
        current: '',
        new: '',
        confirm: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Profile Information</h2>
            
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-input pl-10 ${errors.name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="Enter your full name"
                      value={profile.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-input pl-10 ${errors.email ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="Enter your email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-input pl-10 ${errors.phone ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="Enter your phone number"
                      value={profile.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                  <p className="text-sm text-slate-500 mt-1">
                    For notifications about your bookings
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className={`btn-primary flex items-center ${isUpdatingProfile ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isUpdatingProfile ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Change Password */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Change Password</h2>
            
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="current" className="form-label">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      id="current"
                      name="current"
                      className={`form-input pl-10 ${errors.current ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  {errors.current && <p className="form-error">{errors.current}</p>}
                </div>
                
                <div>
                  <label htmlFor="new" className="form-label">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      id="new"
                      name="new"
                      className={`form-input pl-10 ${errors.new ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="Enter new password"
                      value={passwords.new}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  {errors.new && <p className="form-error">{errors.new}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirm" className="form-label">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      id="confirm"
                      name="confirm"
                      className={`form-input pl-10 ${errors.confirm ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="Confirm new password"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  {errors.confirm && <p className="form-error">{errors.confirm}</p>}
                </div>
                
                <div className="bg-primary-50 p-4 rounded-md mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                    <p className="text-sm text-primary-700">
                      Password must be at least 6 characters and include a mix of letters, numbers, and symbols for stronger security.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className={`btn-primary w-full flex items-center justify-center ${isChangingPassword ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isChangingPassword ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 mt-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Account Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium text-slate-900">Two-factor authentication</p>
                  <p className="text-slate-500">Add an extra layer of security</p>
                </div>
                <button className="btn-outline btn-sm">Enable</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium text-slate-900">Login activity</p>
                  <p className="text-slate-500">View recent login sessions</p>
                </div>
                <button className="btn-outline btn-sm">View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;