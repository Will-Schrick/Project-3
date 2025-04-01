import React from 'react';
import Navbar from '../components/Navbar';
import LogoutButton from '../components/LogoutButton';

function KitchenDashboard() {
  return (
    <>
      <Navbar />
      <div className="pt-40 text-center">
        <h1 className="text-4xl font-bold mb-4">Kitchen Dashboard</h1>
        <p className="text-lg">
          This is where the chef will see incoming orders.
        </p>
      </div>
    </>
  );
}

export default KitchenDashboard;
