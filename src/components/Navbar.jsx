// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { useAuth } from '../auth/AuthContext'; // 👈 adjust path if needed

function Navbar() {
  const { user } = useAuth(); // 👈 access auth status

  return (
    <header className="bg-white text-black py-4 shadow-md fixed top-0 w-full z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5">
        <h1 className="text-5xl font-bold text-center flex-grow relative">
          <Link to="/">
            <span className="inline-block px-10 py-[1.15rem] border-2 border-black rounded-full hover:text-orange-500 transition leading-tight">
              DeliciousBites & Coffee
            </span>
          </Link>
        </h1>

        {/* Navigation Links */}
        <nav className="space-x-10 text-lg flex items-center justify-end">
          <Link to="/location" className="hover:text-orange-500 transition">
            Location
          </Link>
          <Link to="/menu" className="hover:text-orange-500 transition">
            Menu
          </Link>
          <Link to="/about" className="hover:text-orange-500 transition">
            About Us
          </Link>

          {/* 👇 Only show Logout if logged in */}
          {user && (
            <div className="ml-6">
              <LogoutButton />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
