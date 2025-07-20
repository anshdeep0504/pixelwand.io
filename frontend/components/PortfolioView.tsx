import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Portfolio } from '../types';
import { Card } from './ui/Card';
import SectorChart from './SectorChart';

const ShareIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>);
const CheckIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>);
const FileTextIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>);
const PieChartIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>);
const TargetIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const LightbulbIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7.5a6 6 0 0 0-12 0c0 1.5.3 2.7 1.5 4 .8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>);
const EyeIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>);
const AlertTriangleIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

interface PortfolioViewProps {
    portfolio: Portfolio;
    viewCount: number;
    onRevoke: () => void;
    isOwner: boolean;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ portfolio, viewCount, onRevoke, isOwner }) => {
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const handleCopyLink = () => {
    const baseUrl = window.location.href.split('#')[0];
    const portfolioUrl = `${baseUrl}#${location.pathname}`;

    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white">Portfolio Value: {formatCurrency(portfolio.totalValue)}</h2>
              <p className="text-brand-text-secondary">Generated on {new Date(portfolio.createdAt).toLocaleDateString()}</p>
              <div className="flex items-center gap-2 text-brand-text-secondary mt-2 text-sm">
                <EyeIcon className="w-4 h-4" />
                <span>Viewed {portfolio.views || 0} time{portfolio.views === 1 ? '' : 's'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
                {isOwner && (
                  <button
                    onClick={onRevoke}
                    title="Revoke share link"
                    className="inline-flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all text-sm bg-red-900 hover:bg-red-800 text-red-200"
                  >
                    <AlertTriangleIcon className="w-5 h-5" />
                    <span>Revoke Link</span>
                  </button>
                )}
                <button
                  onClick={handleCopyLink}
                  className={`inline-flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all text-sm ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                  }`}
                >
                  {copied ? <CheckIcon className="w-5 h-5" /> : <ShareIcon className="w-5 h-5" />}
                  {copied ? 'Link Copied!' : 'Share Portfolio'}
                </button>
            </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Holdings" className="md:col-span-2">
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-brand-border">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">Company</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Ticker</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Quantity</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Price</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-left text-sm font-semibold text-white">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                      {portfolio.holdings.map((stock) => (
                        <tr key={stock.ticker}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">{stock.companyName}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-brand-text-secondary">{stock.ticker}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-brand-text-secondary">{stock.quantity}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-brand-text-secondary">{formatCurrency(stock.price)}</td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium text-right text-white sm:pr-0">{formatCurrency(stock.value)}</td>
                        </tr>
                      ))}
                      <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">Cash</td>
                          <td colSpan={3}></td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium text-right text-white sm:pr-0">{formatCurrency(portfolio.cash)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </Card>
        
        <Card title="AI Summary" icon={<FileTextIcon className="w-5 h-5 text-brand-accent"/>}>
          <p className="text-brand-text-secondary whitespace-pre-wrap">{portfolio.aiInsights.summary}</p>
        </Card>

        <Card title="Investment Thesis" icon={<TargetIcon className="w-5 h-5 text-brand-accent"/>}>
           <p className="text-brand-text-secondary whitespace-pre-wrap">{portfolio.aiInsights.investmentThesis}</p>
        </Card>
      </div>
      
      <Card title="AI Analysis & Insights" className="md:col-span-2" icon={<LightbulbIcon className="w-5 h-5 text-brand-accent"/>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
                <h4 className="font-semibold text-white mb-2">Sector Exposure</h4>
                <p className="text-brand-text-secondary mb-4 whitespace-pre-wrap">{portfolio.aiInsights.sectorExposure}</p>
                <h4 className="font-semibold text-white mb-2 mt-6">Diversification Analysis</h4>
                <p className="text-brand-text-secondary whitespace-pre-wrap">{portfolio.aiInsights.diversificationAnalysis}</p>
            </div>
            <div className="h-80">
                <SectorChart data={portfolio.aiInsights.sectorAllocations} />
            </div>
          </div>
      </Card>
    </div>
  );
};

export const PublicPortfolioSummary: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-brand-secondary rounded-lg border border-brand-border shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-2">Portfolio Value: {formatCurrency(portfolio.totalValue)}</h2>
      <p className="text-brand-text-secondary mb-2">Generated on {new Date(portfolio.createdAt).toLocaleDateString()}</p>
      <p className="text-brand-text-secondary mb-4">Cash: {formatCurrency(portfolio.cash)}</p>
      <div>
        <span className="font-semibold text-brand-accent">Holdings:</span>
        <ul className="ml-4 list-disc text-sm text-brand-text-secondary">
          {portfolio.holdings.map((h, idx) => (
            <li key={idx}>
              {h.ticker}: {h.quantity} shares @ {formatCurrency(h.price)} ({h.companyName})
            </li>
          ))}
        </ul>
      </div>
      {portfolio.aiInsights?.summary && (
        <div className="mt-6">
          <span className="font-semibold text-brand-accent">AI Summary:</span>
          <p className="text-brand-text-secondary whitespace-pre-wrap mt-2">{portfolio.aiInsights.summary}</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioView;