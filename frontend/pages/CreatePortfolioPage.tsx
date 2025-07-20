
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StockHolding, AIInsights } from '../types';
import { generatePortfolioAnalysis } from '../services/geminiService';
import { getBatchStockData } from '../services/stockService';
import { createPortfolio } from '../services/portfolioService';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import PortfolioForm from '../components/PortfolioForm';

const CreatePortfolioPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
      if(!currentUser) {
          navigate('/login');
      }
  }, [currentUser, navigate])

  const handleSubmit = useCallback(async (data: { holdings: StockHolding[], cash: number }) => {
    if (!currentUser) {
        setError("You must be logged in to create a portfolio.");
        return;
    }

    setIsLoading(true);
    setError(null);

    const validHoldings = data.holdings.filter(h => h.ticker && h.quantity > 0);
    if(validHoldings.length === 0) {
        setError("Please add at least one stock holding with a valid ticker and quantity.");
        setIsLoading(false);
        return;
    }

    try {
      const stockData = await getBatchStockData(validHoldings);
      const aiInsights: AIInsights = await generatePortfolioAnalysis(stockData, data.cash);
      
      const totalValue = stockData.reduce((acc, stock) => acc + stock.value, 0) + data.cash;

      const portfolioPayload = {
        holdings: stockData,
        cash: data.cash,
        totalValue,
        aiInsights,
      };

      const { id } = await createPortfolio(portfolioPayload);

      navigate(`/portfolio/${id}`);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while generating the portfolio.");
    } finally {
        setIsLoading(false);
    }
  }, [navigate, currentUser]);

  if (isLoading) {
    return <div className="container mx-auto p-4 md:p-8"><Loader text="Fetching live data & building your smart portfolio..." /></div>;
  }
  
  const initialData = {
    holdings: [
      { ticker: 'AAPL', quantity: 10 },
      { ticker: 'GOOGL', quantity: 5 },
      { ticker: 'NVDA', quantity: 8 },
    ],
    cash: 10000,
  }

  return (
    <PortfolioForm
        onSubmit={handleSubmit}
        initialData={initialData}
        isSaving={isLoading}
        error={error}
        mode="create"
    />
  );
};

export default CreatePortfolioPage;
