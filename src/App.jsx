import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
//import reactLogo from './assets/react.svg';
//import viteLogo from '/vite.svg';
//import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ Main page is now Home */}
        <Route path="/menu" element={<Menu />} /> {/* Menu page */}
        <Route path="*" element={<Home />} />{' '}
        {/* ✅ Redirect all unknown paths to Home */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

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
