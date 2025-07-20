import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Portfolio } from '../types';
import PortfolioView, { PublicPortfolioSummary } from '../components/PortfolioView';
import Chatbot from '../components/Chatbot';
import { getPortfolio, deletePortfolio } from '../services/portfolioService';
import { AuthContext } from '../contexts/AuthContext';
import { generateRiskAnalysis } from '../services/geminiService';


const PortfolioPage: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [revoked, setRevoked] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<string>('');
  const [showShare, setShowShare] = useState(false);
  const [isMakingPublic, setIsMakingPublic] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');


  useEffect(() => {
    if (portfolioId) {
      const fetchPortfolioData = async () => {
        setIsLoading(true);
        try {
          const data = await getPortfolio(portfolioId);
          setPortfolio(data.portfolio);
          setViewCount(data.viewCount);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPortfolioData();
    }
  }, [portfolioId]);

  useEffect(() => {
    if (portfolio && portfolio.holdings && typeof portfolio.cash === 'number') {
      generateRiskAnalysis(portfolio.holdings, portfolio.cash).then(setRiskAnalysis);
    }
  }, [portfolio]);

  const handleRevokeAccess = useCallback(async () => {
    if(!portfolioId) return;
    if(window.confirm("Are you sure you want to permanently revoke access to this portfolio? This action cannot be undone.")) {
        try {
            await deletePortfolio(portfolioId);
            setRevoked(true);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            alert(`Error: ${message}`);
            console.error("Failed to revoke portfolio:", err);
        }
    }
  }, [portfolioId]);

  // Helper to make portfolio public
  const handleMakePublic = async () => {
    if (!portfolioId) return;
    setIsMakingPublic(true);
    try {
      await fetch(`http://localhost:5000/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('jwt_token') ? { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` } : {})
        },
        body: JSON.stringify({ isPublic: true })
      });
      setPortfolio((prev: Portfolio | null) => prev ? { ...prev, isPublic: true } : prev);
      setShowShare(true);
    } catch (err) {
      alert('Failed to make portfolio public.');
    } finally {
      setIsMakingPublic(false);
    }
  };

  // Helper to copy link
  const handleCopyLink = () => {
    if (!portfolioId) return;
    navigator.clipboard.writeText(`${window.location.origin}/#/portfolio/${portfolioId}`);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 1500);
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <svg className="animate-spin h-8 w-8 text-brand-accent mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-brand-text">Loading Portfolio...</p>
        </div>
    );
  }

  if (error && error.includes('revoked permissions')) {
    return (
      <div className="text-center p-8 bg-brand-secondary rounded-lg border border-red-700">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Portfolio Access Revoked</h2>
        <p className="text-brand-text-secondary mb-6">Admin has revoked permissions for this portfolio.</p>
        <Link to="/" className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Go to Home
        </Link>
      </div>
    );
  }

  if (revoked) {
    return (
      <div className="text-center p-8 bg-brand-secondary rounded-lg border border-green-700">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Portfolio Access Revoked</h2>
        <p className="text-brand-text-secondary mb-6">This portfolio is now private and cannot be viewed by others.</p>
        <Link to="/" className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Go to Home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-brand-secondary rounded-lg border border-red-700">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Could not load portfolio</h2>
        <p className="text-brand-text-secondary mb-6">{error}</p>
        <Link to="/" className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Create a new portfolio
        </Link>
      </div>
    );
  }

  if (!portfolio) {
    return <p>No portfolio data available.</p>;
  }

  const isOwner = currentUser?.id === portfolio.ownerId;

  if (!isOwner) {
    return <PublicPortfolioSummary portfolio={portfolio} />;
  }

  // Share Publicly button logic
  const shareSection = (
    <div className="mb-6">
      {portfolio.isPublic ? (
        <div className="flex flex-col md:flex-row items-center gap-2">
          <input
            className="w-full md:w-auto px-3 py-2 rounded-lg bg-brand-secondary text-white border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent"
            value={`${window.location.origin}/#/portfolio/${portfolioId}`}
            readOnly
          />
          <button
            onClick={handleCopyLink}
            className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {copySuccess || 'Copy Link'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleMakePublic}
          disabled={isMakingPublic}
          className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-60"
        >
          {isMakingPublic ? 'Making Public...' : 'Share Publicly'}
        </button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {shareSection}
        <PortfolioView portfolio={portfolio} viewCount={viewCount} onRevoke={handleRevokeAccess} isOwner={isOwner} />
        {riskAnalysis && (
          <div className="bg-gradient-to-r from-red-500/80 to-brand-secondary p-4 rounded-xl shadow-lg flex items-center gap-4 mb-6">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">AI Risk Analysis</h4>
              <p className="text-brand-text-secondary">{riskAnalysis}</p>
            </div>
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
        <Chatbot portfolio={portfolio} />
      </div>
    </div>
  );
};

export default PortfolioPage;