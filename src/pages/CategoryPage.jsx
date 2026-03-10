import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchNews } from '../utils/api';

const CategoryPage = () => {
  const { cat } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem('newsProvider') || import.meta.env.VITE_NEWS_PROVIDER || 'thenewsapi';
  });
  const { previewExpired, isLoggedIn, triggerSignInModal } = useAuth();

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      console.log(`[CategoryPage] Fetching ${cat} articles from provider ${provider}`);
      try {
        const fetchedArticles = await fetchNews({
          category: cat,
          limit: 9,
          provider: provider,
        });
        setArticles(fetchedArticles);
        // update header counters
        localStorage.setItem('newsProvider', provider);
        localStorage.setItem('articleCount', fetchedArticles.length.toString());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (cat) {
      loadNews();
    }
  }, [cat, provider]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // respond to provider change events from header
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'newsProvider') {
        const newProv = e.newValue || import.meta.env.VITE_NEWS_PROVIDER || 'thenewsapi';
        console.log('[CategoryPage] provider changed to', newProv);
        setProvider(newProv);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          {capitalize(cat)} News
        </h1>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : articles.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-xl">
            No {cat} articles found at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.uuid} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;