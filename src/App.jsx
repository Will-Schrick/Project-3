import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Location from './pages/Location';
import NotFound from './pages/NotFound';
import PayBill from './pages/PayBill';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import WaiterDashboard from './pages/WaiterDashboard';
import KitchenDashboard from './pages/KitchenDashoard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} /> {/* 404 Page */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/location" element={<Location />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/waiter"
          element={
            <ProtectedRoute allowedRoles={['Waiter']}>
              <WaiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute allowedRoles={['Chef']}>
              <KitchenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paybill"
          element={
            <ProtectedRoute allowedRoles={['Waiter']}>
              <PayBill />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//import reactLogo from './assets/react.svg';
//import viteLogo from '/vite.svg';
//import './App.css';

/* /* 
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </but</Routes>ton>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    */
