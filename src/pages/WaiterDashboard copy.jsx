import React from 'react';
import Navbar from '../components/Navbar';
import LogoutButton from '../components/LogoutButton';

function WaiterDashboard() {
  return (
    <>
      <Navbar />
      <div className="pt-40 text-center">
        <h1 className="text-4xl font-bold mb-4">Waiter Dashboard</h1>
        <p className="text-lg">
          Take new orders and manage assigned tables here.
        </p>
        <div className="mt-20">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}

export default WaiterDashboard;
