import { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { useAuth } from '../auth/AuthContext';

function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white text-black py-4 shadow-md fixed top-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl sm:text-3xl font-bold">
          <Link to="/">
            <span className="inline-block px-4 py-2 border-2 border-black rounded-full hover:text-orange-500 transition leading-tight">
              DeliciousBites & Coffee
            </span>
          </Link>
        </h1>

        {/* Hamburger Button */}
        <button
          className="sm:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>

        {/* Navigation Links - Desktop */}
        <nav className="hidden sm:flex space-x-8 text-lg items-center">
          <Link to="/location" className="hover:text-orange-500 transition">
            Location
          </Link>
          <Link to="/menu" className="hover:text-orange-500 transition">
            Menu
          </Link>
          <Link to="/about" className="hover:text-orange-500 transition">
            About
          </Link>
          {user && <LogoutButton />}
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-5 mt-2 space-y-2 text-center text-lg">
          <Link
            to="/location"
            className="block hover:text-orange-500 transition"
          >
            Location
          </Link>
          <Link to="/menu" className="block hover:text-orange-500 transition">
            Menu
          </Link>
          <Link to="/about" className="block hover:text-orange-500 transition">
            About
          </Link>
          {user && (
            <div className="pt-2">
              <LogoutButton />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
