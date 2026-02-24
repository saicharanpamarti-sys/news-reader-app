import React, { useState } from 'react';

const SignInModal = ({ isOpen, onClose, onSignIn }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleContinue = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // For now, just simulate sign-in with email (can expand to password step later)
      onSignIn({ email });
      onClose();
    }
  };

  const handleSocial = (provider) => {
    alert(`Continue with ${provider} - Coming soon! (Integrate Firebase/Auth0 here)`);
    // Future: trigger real OAuth popup
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Sign in
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            New user?{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Create an account
            </a>
          </p>

          {/* Email Form */}
          <form onSubmit={handleContinue}>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition text-lg"
            >
              Continue
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">Or</span>
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocial('Google')}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <span className="text-red-500 text-xl">G</span>
              <span className="font-medium text-gray-900 dark:text-white">Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocial('Facebook')}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <span className="text-blue-600 text-xl">f</span>
              <span className="font-medium text-gray-900 dark:text-white">Continue with Facebook</span>
            </button>

            <button
              onClick={() => handleSocial('Apple')}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <span className="text-black dark:text-white text-xl"></span>
              <span className="font-medium text-gray-900 dark:text-white">Continue with Apple</span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-gray-50 dark:bg-gray-900 px-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
          <a href="#" className="hover:underline mx-2">More sign-in options</a>
          <span>•</span>
          <a href="#" className="hover:underline mx-2">Get help signing in</a>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SignInModal;