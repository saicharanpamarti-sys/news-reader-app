// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Inner pulse (optional nice effect) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-ping"></div>
        </div>
      </div>
      
      {/* Optional text below spinner */}
      <p className="ml-4 text-gray-600 dark:text-gray-300 font-medium">
        Loading latest news...
      </p>
    </div>
  );
};

export default LoadingSpinner;