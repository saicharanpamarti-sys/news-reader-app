import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchNews } from '../utils/api';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [provider, setProvider] = useState(import.meta.env.VITE_NEWS_PROVIDER || 'thenewsapi');
  const [debugInfo, setDebugInfo] = useState('');

  // Log API keys on mount
  useEffect(() => {
    const debug = `
      Provider: ${provider}
      VITE_THENEWSAPI_KEY: ${import.meta.env.VITE_THENEWSAPI_KEY ? 'Loaded' : 'NOT FOUND'}
      VITE_NEWSDATA_KEY: ${import.meta.env.VITE_NEWSDATA_KEY ? 'Loaded' : 'NOT FOUND'}
      VITE_NEWSAPIORG_KEY: ${import.meta.env.VITE_NEWSAPIORG_KEY ? 'Loaded' : 'NOT FOUND'}
      VITE_GNEWS_KEY: ${import.meta.env.VITE_GNEWS_KEY ? 'Loaded' : 'NOT FOUND'}
    `;
    setDebugInfo(debug);
    console.log(debug);
  }, [provider]);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedArticles = await fetchNews({
          search: searchQuery,
          limit: 9,
          provider: provider,
        });
        console.log('Fetched articles:', fetchedArticles);
        setArticles(fetchedArticles);
        if (fetchedArticles.length === 0) {
          setError('No articles found. Please check your API key or try a different search.');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
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

  const handleProviderChange = (e) => {
    setProvider(e.target.value);
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
            Discover the Latest News
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Stay informed with top headlines from around the world — curated, fast, and personalized.
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news by keyword (e.g., tech, sports, India...)"
                className="w-full px-6 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white shadow-md"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
            
            <div className="mt-6">
              <label className="text-gray-700 dark:text-gray-300 mr-3 font-semibold">
                Select News Provider:
              </label>
              <select
                value={provider}
                onChange={handleProviderChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="thenewsapi">TheNewsAPI</option>
                <option value="newsdata">NewsData.io</option>
                <option value="newsapiorg">NewsAPI.org</option>
                <option value="gnews">GNews</option>
              </select>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left max-w-3xl mx-auto">
            <p className="font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {debugInfo}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            {searchQuery ? `Results for "${searchQuery}"` : 'Top Headlines'}
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : articles.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300 text-xl">
              No articles found. Try a different search or check the API key in the .env file!
            </p>
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