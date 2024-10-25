import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Golf, Trophy, UserCircle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Golf className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-800">Golf Pool Pro</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/entry"
              className={`flex items-center space-x-1 ${
                isActive('/entry')
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-green-500'
              }`}
            >
              <Golf className="w-5 h-5" />
              <span>Enter Pool</span>
            </Link>

            <Link
              to="/leaderboard"
              className={`flex items-center space-x-1 ${
                isActive('/leaderboard')
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-green-500'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
            </Link>

            {user && (
              <Link
                to="/profile"
                className={`flex items-center space-x-1 ${
                  isActive('/profile')
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                <UserCircle className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1 ${
                  isActive('/admin')
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;