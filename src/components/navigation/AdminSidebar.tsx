import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bus, 
  LayoutDashboard, 
  CalendarCheck, 
  ClipboardList, 
  Users, 
  LogOut, 
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Buses', href: '/admin/buses', icon: Bus },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Waiting List', href: '/admin/waiting-list', icon: ClipboardList },
  ];
  
  const sidebarClasses = `
    flex-1 flex flex-col min-h-0 bg-primary-800 text-white
    ${isOpen ? 'transform-none' : '-translate-x-full md:translate-x-0'}
    transition-transform duration-300 ease-in-out
    fixed inset-0 z-40 md:static
  `;
  
  return (
    <div className={sidebarClasses}>
      {/* Mobile close button */}
      <div className="md:hidden absolute top-0 right-0 pt-2 pr-2">
        <button
          onClick={onClose}
          className="text-white hover:text-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Sidebar header */}
      <div className="flex items-center px-4 py-6 bg-primary-900">
        <Bus size={32} className="text-primary-200" />
        <div className="ml-3">
          <h2 className="text-xl font-bold text-white">BusBooker</h2>
          <p className="text-sm text-primary-300">Admin Panel</p>
        </div>
      </div>
      
      {/* Admin info */}
      <div className="border-t border-b border-primary-700 py-4 px-4">
        <div className="flex items-center">
          <div className="bg-primary-700 rounded-full w-10 h-10 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-primary-300">{user?.email}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => 
              `${isActive 
                ? 'bg-primary-700 text-white' 
                : 'text-primary-200 hover:bg-primary-700 hover:text-white'
              } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t border-primary-700">
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-3 text-sm font-medium text-primary-200 rounded-md hover:bg-primary-700 hover:text-white transition-colors duration-150"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;