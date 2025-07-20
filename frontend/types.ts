export interface StockHolding {
  ticker: string;
  quantity: number;
}

export interface StockData extends StockHolding {
  companyName: string;
  price: number;
  sector: string;
  value: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}

export interface AIInsights {
  summary: string;
  sectorExposure: string;
  diversificationAnalysis: string;
  investmentThesis: string;
  sectorAllocations: SectorAllocation[];
}

export interface Portfolio {
  id: string;
  ownerId: string;
  holdings: StockData[];
  cash: number;
  totalValue: number;
  aiInsights: AIInsights;
  createdAt: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export interface AccessLog {
  timestamp: string;
  userAgent: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Recommendation {
  ticker: string;
  companyName: string;
  rationale: string;
}