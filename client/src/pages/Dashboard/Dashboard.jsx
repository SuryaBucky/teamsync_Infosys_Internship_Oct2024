import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';

const Dashboard = () => {
  return (
    <div className='grid grid-cols-12'>
      {/* <Navbar /> */}

      <div className='col-span-2'><Sidebar /></div>
      <div className='col-span-10'><Hero /></div>
    </div>
  );
};

export default Dashboard;
