import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} News Reader App. Powered by TheNewsAPI.com</p>
        <p className="mt-2 text-sm">
          All news content belongs to their respective publishers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;