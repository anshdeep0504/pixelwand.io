
import React, { useState } from 'react';
import { StockHolding } from '../types';
import { Card } from './ui/Card';

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

interface PortfolioFormProps {
    onSubmit: (data: { holdings: StockHolding[], cash: number }) => Promise<void>;
    initialData?: { holdings: StockHolding[], cash: number };
    isSaving: boolean;
    error: string | null;
    mode: 'create' | 'edit';
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ onSubmit, initialData, isSaving, error, mode }) => {
    const [holdings, setHoldings] = useState<StockHolding[]>(initialData?.holdings || []);
    const [cash, setCash] = useState<number>(initialData?.cash || 0);

    const handleHoldingChange = (index: number, field: keyof StockHolding, value: string | number) => {
        const newHoldings = [...holdings];
        if (field === 'ticker') {
            newHoldings[index][field] = String(value).toUpperCase();
        } else {
            newHoldings[index][field] = Number(value);
        }
        setHoldings(newHoldings);
    };

    const addHolding = () => {
        setHoldings([...holdings, { ticker: '', quantity: 0 }]);
    };

    const removeHolding = (index: number) => {
        setHoldings(holdings.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ holdings, cash });
    };

    const pageTitle = mode === 'create' ? 'Create a New Portfolio' : 'Edit Your Portfolio';
    const pageDescription = mode === 'create' 
        ? "Enter your stock holdings and cash balance. Our AI will fetch live market data, generate a detailed analysis, and create a shareable link for you."
        : "Update your stock holdings and cash balance. The portfolio analysis will be regenerated with the latest market data.";
    const buttonText = mode === 'create' ? 'Generate & Share' : 'Update Portfolio';

    return (
        <div className="max-w-4xl mx-auto">
            <Card title={pageTitle}>
                <p className="mb-6 text-brand-text-secondary">{pageDescription}</p>

                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 mb-6">
                        {holdings.map((holding, index) => (
                            <div key={index} className="flex items-center gap-2 md:gap-4 p-3 bg-black bg-opacity-20 rounded-md">
                                <input
                                    type="text"
                                    placeholder="TICKER"
                                    value={holding.ticker}
                                    onChange={(e) => handleHoldingChange(index, 'ticker', e.target.value)}
                                    className="flex-1 bg-brand-primary border border-brand-border rounded-md px-3 py-2 placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent uppercase"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={holding.quantity}
                                    min="0"
                                    step="any"
                                    onChange={(e) => handleHoldingChange(index, 'quantity', e.target.value)}
                                    className="w-28 bg-brand-primary border border-brand-border rounded-md px-3 py-2 placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    required
                                />
                                <button type="button" onClick={() => removeHolding(index)} className="p-2 text-brand-text-secondary hover:text-red-500 transition-colors">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={addHolding} className="flex items-center gap-2 text-sm font-medium text-brand-accent hover:text-white transition-colors mb-6">
                        <PlusIcon className="w-4 h-4" />
                        Add Holding
                    </button>

                    <div className="mb-6">
                        <label htmlFor="cash" className="block text-sm font-medium text-brand-text-secondary mb-2">Cash Balance ($)</label>
                        <input
                            id="cash"
                            type="number"
                            value={cash}
                            min="0"
                            step="any"
                            onChange={(e) => setCash(Number(e.target.value))}
                            className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        />
                    </div>

                    <div className="flex justify-end items-center gap-4">
                        <button type="submit" disabled={isSaving} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-accent disabled:bg-brand-text-secondary disabled:cursor-not-allowed">
                            {isSaving ? 'Saving...' : buttonText}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default PortfolioForm;
