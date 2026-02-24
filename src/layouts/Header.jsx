import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn, userEmail, signIn, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignIn = ({ email }) => {
    signIn(email);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          News Reader
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <Link to="/category/general" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            General
          </Link>
          <Link to="/category/business" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Business
          </Link>
          <Link to="/category/tech" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Tech
          </Link>
          <Link to="/category/sports" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Sports
          </Link>
        </nav>

        <div>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">Welcome, {userEmail.split('@')[0]}</span>
              <button
                onClick={signOut}
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <SignInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSignIn={handleSignIn}
      />
    </header>
  );
};

export default Header;