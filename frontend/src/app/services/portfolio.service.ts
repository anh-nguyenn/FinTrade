import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import {
  Portfolio,
  PortfolioSummary,
  AddToPortfolioRequest,
  RemoveFromPortfolioRequest,
} from "../models/portfolio.model";

@Injectable({
  providedIn: "root",
})
export class PortfolioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/portfolio/all`);
  }

  searchPortfolios(symbol: string): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(
      `${this.apiUrl}/portfolio/search?symbol=${symbol}`
    );
  }

  getPortfolioSummary(): Observable<PortfolioSummary> {
    return this.http.get<PortfolioSummary>(`${this.apiUrl}/portfolio/summary`);
  }

  addToPortfolio(request: AddToPortfolioRequest): Observable<Portfolio> {
    return this.http.post<Portfolio>(`${this.apiUrl}/portfolio/add`, request);
  }

  removeFromPortfolio(request: RemoveFromPortfolioRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/portfolio/remove`, request);
  }

  updatePortfolio(id: number, portfolio: Portfolio): Observable<Portfolio> {
    return this.http.put<Portfolio>(
      `${this.apiUrl}/portfolio/update/${id}`,
      portfolio
    );
  }

  deletePortfolio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/portfolio/delete/${id}`);
  }
}
