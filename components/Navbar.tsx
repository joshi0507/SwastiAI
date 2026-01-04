
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                S+
              </div>
              <span className="text-2xl font-bold font-heading text-slate-900">SwasthAI</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-slate-600 hover:text-sky-600 px-3 py-2 text-sm font-medium transition">Home</Link>
              <Link to="/about" className="text-slate-600 hover:text-sky-600 px-3 py-2 text-sm font-medium transition">About Us</Link>
              {user && (
                <Link to="/dashboard" className="text-slate-600 hover:text-sky-600 px-3 py-2 text-sm font-medium transition">Dashboard</Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-900">{user.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</span>
                </div>
                <button 
                  onClick={() => {
                    onLogout();
                    navigate('/');
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-sky-600 px-3 py-2 text-sm font-medium transition">Login</Link>
                <Link to="/signup" className="bg-sky-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-sky-700 transition shadow-lg shadow-sky-200">
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
