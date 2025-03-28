// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="bg-white text-black py-4 shadow-md fixed top-0 w-full z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5">
        <h1 className="text-5xl font-bold text-center flex-grow relative">
          <span className="inline-block px-10 py-4 border-2 border-black rounded-full">
            DeliciousBites & Coffee
          </span>
        </h1>

        <div className="flex-grow"></div>

        <nav className="space-x-10 text-lg flex justify-end">
          <Link to="/location" className="hover:text-orange-500 transition">
            Location
          </Link>
          <Link to="/menu" className="hover:text-orange-500 transition">
            Menu
          </Link>
          <Link to="/about" className="hover:text-orange-500 transition">
            About Us
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
