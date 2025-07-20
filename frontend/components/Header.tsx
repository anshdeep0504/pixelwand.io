import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PulseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
);


const Header: React.FC = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleViewShared = () => {
    setShowInput(true);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Extract portfolio ID from link or use as is
    let id = inputValue.trim();
    const match = id.match(/([a-fA-F0-9]{24})/); // MongoDB ObjectId
    if (match) id = match[1];
    if (id) {
      navigate(`/portfolio/${id}`);
      setShowInput(false);
      setInputValue('');
    }
  };

  return (
    <header className="bg-brand-primary/70 backdrop-blur-lg sticky top-0 z-50 border-b border-brand-border shadow-lg">
      <div className="container mx-auto flex items-center py-3 px-2 md:px-6 gap-2 md:gap-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white drop-shadow-md">
          <PulseIcon className="text-brand-accent" />
          Valuemetrix
        </Link>
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <a href="#" className="text-sm font-medium text-brand-text-secondary hover:text-brand-text transition-colors">Influencer Portfolios</a>
          <a href="#" className="text-sm font-medium text-brand-text-secondary hover:text-brand-text transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-brand-text-secondary hover:text-brand-text transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-2 py-1 shadow-inner backdrop-blur-md">
            {currentUser && (
              <>
                <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded-lg bg-brand-accent text-white font-semibold hover:bg-brand-accent-hover focus:ring-2 focus:ring-brand-accent/50 transition-all shadow-md">Dashboard</button>
                <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded-lg bg-black/70 text-white font-semibold border border-brand-border hover:bg-brand-secondary focus:ring-2 focus:ring-brand-accent/50 transition-all shadow-md">My Portfolio</button>
              </>
            )}
          </div>
          {currentUser ? (
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-400/50 transition-all shadow-md">Log out</button>
          ) : (
            <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-lg bg-brand-accent text-white font-semibold hover:bg-brand-accent-hover focus:ring-2 focus:ring-brand-accent/50 transition-all shadow-md">Log in</button>
          )}
          <button onClick={handleViewShared} className="px-4 py-2 rounded-lg bg-brand-accent text-white font-semibold hover:bg-brand-accent-hover focus:ring-2 focus:ring-brand-accent/50 transition-all shadow-lg border-2 border-brand-accent">View Shared Portfolio</button>
        </div>
        {showInput && (
          <form onSubmit={handleInputSubmit} className="flex items-center gap-2 bg-brand-secondary p-2 rounded-lg shadow-lg absolute top-16 right-4 md:right-8 z-50">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Paste link or ID..."
              className="bg-black border border-brand-border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              autoFocus
            />
            <button type="submit" className="bg-brand-accent hover:bg-brand-accent-hover text-white px-4 py-2 rounded-md font-semibold">Go</button>
            <button type="button" onClick={() => setShowInput(false)} className="text-brand-text-secondary ml-2 text-xl">✕</button>
          </form>
        )}
      </div>
    </header>
  );
};

export default Header;