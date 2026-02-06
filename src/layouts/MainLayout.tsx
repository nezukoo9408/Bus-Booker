import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from '../components/navigation/MainNavbar';
import Footer from '../components/common/Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;