export interface Transaction {
  id: number;
  symbol: string;
  companyName: string;
  transactionType: "BUY" | "SELL";
  quantity: number;
  price: number;
  totalAmount: number;
  commission: number;
  notes: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  symbol: string;
  companyName: string;
  transactionType: "BUY" | "SELL";
  quantity: number;
  price: number;
  commission?: number;
  notes?: string;
}

export interface TransactionFilters {
  type?: string;
  startDate?: string;
  endDate?: string;
}
