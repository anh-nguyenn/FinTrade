export interface Portfolio {
  id: number;
  symbol: string;
  companyName: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  profitLoss: number;
  profitLossPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalProfitLoss: number;
}

export interface AddToPortfolioRequest {
  symbol: string;
  companyName: string;
  quantity: number;
  price: number;
}

export interface RemoveFromPortfolioRequest {
  symbol: string;
  quantity: number;
}
