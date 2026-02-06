import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BusSearchPage from './pages/BusSearchPage';
import BusListPage from './pages/BusListPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import PassengerDetailsPage from './pages/PassengerDetailsPage';
// User Pages
import UserDashboardPage from './pages/user/UserDashboardPage';
import UserProfilePage from './pages/user/UserProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBusesPage from './pages/admin/AdminBusesPage';
import AdminAddBusPage from './pages/admin/AdminAddBusPage';
import AdminEditBusPage from './pages/admin/AdminEditBusPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminWaitingListPage from './pages/admin/AdminWaitingListPage';
import BookingSummaryPage from './pages/BookingSummaryPage';
import PaymentPage from './pages/PaymentPage';
import MyBookingsPage from './pages/MyBookingsPage';

// Protected Route Components
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="search" element={<BusSearchPage />} />
        <Route path="buses" element={<BusListPage />} />
        <Route path="bus/:busId/seats" element={<SeatSelectionPage />} />
        <Route path="/booking/summary" element={<BookingSummaryPage />} />
        <Route path="/booking/payment" element={<PaymentPage />} />
        <Route path="/booking/passenger" element={<PassengerDetailsPage />} />
        <Route path="/user/mybookings" element={<MyBookingsPage />} />

        <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />

      </Route>
      
      {/* User Routes */}
      <Route 
        path="/user" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<UserDashboardPage />} />
        <Route path="profile" element={<UserProfilePage />} />
      </Route>
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="buses" element={<AdminBusesPage />} />
        <Route path="buses/add" element={<AdminAddBusPage />} />
        <Route path="buses/edit/:busId" element={<AdminEditBusPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="waiting-list" element={<AdminWaitingListPage />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;