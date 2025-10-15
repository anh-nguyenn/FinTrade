import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PortfolioService } from "../../services/portfolio.service";
import { TransactionService } from "../../services/transaction.service";
import { Portfolio, PortfolioSummary } from "../../models/portfolio.model";
import { Transaction } from "../../models/transaction.model";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">
            <i class="fas fa-tachometer-alt me-2"></i>Dashboard
            <small class="text-muted"
              >Welcome back,
              {{ authService.getCurrentUser()?.firstName }}!</small
            >
          </h1>
        </div>
      </div>

      <!-- Portfolio Summary Cards -->
      <div class="row mb-4" *ngIf="portfolioSummary">
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="dashboard-card">
            <h3>
              <i class="fas fa-dollar-sign me-2"></i
              >{{
                portfolioSummary.totalValue
                  | currency : "USD" : "symbol" : "1.2-2"
              }}
            </h3>
            <p>Total Portfolio Value</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div
            class="dashboard-card"
            [class.profit]="portfolioSummary.totalProfitLoss >= 0"
            [class.loss]="portfolioSummary.totalProfitLoss < 0"
          >
            <h3>
              <i class="fas fa-chart-line me-2"></i
              >{{
                portfolioSummary.totalProfitLoss
                  | currency : "USD" : "symbol" : "1.2-2"
              }}
            </h3>
            <p>Total P&L</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="dashboard-card">
            <h3>
              <i class="fas fa-briefcase me-2"></i>{{ portfolioItems.length }}
            </h3>
            <p>Portfolio Items</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="dashboard-card">
            <h3>
              <i class="fas fa-exchange-alt me-2"></i
              >{{ recentTransactions.length }}
            </h3>
            <p>Recent Transactions</p>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Portfolio Overview -->
        <div class="col-lg-8 mb-4">
          <div class="card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">
                <i class="fas fa-briefcase me-2"></i>Portfolio Overview
              </h5>
              <a routerLink="/portfolio" class="btn btn-sm btn-outline-light"
                >View All</a
              >
            </div>
            <div class="card-body">
              <div *ngIf="isLoadingPortfolio" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div
                *ngIf="!isLoadingPortfolio && portfolioItems.length === 0"
                class="text-center py-4"
              >
                <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
                <p class="text-muted">
                  No portfolio items yet. Start by adding some transactions!
                </p>
                <a routerLink="/transactions" class="btn btn-primary"
                  >Add Transaction</a
                >
              </div>

              <div
                *ngIf="!isLoadingPortfolio && portfolioItems.length > 0"
                class="table-responsive"
              >
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Company</th>
                      <th>Quantity</th>
                      <th>Avg Price</th>
                      <th>Current Price</th>
                      <th>P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of portfolioItems.slice(0, 5)">
                      <td>
                        <strong>{{ item.symbol }}</strong>
                      </td>
                      <td>{{ item.companyName }}</td>
                      <td>{{ item.quantity | number : "1.2-2" }}</td>
                      <td>
                        {{
                          item.averagePrice
                            | currency : "USD" : "symbol" : "1.2-2"
                        }}
                      </td>
                      <td>
                        {{
                          item.currentPrice
                            | currency : "USD" : "symbol" : "1.2-2"
                        }}
                      </td>
                      <td
                        [class.profit]="item.profitLoss >= 0"
                        [class.loss]="item.profitLoss < 0"
                      >
                        {{
                          item.profitLoss
                            | currency : "USD" : "symbol" : "1.2-2"
                        }}
                        <small class="d-block"
                          >({{
                            item.profitLossPercentage | number : "1.2-2"
                          }}%)</small
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="col-lg-4 mb-4">
          <div class="card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">
                <i class="fas fa-exchange-alt me-2"></i>Recent Transactions
              </h5>
              <a routerLink="/transactions" class="btn btn-sm btn-outline-light"
                >View All</a
              >
            </div>
            <div class="card-body">
              <div *ngIf="isLoadingTransactions" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div
                *ngIf="
                  !isLoadingTransactions && recentTransactions.length === 0
                "
                class="text-center py-4"
              >
                <i class="fas fa-exchange-alt fa-3x text-muted mb-3"></i>
                <p class="text-muted">No transactions yet. Start trading!</p>
                <a routerLink="/transactions" class="btn btn-primary"
                  >Add Transaction</a
                >
              </div>

              <div
                *ngIf="!isLoadingTransactions && recentTransactions.length > 0"
              >
                <div
                  *ngFor="let transaction of recentTransactions.slice(0, 5)"
                  class="transaction-item"
                  [class.transaction-buy]="
                    transaction.transactionType === 'BUY'
                  "
                  [class.transaction-sell]="
                    transaction.transactionType === 'SELL'
                  "
                >
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{{ transaction.symbol }}</strong>
                      <small class="d-block text-muted">{{
                        transaction.companyName
                      }}</small>
                    </div>
                    <div class="text-end">
                      <span
                        class="badge"
                        [class.bg-success]="
                          transaction.transactionType === 'BUY'
                        "
                        [class.bg-danger]="
                          transaction.transactionType === 'SELL'
                        "
                      >
                        {{ transaction.transactionType }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-2">
                    <small class="text-muted">
                      {{ transaction.quantity | number : "1.2-2" }} @
                      {{
                        transaction.price
                          | currency : "USD" : "symbol" : "1.2-2"
                      }}
                    </small>
                    <div class="fw-bold">
                      {{
                        transaction.totalAmount
                          | currency : "USD" : "symbol" : "1.2-2"
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 20px;
        padding: 2rem;
        text-align: center;
        transition: transform 0.3s ease;
      }

      .dashboard-card:hover {
        transform: translateY(-5px);
      }

      .dashboard-card.profit {
        background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
      }

      .dashboard-card.loss {
        background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
      }

      .transaction-item {
        background: white;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      .transaction-buy {
        border-left-color: #28a745;
      }

      .transaction-sell {
        border-left-color: #dc3545;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  portfolioItems: Portfolio[] = [];
  recentTransactions: Transaction[] = [];
  portfolioSummary: PortfolioSummary | null = null;
  isLoadingPortfolio = false;
  isLoadingTransactions = false;

  constructor(
    public authService: AuthService,
    private portfolioService: PortfolioService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadPortfolioData();
    this.loadRecentTransactions();
  }

  loadPortfolioData(): void {
    this.isLoadingPortfolio = true;
    this.portfolioService.getAllPortfolios().subscribe({
      next: (portfolios) => {
        this.portfolioItems = portfolios;
        this.isLoadingPortfolio = false;
      },
      error: (error) => {
        console.error("Error loading portfolio:", error);
        this.isLoadingPortfolio = false;
      },
    });

    this.portfolioService.getPortfolioSummary().subscribe({
      next: (summary) => {
        this.portfolioSummary = summary;
      },
      error: (error) => {
        console.error("Error loading portfolio summary:", error);
      },
    });
  }

  loadRecentTransactions(): void {
    this.isLoadingTransactions = true;
    this.transactionService.getRecentTransactions(5).subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions;
        this.isLoadingTransactions = false;
      },
      error: (error) => {
        console.error("Error loading recent transactions:", error);
        this.isLoadingTransactions = false;
      },
    });
  }
}
