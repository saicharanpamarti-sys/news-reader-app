import React from 'react';
import { usePreviewTimer } from '../hooks/usePreviewTimer';
import SignInModal from './SignInModal'; // Existing import

const PreviewTimer = ({ children, onSignInTrigger }) => {
  const { isExpired } = usePreviewTimer(() => {
    onSignInTrigger(true); // Pass 'forced' prop to modal
  });

  {isExpired && (
  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 max-w-md">
    <span className="text-lg">⏰</span>
    <div>
      <p className="font-medium">Free preview time has ended</p>
      <p className="text-sm opacity-90">Sign in to continue reading unlimited news</p>
    </div>
  </div>
)}

  return <>{children}</>;
};

export default PreviewTimer;