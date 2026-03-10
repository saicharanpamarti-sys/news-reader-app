// Import React and Link from react-router-dom
import React from 'react';
import { Link } from 'react-router-dom';

// Added extraInfo = null in props
const ArticleCard = ({ article, extraInfo = null }) => {

  // Destructure article properties
  const { uuid, title, description, snippet, url, image_url, published_at, source } = article || {};

  // Function to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date unavailable';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Double click handler to open article in new tab
  const handleDoubleClick = () => {
    if (url) {
      window.open(url, '_blank');

      // Dispatch custom event for history tracking with a normalized id field
      const historyEvent = new CustomEvent('articleVisited', {
        detail: {
          id: article.id || article.uuid || article.url,
          ...article,
          externalUrl: url,
        },
      });

      window.dispatchEvent(historyEvent);
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onDoubleClick={handleDoubleClick}
      title="Double-click to open full article"
    >

      {/* Article Image */}
      {image_url && (
        <img
          src={image_url}
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}

      <div className="p-5">

        {/* Article Title */}
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
          {title || 'Untitled'}
        </h3>

        {/* Article Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
          {description || snippet || 'No description available.'}
        </p>

        {/* Source and Date */}
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{source || 'Unknown'}</span>
          <span>{formatDate(published_at)}</span>
        </div>

        {/* Extra Info Section (NEW FEATURE) */}
        {extraInfo && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
            {extraInfo}
          </div>
        )}

        {/* Read More Button */}
        <Link
          to={`/article/${uuid}`}
          state={{ article }}
          className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Read more →
        </Link>

      </div>
    </div>
  );
};

// Export component
export default ArticleCard;