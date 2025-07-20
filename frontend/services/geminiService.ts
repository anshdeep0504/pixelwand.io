import { GoogleGenAI, Type } from "@google/genai";
import { StockData, AIInsights, SectorAllocation, Portfolio, Recommendation } from '../types';
import { GEMINI_API_KEY } from '../config';

const getMockAIInsights = (sectorAllocations: SectorAllocation[]): AIInsights => ({
    summary: "Portfolio analysis generated. AI-powered insights are unavailable because the Google Gemini API key has not been configured.",
    sectorExposure: "AI insights unavailable. Please configure the API key.",
    diversificationAnalysis: "AI insights unavailable. Please configure the API key.",
    investmentThesis: "AI insights unavailable. Please configure the API key.",
    sectorAllocations,
});

const calculateSectorAllocations = (holdings: StockData[]): SectorAllocation[] => {
    const totalStockValue = holdings.reduce((sum, stock) => sum + stock.value, 0);
    if (totalStockValue === 0) {
        return [];
    }
    
    const sectorValues = holdings.reduce((acc, stock) => {
        const sector = stock.sector || 'Other';
        acc[sector] = (acc[sector] || 0) + stock.value;
        return acc;
    }, {} as { [key: string]: number });

    return Object.entries(sectorValues).map(([sector, value]) => ({
        sector,
        value,
        percentage: (value / totalStockValue) * 100,
    })).sort((a, b) => b.value - a.value);
};


