import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ArticlePage = () => {
  const location = useLocation();
  const article = location.state?.article;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date not available';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // If no article data is passed, show a friendly message
  if (!article) {
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-8 shadow-md hover:shadow-lg"
        >
          <span>←</span> Back to Home
        </Link>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300 mb-3">
            Article Not Available
          </h2>
          <p className="text-yellow-700 dark:text-yellow-400 mb-4">
            The article data could not be loaded. This might happen if you visited this page directly.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <span>←</span> Go back to browse news
          </Link>
        </div>
      </div>
    );
  }

  const { title, description, snippet, url, image_url, published_at, source } = article;

  return (
    <div className="py-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-8 shadow-md hover:shadow-lg"
      >
        <span>←</span> Back to Home
      </Link>

      {/* Main Article Content */}
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Hero Image */}
        {image_url && (
          <img
            src={image_url}
            alt={title}
            className="w-full h-96 object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-blue-600 rounded-full"></span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{source || 'News Source'}</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span className="text-gray-600 dark:text-gray-400">{formatDate(published_at)}</span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {description || snippet || 'No description available for this article.'}
            </p>
          </div>

          {/* Call to Action */}
          {url && (
            <div className="mt-10">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                <span>Read Full Article on {source || 'Source Site'}</span>
                <span>→</span>
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Opens in a new tab
              </p>
            </div>
          )}
        </div>
      </article>

      {/* Additional Info */}
      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Tip</h3>
        <p className="text-blue-800 dark:text-blue-400 text-sm">
          You can double-click any article card on the home page to open the full article directly in a new tab.
        </p>
      </div>
    </div>
  );
};

export default ArticlePage;