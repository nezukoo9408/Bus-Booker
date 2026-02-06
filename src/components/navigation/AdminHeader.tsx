import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden text-slate-700 hover:text-primary-500 focus:outline-none"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 md:ml-0">
              <h1 className="text-lg font-semibold text-slate-900 mb-0">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">Manage your bus operations</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Notifications */}
            <button
              type="button"
              className="p-1 rounded-full text-slate-500 hover:text-primary-500 focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            
            {/* Profile dropdown */}
            <div className="ml-4 flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:block">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;