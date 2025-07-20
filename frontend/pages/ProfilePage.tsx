
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Portfolio, Recommendation } from '../types';
import { getUserPortfolios } from '../services/portfolioService';
import { generateRecommendations } from '../services/geminiService';
import { AuthContext } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import Loader from '../components/Loader';

const PortfolioIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="8" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="16" y2="21"/><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>);
const WandIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>);
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);


const ProfilePage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchPortfolios = async () => {
      setIsLoadingPortfolios(true);
      try {
        const userPortfolios = await getUserPortfolios();
        setPortfolios(userPortfolios);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolios.');
      } finally {
        setIsLoadingPortfolios(false);
      }
    };

    fetchPortfolios();
  }, [currentUser, navigate]);

  const handleGetRecommendations = async () => {
    setIsLoadingRecs(true);
    setError(null);
    try {
        const recs = await generateRecommendations(portfolios);
        setRecommendations(recs);
    } catch(err) {
        setError(err instanceof Error ? err.message : 'Failed to get recommendations.');
    } finally {
        setIsLoadingRecs(false);
    }
  }

  if (isLoadingPortfolios) {
    return <Loader text="Loading your profile..." />;
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card title="My Portfolios" icon={<PortfolioIcon className="text-brand-accent"/>}>
            {portfolios.length > 0 ? (
                <div className="space-y-4">
                    {portfolios.map(p => (
                        <div key={p.id} className="p-4 bg-black bg-opacity-20 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex-1">
                                <p className="font-bold text-white">Value: {formatCurrency(p.totalValue)}</p>
                                <p className="text-sm text-brand-text-secondary">Created on {new Date(p.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm text-brand-text-secondary">Cash: {formatCurrency(p.cash)}</p>
                                <div className="mt-2">
                                    <span className="font-semibold text-brand-accent">Holdings:</span>
                                    <ul className="ml-4 list-disc text-sm text-brand-text-secondary">
                                        {p.holdings.map((h: any, idx: number) => (
                                            <li key={idx}>
                                                {h.ticker}: {h.quantity} shares @ ${h.price} ({h.companyName})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-2">
                                <Link to={`/edit/${p._id}`} className="text-sm font-medium bg-brand-secondary hover:bg-brand-border text-white py-2 px-4 rounded-lg transition-colors">
                                    Edit
                                </Link>
                                <Link to={`/portfolio/${p._id}`} className="text-sm font-medium bg-brand-accent hover:bg-brand-accent-hover text-white py-2 px-4 rounded-lg transition-colors">
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-brand-text-secondary mb-4">You haven't created any portfolios yet.</p>
                    <Link to="/create" className="inline-flex items-center gap-2 text-sm font-medium bg-brand-accent hover:bg-brand-accent-hover text-white py-2 px-4 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5"/>
                        Create Your First Portfolio
                    </Link>
                </div>
            )}
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card title="AI Stock Recommendations" icon={<WandIcon className="text-brand-accent"/>}>
            <p className="text-sm text-brand-text-secondary mb-4">
                Let our AI analyze all your portfolios and suggest new stocks to improve your diversification.
            </p>
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <button onClick={handleGetRecommendations} disabled={isLoadingRecs || portfolios.length === 0} className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-brand-text-secondary disabled:cursor-not-allowed">
                {isLoadingRecs ? 'Analyzing...' : 'Generate Recommendations'}
            </button>
            
            {isLoadingRecs && <div className="mt-4"><Loader text="Finding opportunities..."/></div>}
            
            {recommendations.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-white">Here are some suggestions:</h4>
                    {recommendations.map(rec => (
                        <div key={rec.ticker} className="p-3 bg-black bg-opacity-20 rounded-lg">
                            <p className="font-bold text-white">{rec.ticker} - <span className="font-normal text-brand-text-secondary">{rec.companyName}</span></p>
                            <p className="text-sm text-brand-text mt-1 italic">"{rec.rationale}"</p>
                        </div>
                    ))}
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
