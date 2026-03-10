import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [previewExpired, setPreviewExpired] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const signIn = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setPreviewExpired(false); // Stop preview timer on login
    setShowSignInModal(false);
  };

  const signOut = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setPreviewExpired(false); // Reset for next session
    setShowSignInModal(false);
  };

  const triggerSignInModal = (isForced = false) => {
    setShowSignInModal(true);
    if (isForced) setPreviewExpired(true);
  };

  const resetPreview = () => {
    setPreviewExpired(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      userEmail, 
      signIn, 
      signOut, 
      previewExpired, 
      showSignInModal, 
      triggerSignInModal, 
      resetPreview 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);