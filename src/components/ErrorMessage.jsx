import React from 'react';

const ErrorMessage = ({ message }) => {
  const is402Error = message?.includes('402') || message?.includes('Payment Required');
  const is401Error = message?.includes('401') || message?.includes('Unauthorized');
  
  return (
    <div className="rounded-lg my-8 overflow-hidden shadow-lg">
      {/* Error Header */}
      <div className="bg-red-600 text-white px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <h2 className="font-bold text-lg">Error Loading News</h2>
      </div>
      
      {/* Error Message */}
      <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-l-4 border-red-600">
        <p className="text-red-800 dark:text-red-400 font-semibold mb-2">
          {message || 'Failed to load news. Please try again later.'}
        </p>
      </div>

      {/* Helpful Solutions */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">💡 What You Can Do:</h3>
        
        {is402Error && (
          <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            <p className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">📌</span>
              <span><strong>Try a Different News Provider:</strong> Use the dropdown at the top to switch to NewsData.io, NewsAPI.org, or GNews</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">📌</span>
              <span><strong>Upgrade Your Plan:</strong> Check if your API subscription needs renewal or upgrade</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">📌</span>
              <span><strong>Wait a Moment:</strong> Your quota may reset after a certain time period</span>
            </p>
          </div>
        )}

        {is401Error && (
          <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            <p className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">📌</span>
              <span><strong>Invalid API Key:</strong> Check your .env file - the API key may be incorrect or expired</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">📌</span>
              <span><strong>Try Another Provider:</strong> Use the dropdown to switch to a different news API</span>
            </p>
          </div>
        )}

        {!is402Error && !is401Error && (
          <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            <p className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">📌</span>
              <span><strong>Check Your Connection:</strong> Make sure you have a stable internet connection</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">📌</span>
              <span><strong>Try Again:</strong> Refresh the page or try a different search</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">📌</span>
              <span><strong>Switch Provider:</strong> Click the provider dropdown to use a different news API</span>
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          💻 Check your browser console (F12) for more detailed error information
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;