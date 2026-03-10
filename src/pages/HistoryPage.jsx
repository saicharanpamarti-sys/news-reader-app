import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserHistory } from '../hooks/useUserHistory';
import ArticleCard from '../components/ArticleCard';
import { Link } from 'react-router-dom';

const formatTimeSpent = (ms) => {
  if (!ms || ms < 1000) return 'just viewed';
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec} sec`;
  const min = Math.floor(sec / 60);
  const remainingSec = sec % 60;
  return remainingSec > 0 ? `${min} min ${remainingSec} sec` : `${min} min`;
};

const HistoryPage = () => {
  const { userEmail, isLoggedIn } = useAuth();
  const { history } = useUserHistory(userEmail);

  if (!isLoggedIn) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Sign in to view history</h2>
        <Link to="/" className="text-blue-600 hover:underline">← Back to News</Link>
      </div>
    );
  }

  // Prepare articles for cards + add extra info
  const historyArticles = history.map(item => ({
    uuid: item.id,
    title: item.title,
    description: item.desc || 'From your reading history',
    url: item.externalUrl || item.url || '#',
    image_url: item.image_url || null,
    published_at: item.viewedAt,
    source: item.category || item.source || 'Your History',
    extra: item.timeSpent ? (
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        ⏱️ {formatTimeSpent(item.timeSpent)} • {new Date(item.viewedAt).toLocaleDateString()}
      </div>
    ) : null,
  }));

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          📜 My Reading History
        </h1>

        {history.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <div className="grid place-items-center gap-4">
              <span className="text-6xl">📖</span>
              <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                No reads yet
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Articles you spend time on will appear here.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Start Reading
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
              {history.length} article{history.length !== 1 ? 's' : ''} • most recent first
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {historyArticles.map((article) => (
                <ArticleCard 
                  key={article.uuid} 
                  article={article} 
                  extraInfo={article.extra} // we'll use this prop next
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;