export async function generatePortfolioAnalysis(holdings: StockData[], cash: number): Promise<AIInsights> {
    if (!GEMINI_API_KEY) {
        console.warn("Google Gemini API key is not configured. Returning mock AI insights with calculated sector data.");
        const sectorAllocations = calculateSectorAllocations(holdings);
        return getMockAIInsights(sectorAllocations);
    }
    
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const portfolioValue = holdings.reduce((sum, stock) => sum + stock.value, 0) + cash;
    const holdingsString = holdings.map(h => `${h.quantity} of ${h.ticker} (value: $${h.value.toFixed(2)}, sector: ${h.sector})`).join(', ');

    const prompt = `
        Analyze the following investment portfolio and generate insights.
        
        Portfolio Data:
        - Total Portfolio Value: $${portfolioValue.toFixed(2)}
        - Cash Balance: $${cash.toFixed(2)}
        - Stock Holdings: ${holdingsString}

        Provide the following analysis in JSON format:
        1.  **summary**: A brief, one-paragraph overview of the portfolio's composition and key characteristics.
        2.  **sectorExposure**: A short paragraph describing the main sector concentrations.
        3.  **diversificationAnalysis**: A short paragraph analyzing the portfolio's diversification. Mention if it's concentrated or well-diversified and potential risks.
        4.  **investmentThesis**: A potential investment thesis based on the holdings. What story does this collection of stocks tell?
        5.  **sectorAllocations**: An array of objects, each representing a sector's total value and its percentage of the total portfolio value. Calculate this based on the provided holdings. Cash is not a sector.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            sectorExposure: { type: Type.STRING },
            diversificationAnalysis: { type: Type.STRING },
            investmentThesis: { type: Type.STRING },
            sectorAllocations: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sector: { type: Type.STRING },
                        value: { type: Type.NUMBER },
                        percentage: { type: Type.NUMBER },
                    },
                    required: ["sector", "value", "percentage"]
                }
            }
        },
        required: ["summary", "sectorExposure", "diversificationAnalysis", "investmentThesis", "sectorAllocations"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as AIInsights;

    } catch (error) {
        console.error("Error generating portfolio analysis:", error);
        // Fallback in case of API error during generation
        const sectorAllocations = calculateSectorAllocations(holdings);
        const mockInsights = getMockAIInsights(sectorAllocations);
        mockInsights.summary = "An error occurred while communicating with the AI. The portfolio has been created, but AI insights could not be generated at this time.";
        return mockInsights;
    }
}


// --- New Recommendation Feature ---

// A curated list of stocks from various sectors to serve as a recommendation pool.
const STOCK_UNIVERSE = [
    { ticker: 'MSFT', companyName: 'Microsoft Corp.', sector: 'Technology' },
    { ticker: 'JPM', companyName: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
    { ticker: 'JNJ', companyName: 'Johnson & Johnson', sector: 'Healthcare' },
    { ticker: 'V', companyName: 'Visa Inc.', sector: 'Financial Services' },
    { ticker: 'PG', companyName: 'Procter & Gamble Co.', sector: 'Consumer Defensive' },
    { ticker: 'UNH', companyName: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
    { ticker: 'HD', companyName: 'Home Depot, Inc.', sector: 'Consumer Cyclical' },
    { ticker: 'DIS', companyName: 'The Walt Disney Company', sector: 'Communication Services' },
    { ticker: 'BAC', companyName: 'Bank of America Corp', sector: 'Financial Services'},
    { ticker: 'PFE', companyName: 'Pfizer Inc.', sector: 'Healthcare'},
    { ticker: 'KO', companyName: 'The Coca-Cola Company', sector: 'Consumer Defensive'},
    { ticker: 'PEP', companyName: 'PepsiCo, Inc.', sector: 'Consumer Defensive'},
    { ticker: 'WMT', companyName: 'Walmart Inc.', sector: 'Consumer Defensive'},
    { ticker: 'COST', companyName: 'Costco Wholesale Corporation', sector: 'Consumer Defensive'},
    { ticker: 'ADBE', companyName: 'Adobe Inc.', sector: 'Technology'},
    { ticker: 'CRM', companyName: 'Salesforce, Inc.', sector: 'Technology'},
    { ticker: 'INTC', companyName: 'Intel Corporation', sector: 'Technology'},
    { ticker: 'CSCO', companyName: 'Cisco Systems, Inc.', sector: 'Technology'},
    { ticker: 'XOM', companyName: 'Exxon Mobil Corporation', sector: 'Energy'},
    { ticker: 'CVX', companyName: 'Chevron Corporation', sector: 'Energy'},
];

export async function generateRecommendations(portfolios: Portfolio[]): Promise<Recommendation[]> {
     if (!GEMINI_API_KEY) {
        console.warn("Google Gemini API key is not configured. Returning mock recommendations.");
        return [
            { ticker: 'MSFT', companyName: 'Microsoft Corp.', rationale: 'This is a mock recommendation. Add a Gemini API key to `config.ts` to get real, personalized suggestions based on your portfolios.' },
            { ticker: 'JNJ', companyName: 'Johnson & Johnson', rationale: 'This mock suggestion highlights the need for a key to enable live AI recommendations.' },
        ];
    }
    
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const existingHoldings = portfolios.flatMap(p => p.holdings.map(h => h.ticker));
    const uniqueHoldings = [...new Set(existingHoldings)];

    const universeString = STOCK_UNIVERSE
        .filter(stock => !uniqueHoldings.includes(stock.ticker)) // Don't recommend stocks the user already owns
        .map(stock => `${stock.ticker} (${stock.companyName}, ${stock.sector})`)
        .join(', ');

    const prompt = `
        As an expert financial analyst, your task is to recommend new stocks to a user to improve their investment portfolio.
        The user currently owns the following stocks across all their portfolios: ${uniqueHoldings.join(', ')}.
        
        Here is a universe of high-quality stocks to recommend from:
        ${universeString}

        Based on the user's current holdings, recommend 3 to 5 stocks from the universe provided that would improve their portfolio's diversification or strategic positioning.
        For each recommendation, provide a brief, one-sentence rationale explaining why it's a good addition.
        Focus on complementing their existing assets. For example, if they are heavy in technology, suggest stocks from other sectors like Healthcare or Consumer Defensive.
        
        Return the response in JSON format as an array of objects.
    `;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                ticker: { type: Type.STRING },
                companyName: { type: Type.STRING },
                rationale: { type: Type.STRING },
            },
            required: ["ticker", "companyName", "rationale"]
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Recommendation[];
    } catch (error) {
        console.error("Error generating recommendations:", error);
        throw new Error("Could not generate AI recommendations at this time.");
    }
}

export async function generateRiskAnalysis(holdings: StockData[], cash: number): Promise<string> {
    if (!GEMINI_API_KEY) {
        return "AI risk analysis is unavailable. Please configure your Gemini API key.";
    }
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const holdingsString = holdings.map(h => `${h.quantity} of ${h.ticker} (${h.companyName}, sector: ${h.sector})`).join(', ');
    const prompt = `
        Analyze the following investment portfolio and provide a concise risk analysis. Focus on concentration risk, sector risk, diversification, and any notable vulnerabilities. Return a 2-3 sentence summary.
        Portfolio Data:
        - Cash Balance: $${cash.toFixed(2)}
        - Stock Holdings: ${holdingsString}
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "text/plain"
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating risk analysis:", error);
        return "AI risk analysis is currently unavailable.";
    }
}