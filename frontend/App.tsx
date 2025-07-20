
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePortfolioPage from './pages/CreatePortfolioPage';
import PortfolioPage from './pages/PortfolioPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import EditPortfolioPage from './pages/EditPortfolioPage';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen bg-brand-primary font-sans">
          <Header />
          <main className="container mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/create" element={<CreatePortfolioPage />} />
              <Route path="/portfolio/:portfolioId" element={<PortfolioPage />} />
              <Route path="/edit/:portfolioId" element={<EditPortfolioPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
