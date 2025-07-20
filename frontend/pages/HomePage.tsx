import React from 'react';
import { Link } from 'react-router-dom';

const SearchIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const VoyagerIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 16 2.39.39.39 2.39L6 20l1.22-1.22"/><path d="m10 14 3.5-3.5"/><path d="M22 8 8 22"/></svg>);

const stocks = [
  { name: 'NVIDIA Corp.', ticker: 'NVDA', price: '120.59', change: '-0.34%', changeType: 'loss', logo: 'https://companiesmarketcap.com/img/logos/64/NVDA.png' },
  { name: 'Alphabet Inc.', ticker: 'GOOG', price: '185.94', change: '+1.24%', changeType: 'gain', logo: 'https://companiesmarketcap.com/img/logos/64/GOOG.png' },
  { name: 'Amazon.com', ticker: 'AMZN', price: '226.13', change: '+2.25%', changeType: 'gain', logo: 'https://companiesmarketcap.com/img/logos/64/AMZN.png' },
  { name: 'Meta Platf.', ticker: 'META', price: '704.28', change: '+2.87%', changeType: 'gain', logo: 'https://companiesmarketcap.com/img/logos/64/META.png' },
  { name: 'Visa Inc.', ticker: 'V', price: '349.05', change: '-0.76%', changeType: 'loss', logo: 'https://companiesmarketcap.com/img/logos/64/V.png' },
  { name: 'Apple Inc.', ticker: 'AAPL', price: '214.29', change: '+0.45%', changeType: 'gain', logo: 'https://companiesmarketcap.com/img/logos/64/AAPL.png' },
  { name: 'Microsoft', ticker: 'MSFT', price: '449.78', change: '+1.22%', changeType: 'gain', logo: 'https://companiesmarketcap.com/img/logos/64/MSFT.png' },
];

// Add a generic crypto icon SVG
const CryptoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#6366f1"/>
    <path d="M16 8v16M8 16h16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const getInitials = (ticker: string) => ticker.slice(0, 3).toUpperCase();

const StockTicker = () => (
  <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-white/5 backdrop-blur-md border border-brand-border">
    <div className="flex animate-infinite-scroll hover:animation-play-state-paused py-2">
      {[...stocks, ...stocks].map((stock, index) => (
        <div key={index} className="flex items-center space-x-4 mx-6 flex-shrink-0 min-w-[180px]">
          {/* Only show colored circle with initials or crypto icon */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-secondary flex items-center justify-center shadow-md border border-brand-border overflow-hidden">
            <span className="text-white font-bold text-lg">{getInitials(stock.ticker)}</span>
          </div>
          <div>
            <p className="font-semibold text-brand-text text-base tracking-wide">{stock.ticker}</p>
            <p className="text-sm text-brand-text-secondary">{stock.price}</p>
          </div>
          <p className={`text-sm font-bold ${stock.changeType === 'gain' ? 'text-green-400' : 'text-red-400'}`}>{stock.change}</p>
        </div>
      ))}
    </div>
    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-primary/80 to-transparent pointer-events-none"></div>
    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-primary/80 to-transparent pointer-events-none"></div>
  </div>
);


const HomePage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.15)_0%,_rgba(10,9,15,0)_60%)] -z-10"></div>

      <div className="container mx-auto px-4 md:px-8 py-20 md:py-32 text-center">
        <div className="inline-block bg-brand-secondary border border-brand-border rounded-full px-4 py-1.5 text-sm text-brand-text-secondary mb-6">
          Made by Investors, for Investors
        </div>
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-brand-text mb-8 max-w-4xl mx-auto">
          Redefine investment journey with AI enhanced analysis
        </h1>
        
        <div className="flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-4 bg-brand-secondary border border-brand-border p-4 rounded-lg">
                <VoyagerIcon className="text-brand-accent w-8 h-8"/>
                <div>
                    <p className="text-lg font-semibold text-brand-text">Welcome to Voyager!</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-sm text-green-400">Always Online</p>
                    </div>
                </div>
            </div>

            <Link to="/create" className="group w-full max-w-2xl bg-white/10 p-2 rounded-full border-2 border-transparent focus-within:border-brand-accent transition-all">
                <div className="w-full bg-white/5 p-4 rounded-full flex items-center gap-4">
                    <SearchIcon className="w-6 h-6 text-brand-accent" />
                    <p className="text-brand-text text-lg">
                        Your AI-powered <span className="font-bold">Investment Agent.</span>
                    </p>
                    <span className="hidden md:inline ml-auto text-brand-text-secondary">Search any Stock like AAPL, TSLA</span>
                </div>
            </Link>
        </div>
      </div>
      
      <div className="py-12">
        <StockTicker />
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-brand-secondary/50 border border-brand-border p-6 rounded-lg hover:border-brand-accent transition-colors">
                <p className="text-lg font-semibold text-brand-text">Analyze the impact</p>
                <p className="text-brand-text-secondary">of interest rates on the stock market</p>
            </div>
            <div className="bg-brand-secondary/50 border border-brand-border p-6 rounded-lg hover:border-brand-accent transition-colors">
                <p className="text-lg font-semibold text-brand-text">What are the key indicators</p>
                <p className="text-brand-text-secondary">for predicting a market crash?</p>
            </div>
        </div>

        <div className="text-center">
            <div className="inline-block bg-brand-secondary border border-brand-border rounded-full px-4 py-1.5 text-sm text-brand-text-secondary mb-6">
              EXCLUSIVE AI AGENTS
            </div>
             <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-brand-text mb-8 max-w-4xl mx-auto">
              Setting new benchmarks in Fundamental Research
            </h2>
            <div className="flex justify-center">
                 <Link to="/create" className="group w-full max-w-lg bg-white/10 p-1.5 rounded-full border-2 border-transparent focus-within:border-brand-accent transition-all">
                    <div className="w-full bg-white/5 p-2 rounded-full flex items-center gap-3">
                        <SearchIcon className="w-5 h-5 text-brand-accent ml-2" />
                        <p className="text-brand-text-secondary text-md">
                            Search any Stock like AAPL, TSLA
                        </p>
                    </div>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;