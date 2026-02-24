import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const { uuid, title, description, snippet, url, image_url, published_at, source } = article;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleDoubleClick = () => {
    // Open full article in new tab on double click
    if (url) window.open(url, '_blank');
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onDoubleClick={handleDoubleClick}
      title="Double-click to open full article"
    >
      {image_url && (
        <img
          src={image_url}
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
          {description || snippet || 'No description available.'}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{source}</span>
          <span>{formatDate(published_at)}</span>
        </div>
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

export default ArticleCard;