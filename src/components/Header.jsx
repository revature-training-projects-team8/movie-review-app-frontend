import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-primary-400 hover:text-primary-300 transition-colors">
            <Film className="w-8 h-8" />
            <span>MovieReview</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link 
                to="/profile" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                My Reviews
              </Link>
            )}
            <Link 
              to="/admin" 
              className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            >
              🔧 Admin
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center text-primary-300 bg-gray-800 px-3 py-2 rounded-lg">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors font-semibold"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Log In</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-primary-300 hover:text-primary-100 font-medium transition-colors border border-primary-600 hover:border-primary-400 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/admin" 
              className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            >
              🔧 Admin
            </Link>
            {isAuthenticated && (
              <Link 
                to="/profile" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                My Reviews
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;