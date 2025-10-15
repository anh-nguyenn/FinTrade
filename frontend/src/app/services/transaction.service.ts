import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import {
  Transaction,
  CreateTransactionRequest,
  TransactionFilters,
} from "../models/transaction.model";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/all`);
  }

  getRecentTransactions(limit: number = 10): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.apiUrl}/transactions/recent?limit=${limit}`
    );
  }

  searchTransactions(symbol: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.apiUrl}/transactions/search?symbol=${symbol}`
    );
  }

  filterTransactions(filters: TransactionFilters): Observable<Transaction[]> {
    let params = new HttpParams();

    if (filters.type) {
      params = params.set("type", filters.type);
    }
    if (filters.startDate) {
      params = params.set("startDate", filters.startDate);
    }
    if (filters.endDate) {
      params = params.set("endDate", filters.endDate);
    }

    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/filter`, {
      params,
    });
  }

  createTransaction(
    request: CreateTransactionRequest
  ): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/transactions/create`,
      request
    );
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/transactions/${id}`);
  }

  updateTransaction(
    id: number,
    transaction: Transaction
  ): Observable<Transaction> {
    return this.http.put<Transaction>(
      `${this.apiUrl}/transactions/update/${id}`,
      transaction
    );
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/transactions/delete/${id}`);
  }
}
