import React from 'react';
import Navbar from '../components/Navbar';
import LogoutButton from '../components/LogoutButton';

function AdminDashboard() {
  return (
    <>
      <Navbar />
      <div className="pt-40 text-center">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg">
          Manage the restaurant settings, users, and reports here.
        </p>
        <div className="mt-20">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
