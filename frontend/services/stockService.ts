import { StockHolding, StockData } from '../types';

// FOR DEMONSTRATION PURPOSES: The user's Finnhub API key is placed here.
// In a production application, this key should be moved to a secure backend 
// and proxied to prevent exposure on the client-side.
const API_KEY = 'd1u12b9r01qt0evdkcm0d1u12b9r01qt0evdkcmg';

if (!API_KEY) {
    console.warn("FINNHUB_API_KEY is not set. Using mock data. Sign up at finnhub.io for a free key.");
}

const BASE_URL = 'https://finnhub.io/api/v1';

// This is a fallback mock database for when the API key is not available.
const MOCK_STOCK_DB: { [key: string]: { name: string; price: number; sector: string } } = {
  'AAPL': { name: 'Apple Inc.', price: 190.29, sector: 'Technology' },
  'GOOGL': { name: 'Alphabet Inc.', price: 175.51, sector: 'Communication Services' },
  'MSFT': { name: 'Microsoft Corp.', price: 427.56, sector: 'Technology' },
  'AMZN': { name: 'Amazon.com, Inc.', price: 184.69, sector: 'Consumer Cyclical' },
  'NVDA': { name: 'NVIDIA Corp.', price: 121.79, sector: 'Technology' },
  'TSLA': { name: 'Tesla, Inc.', price: 183.01, sector: 'Consumer Cyclical' },
  'BTC': { name: 'Bitcoin', price: 68000.50, sector: 'Cryptocurrency' },
  'ETH': { name: 'Ethereum', price: 3500.75, sector: 'Cryptocurrency' },
  'EUR/USD': { name: 'EUR/USD', price: 1.07, sector: 'Forex' },
};

const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> => {
    return Promise.race([
        fetch(url, options),
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
    ]);
};

/**
 * Fetches data for a single asset, automatically detecting its type (Stock, Crypto, Forex)
 * and using the appropriate Finnhub endpoint.
 */
async function fetchAssetData(ticker: string): Promise<Partial<StockData>> {
    const upperTicker = ticker.toUpperCase();
    
    const isForex = upperTicker.includes('/');
    const knownCryptos = ['BTC', 'ETH', 'SOL', 'DOGE', 'XRP', 'SHIB', 'ADA'];
    const isCrypto = knownCryptos.includes(upperTicker);

    // --- Forex Data Fetching ---
    if (isForex) {
        try {
            // Finnhub uses symbols like OANDA:EUR_USD
            const symbol = `OANDA:${upperTicker.replace('/', '_')}`;
            const quoteUrl = `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`;
            const quoteRes = await fetchWithTimeout(quoteUrl);
            if (!quoteRes.ok) throw new Error(`Forex quote fetch failed with status ${quoteRes.status}`);
            const quote = await quoteRes.json();
            if (quote.c === 0 || !quote.c) throw new Error(`No data for Forex pair ${upperTicker}`);
            
            return {
                companyName: upperTicker,
                price: quote.c,
                sector: 'Forex',
            };
        } catch (error) {
            console.error(`Failed to fetch Forex data for ${ticker}:`, error);
            throw new Error(`Invalid ticker or no data available for ${ticker}.`);
        }
    }

    // --- Crypto Data Fetching ---
    if (isCrypto) {
        try {
            // Finnhub uses symbols like BINANCE:BTCUSDT
            const symbol = `BINANCE:${upperTicker}USDT`;
            const quoteUrl = `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`;
            const quoteRes = await fetchWithTimeout(quoteUrl);
            if (!quoteRes.ok) throw new Error(`Crypto quote fetch failed with status ${quoteRes.status}`);
            const quote = await quoteRes.json();
            if (quote.c === 0 || !quote.c) throw new Error(`No data for crypto ${upperTicker}`);

            return {
                companyName: `${upperTicker}/USD`,
                price: quote.c,
                sector: 'Cryptocurrency',
            };
        } catch (error) {
            console.error(`Failed to fetch Crypto data for ${ticker}:`, error);
            throw new Error(`Invalid ticker or no data available for ${ticker}.`);
        }
    }

    // --- Stock Data Fetching (Default) ---
    try {
        const profileUrl = `${BASE_URL}/stock/profile2?symbol=${upperTicker}&token=${API_KEY}`;
        const quoteUrl = `${BASE_URL}/quote?symbol=${upperTicker}&token=${API_KEY}`;

        const [profileRes, quoteRes] = await Promise.all([
            fetchWithTimeout(profileUrl),
            fetchWithTimeout(quoteUrl)
        ]);

        if (!profileRes.ok || !quoteRes.ok) {
            throw new Error(`Could not retrieve complete stock data for ${upperTicker}.`);
        }

        const profile = await profileRes.json();
        const quote = await quoteRes.json();

        if (!profile.name || (quote.c === 0 && quote.d === null)) { // quote.d can be null but c=0 means no data usually
            throw new Error(`Invalid ticker or no data available for ${upperTicker}.`);
        }

        return {
            companyName: profile.name || 'Unknown Company',
            price: quote.c || 0,
            sector: profile.finnhubIndustry || 'Other',
        };
    } catch (error) {
        console.error(`Failed to fetch Stock data for ${ticker}:`, error);
        throw new Error(`Invalid ticker or no data available for ${ticker}.`);
    }
}


// Fetches data for a batch of assets using a real-time API
export const getBatchStockData = async (holdings: StockHolding[]): Promise<StockData[]> => {
    if (!API_KEY) {
        // Fallback to mock data if API key is not available
        console.log("Using mock data for batch fetch.");
        return holdings.map(holding => {
            const stockInfo = MOCK_STOCK_DB[holding.ticker.toUpperCase()] || { name: `${holding.ticker} (Mock)`, price: Math.random() * 500, sector: 'Other' };
            return {
                ...holding,
                companyName: stockInfo.name,
                price: stockInfo.price,
                sector: stockInfo.sector,
                value: holding.quantity * stockInfo.price,
            };
        });
    }

    const stockDataPromises = holdings.map(async (holding) => {
        const data = await fetchAssetData(holding.ticker);
        return {
            ...holding,
            companyName: data.companyName!,
            price: data.price!,
            sector: data.sector!,
            value: holding.quantity * (data.price || 0),
        } as StockData;
    });

    return Promise.all(stockDataPromises);
};