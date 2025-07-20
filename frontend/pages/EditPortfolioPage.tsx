
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Portfolio, StockHolding, AIInsights } from '../types';
import { getPortfolio, updatePortfolio } from '../services/portfolioService';
import { generatePortfolioAnalysis } from '../services/geminiService';
import { getBatchStockData } from '../services/stockService';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import PortfolioForm from '../components/PortfolioForm';

const EditPortfolioPage: React.FC = () => {
    const { portfolioId } = useParams<{ portfolioId: string }>();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const [initialData, setInitialData] = useState<{ holdings: StockHolding[]; cash: number } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!portfolioId || !currentUser) {
            navigate('/login');
            return;
        }

        const fetchPortfolioData = async () => {
            setIsLoading(true);
            try {
                const { portfolio } = await getPortfolio(portfolioId);
                if (portfolio.ownerId !== currentUser.id) {
                    setError("Permission denied. You are not the owner of this portfolio.");
                    setInitialData(null);
                } else {
                    setInitialData({
                        holdings: portfolio.holdings.map(h => ({ ticker: h.ticker, quantity: h.quantity })),
                        cash: portfolio.cash
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolioData();
    }, [portfolioId, currentUser, navigate]);

    const handleSubmit = useCallback(async (data: { holdings: StockHolding[], cash: number }) => {
        if (!portfolioId) return;

        setIsSaving(true);
        setError(null);

        const validHoldings = data.holdings.filter(h => h.ticker && h.quantity > 0);
        if (validHoldings.length === 0) {
            setError("Please add at least one stock holding with a valid ticker and quantity.");
            setIsSaving(false);
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

            await updatePortfolio(portfolioId, portfolioPayload);

            navigate(`/portfolio/${portfolioId}`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred while updating the portfolio.");
        } finally {
            setIsSaving(false);
        }
    }, [portfolioId, navigate]);

    if (isLoading) {
        return <Loader text="Loading portfolio for editing..." />;
    }

    if (!initialData) {
        return (
            <div className="text-center p-8 bg-brand-secondary rounded-lg border border-red-700">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                <p className="text-brand-text-secondary">{error || "Could not load portfolio data."}</p>
            </div>
        );
    }

    return (
        <PortfolioForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isSaving={isSaving}
            error={error}
            mode="edit"
        />
    );
};

export default EditPortfolioPage;
