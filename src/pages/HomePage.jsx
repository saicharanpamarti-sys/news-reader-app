import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchNews } from '../utils/api';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem('newsProvider') || import.meta.env.VITE_NEWS_PROVIDER || 'thenewsapi';
  });
  // no local category state; header navigation drives category filtering if needed

  const [debugInfo, setDebugInfo] = useState('');
  const { previewExpired, isLoggedIn, triggerSignInModal } = useAuth();

  // Log API keys on mount
  useEffect(() => {
    const debug = `
      Active Provider: ${provider}
      VITE_THENEWSAPI_KEY: ${import.meta.env.VITE_THENEWSAPI_KEY ? '✅ Loaded' : '❌ NOT FOUND'}
      VITE_NEWSDATA_KEY: ${import.meta.env.VITE_NEWSDATA_KEY ? '✅ Loaded' : '❌ NOT FOUND'}
      VITE_WORLDNEWSAPI_KEY: ${import.meta.env.VITE_WORLDNEWSAPI_KEY ? '✅ Loaded' : '❌ NOT FOUND'}
      VITE_NEWSAPIORG_KEY: ${import.meta.env.VITE_NEWSAPIORG_KEY ? '✅ Loaded' : '❌ NOT FOUND'}
    `;
    setDebugInfo(debug);
    console.log(debug);
  }, [provider]);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      console.log(`[HomePage] Fetching news from provider: ${provider}, search: ${searchQuery}`);
      try {
        const fetchedArticles = await fetchNews({
          search: searchQuery,
          limit: 9,
          provider: provider,
        });
        console.log(`[HomePage] Successfully fetched ${fetchedArticles.length} articles from ${provider}`);
        setArticles(fetchedArticles);
        
        // Save to localStorage for navbar display
        localStorage.setItem('newsProvider', provider);
        localStorage.setItem('articleCount', fetchedArticles.length.toString());
        
        if (fetchedArticles.length === 0) {
          setError('No articles found. Try a different search or provider.');
        }
      } catch (err) {
        console.error('[HomePage] Error fetching news:', err);
        setError(`Error: ${err.message}`);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
}, [searchQuery, provider]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // provider state updated via storage events triggered by Header

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'newsProvider') {
        const newProv = e.newValue || import.meta.env.VITE_NEWS_PROVIDER || 'thenewsapi';
        console.log('[HomePage] storage event provider changed to', newProv);
        setProvider(newProv);
        setArticles([]);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // categories are chosen via header links; no handler needed here

  // if preview expired and not logged in, show overlay + trigger modal
  useEffect(() => {
    if (previewExpired && !isLoggedIn) {
      triggerSignInModal(true); // Force modal
    }
  }, [previewExpired, isLoggedIn, triggerSignInModal]);

  const contentOverlay = previewExpired && !isLoggedIn ? (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center max-w-sm">
        <p className="text-gray-700 dark:text-gray-300 mb-4">Preview expired — sign in to continue.</p>
        <button onClick={() => triggerSignInModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
      </div>
    </div>
  ) : null;

  return (
    <div>
      {contentOverlay}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white text-center">
            Discover the Latest News
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-center">
            Stay informed with top headlines from around the world — curated, fast, and personalized.
          </p>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news by keyword (e.g., tech, sports, India...)"
                className="w-full px-6 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white shadow-md"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-semibold"
              >
                Search
              </button>
            </div>
            
            {/* category and provider controls are now located in the header; body remains focused on content */}          </form>

          {/* Debug Information */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left max-w-4xl mx-auto border-l-4 border-blue-500">
            <p className="font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {debugInfo}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            {searchQuery ? `🔍 Results for "${searchQuery}"` : '📰 Top Headlines'}
            <span className="block text-lg text-gray-500 dark:text-gray-400 mt-2">From: {provider.replace('worldnewsapi','WorldNewsAPI').toUpperCase()}</span>
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-xl mb-4">
                No articles found with current filters.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Try a different search or provider.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.uuid} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;