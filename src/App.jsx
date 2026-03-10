import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import Header from './layouts/Header';
import Footer from './layouts/Footer';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import HistoryTracker from './components/HistoryTracker';
import PreviewTimer from './components/PreviewTimer';
import SignInModal from './components/SignInModal';
import { useAuth } from './contexts/AuthContext';
import HistoryPage from './pages/HistoryPage';
function AppContent() { // Wrapped content for context access
  const { showSignInModal, triggerSignInModal, resetPreview, isLoggedIn } = useAuth();

  return (
    <PreviewTimer onSignInTrigger={triggerSignInModal}>
      {/* global history listener tracks events even when no specific article prop is passed */}
      <HistoryTracker>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Header />

          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:cat" element={<CategoryPage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/history" element={<HistoryPage />} />   {/* ← This one */}
            </Routes>
          </main>

          <Footer />

          {/* Global SignInModal */}
          <SignInModal 
            isOpen={showSignInModal} 
            onClose={() => {}} // Managed by context
            onSignIn={(data) => {}} // Managed by context (signIn func)
            isForced={false} // Default; set via trigger
          />
        </div>
      </HistoryTracker>
    </PreviewTimer>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;