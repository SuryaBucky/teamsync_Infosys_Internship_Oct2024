import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';

const Dashboard = () => {
  return (
    <div className='flex'>
      {/* Sidebar */}
      <div className='w-56'>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-y-auto h-screen'>
        <Hero />
      </div>
    </div>
  );
};

export default Dashboard;
