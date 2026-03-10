import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SignInModal from '../components/SignInModal';

const Header = () => {
  const location = useLocation();
  const [currentProvider, setCurrentProvider] = useState('thenewsapi');
  const [articleCount, setArticleCount] = useState('0');
  const [showModal, setShowModal] = useState(false); // Local modal state for voluntary open
  
  const { isLoggedIn, userEmail, triggerSignInModal, signOut } = useAuth();
  
  // Listen for provider changes from HomePage
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentProvider(localStorage.getItem('newsProvider') || 'thenewsapi');
      setArticleCount(localStorage.getItem('articleCount') || '0');
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also check on mount
    handleStorageChange();
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getProviderBadge = (provider) => {
    const badges = {
      thenewsapi: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', emoji: '🔵', name: 'TheNewsAPI' },
      newsdata: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', emoji: '🟢', name: 'NewsData.io' },
      worldnewsapi: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', emoji: '🟡', name: 'WorldNewsAPI' },
      newsapiorg: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', emoji: '🟣', name: 'NewsAPI.org' },
    };
    return badges[provider] || badges.thenewsapi;
  };

  const handleProviderChange = (e) => {
    const newProv = e.target.value;
    console.log('[Header] changing provider to', newProv);
    localStorage.setItem('newsProvider', newProv);
    setCurrentProvider(newProv);
    // dispatch a storage event manually so same-window listeners (like HomePage) pick it up
    window.dispatchEvent(new StorageEvent('storage', { key: 'newsProvider', newValue: newProv }));
  };

  const handleSignInClick = () => {
    triggerSignInModal(false); // Voluntary, not forced
  };

  const badge = getProviderBadge(currentProvider);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40 border-b-2 border-blue-500 dark:border-blue-600">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition">
            📰 News Reader
          </Link>
          
          {/* API Status Bar - Shows on all pages */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Articles Count */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-lg">📊</span>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Articles Loaded</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{articleCount}</span>
              </div>
            </div>
            
            {/* Provider selector + badge */}
            <div className="flex items-center gap-2">
                <select
                  value={currentProvider}
                  onChange={handleProviderChange}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none"
                >
                  <option value="thenewsapi">🔵 TheNewsAPI</option>
                  <option value="newsdata">🟢 NewsData.io</option>
                  <option value="worldnewsapi">🟡 WorldNewsAPI</option>
                  <option value="newsapiorg">🟣 NewsAPI.org</option>
                </select>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${badge.color} shadow-sm`}> 
                  <span className="text-lg">{badge.emoji}</span>
                  <div className="flex flex-col">
                    <span className="text-xs opacity-75">Active Provider</span>
                    <span>{badge.name}</span>
                  </div>
                </div>
              </div>
          </div>

          {/* Right side - Sign-in / Welcome */}
          <div className="flex items-center gap-2">
          {/* Right side - Sign-in / Welcome / Logout */}
<div className="flex items-center gap-4">
  {isLoggedIn ? (
    <>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Hi, {userEmail.split('@')[0]}
      </span>
      
      <button 
        onClick={signOut}  // This comes from useAuth()
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
      >
        Sign Out
      </button>
    </>
  ) : (
    <button 
      onClick={handleSignInClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
    >
      Sign In
    </button>
  )}
</div>
        </div>
        </div>

        {/* Navigation */}
        <nav className="py-3 border-t border-gray-100 dark:border-gray-800 flex gap-2 md:gap-6 overflow-x-auto pb-2 md:pb-0">
          <Link 
            to="/" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname === '/' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            🏠 Home
          </Link>
          <Link 
            to="/category/general" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('general') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            📰 General
          </Link>
          <Link 
            to="/category/business" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('business') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            💼 Business
          </Link>
          <Link 
            to="/category/technology" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('technology') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            🔧 Tech
          </Link>
          <Link 
            to="/category/sports" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('sports') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            ⚽ Sports
          </Link>
          <Link 
            to="/category/entertainment" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            🎬 Entertainment
          </Link>
           <Link 
            to="" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            
          </Link>
           <Link 
            to="" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            
          </Link>
           <Link 
            to="" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            
          </Link>
           <Link 
            to="" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            
          </Link>
           <Link 
            to="" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            
          </Link>
           <Link 
            to="" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            
          </Link>
           <Link 
            to="" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            
          </Link>
           <Link 
            to="" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            
          </Link>
           <Link 
            to="" 
            className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            
          </Link>
         
         
          <Link 
        to="/history" 
        className={`whitespace-nowrap px-4 py-2 rounded transition ${
              location.pathname.includes('entertainment') 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
       📜 My History
      </Link>
        </nav>
      </div>
      
    </header>
  );
};

export default Header;