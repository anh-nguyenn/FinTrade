import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { PortfolioService } from "../../services/portfolio.service";
import {
  Portfolio,
  AddToPortfolioRequest,
  RemoveFromPortfolioRequest,
} from "../../models/portfolio.model";

@Component({
  selector: "app-portfolio",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1><i class="fas fa-briefcase me-2"></i>Portfolio</h1>
            <button
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#addToPortfolioModal"
            >
              <i class="fas fa-plus me-2"></i>Add to Portfolio
            </button>
          </div>
        </div>
      </div>

      <!-- Portfolio Summary -->
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
            <p>Total Value</p>
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
            <p>Total Holdings</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="dashboard-card">
            <h3>
              <i class="fas fa-percentage me-2"></i
              >{{ getTotalReturnPercentage() | number : "1.2-2" }}%
            </h3>
            <p>Total Return</p>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input
              type="text"
              class="form-control"
              placeholder="Search by symbol or company name..."
              [(ngModel)]="searchTerm"
              (input)="filterPortfolio()"
            />
          </div>
        </div>
        <div class="col-md-6 text-end">
          <button
            class="btn btn-outline-secondary me-2"
            (click)="loadPortfolio()"
          >
            <i class="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
      </div>

      <!-- Portfolio Table -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-table me-2"></i>Portfolio Holdings
              </h5>
            </div>
            <div class="card-body">
              <div *ngIf="isLoading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div
                *ngIf="!isLoading && filteredPortfolioItems.length === 0"
                class="text-center py-5"
              >
                <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No portfolio items found</h5>
                <p class="text-muted">
                  Start by adding some transactions to build your portfolio.
                </p>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#addToPortfolioModal"
                >
                  <i class="fas fa-plus me-2"></i>Add to Portfolio
                </button>
              </div>

              <div
                *ngIf="!isLoading && filteredPortfolioItems.length > 0"
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
                      <th>Total Value</th>
                      <th>Total Cost</th>
                      <th>P&L</th>
                      <th>P&L %</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of filteredPortfolioItems">
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
                      <td>
                        {{
                          item.totalValue
                            | currency : "USD" : "symbol" : "1.2-2"
                        }}
                      </td>
                      <td>
                        {{
                          item.totalCost | currency : "USD" : "symbol" : "1.2-2"
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
                      </td>
                      <td
                        [class.profit]="item.profitLossPercentage >= 0"
                        [class.loss]="item.profitLossPercentage < 0"
                      >
                        {{ item.profitLossPercentage | number : "1.2-2" }}%
                      </td>
                      <td>
                        <div class="btn-group" role="group">
                          <button
                            class="btn btn-sm btn-outline-primary"
                            (click)="editPortfolioItem(item)"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            (click)="removeFromPortfolio(item)"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add to Portfolio Modal -->
    <div class="modal fade" id="addToPortfolioModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-plus me-2"></i>Add to Portfolio
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form
              [formGroup]="addToPortfolioForm"
              (ngSubmit)="onAddToPortfolio()"
            >
              <div class="mb-3">
                <label for="symbol" class="form-label">Symbol</label>
                <input
                  type="text"
                  class="form-control"
                  id="symbol"
                  formControlName="symbol"
                  placeholder="e.g., AAPL"
                  [class.is-invalid]="isFieldInvalid('symbol')"
                />
                <div class="invalid-feedback" *ngIf="isFieldInvalid('symbol')">
                  Symbol is required
                </div>
              </div>

              <div class="mb-3">
                <label for="companyName" class="form-label">Company Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="companyName"
                  formControlName="companyName"
                  placeholder="e.g., Apple Inc."
                  [class.is-invalid]="isFieldInvalid('companyName')"
                />
                <div
                  class="invalid-feedback"
                  *ngIf="isFieldInvalid('companyName')"
                >
                  Company name is required
                </div>
              </div>

              <div class="mb-3">
                <label for="quantity" class="form-label">Quantity</label>
                <input
                  type="number"
                  class="form-control"
                  id="quantity"
                  formControlName="quantity"
                  placeholder="0.00"
                  step="0.01"
                  [class.is-invalid]="isFieldInvalid('quantity')"
                />
                <div
                  class="invalid-feedback"
                  *ngIf="isFieldInvalid('quantity')"
                >
                  Quantity is required and must be greater than 0
                </div>
              </div>

              <div class="mb-3">
                <label for="price" class="form-label">Price per Share</label>
                <input
                  type="number"
                  class="form-control"
                  id="price"
                  formControlName="price"
                  placeholder="0.00"
                  step="0.01"
                  [class.is-invalid]="isFieldInvalid('price')"
                />
                <div class="invalid-feedback" *ngIf="isFieldInvalid('price')">
                  Price is required and must be greater than 0
                </div>
              </div>

              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="addToPortfolioForm.invalid || isAdding"
                >
                  <span
                    *ngIf="isAdding"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i *ngIf="!isAdding" class="fas fa-plus me-2"></i>
                  {{ isAdding ? "Adding..." : "Add to Portfolio" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Remove from Portfolio Modal -->
    <div class="modal fade" id="removeFromPortfolioModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-trash me-2"></i>Remove from Portfolio
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to remove
              <strong>{{ selectedItem?.symbol }}</strong> from your portfolio?
            </p>
            <p class="text-muted">This action cannot be undone.</p>

            <form
              [formGroup]="removeFromPortfolioForm"
              (ngSubmit)="onRemoveFromPortfolio()"
            >
              <div class="mb-3">
                <label for="removeQuantity" class="form-label"
                  >Quantity to Remove</label
                >
                <input
                  type="number"
                  class="form-control"
                  id="removeQuantity"
                  formControlName="quantity"
                  [max]="selectedItem?.quantity"
                  step="0.01"
                  [class.is-invalid]="isFieldInvalid('quantity')"
                />
                <div
                  class="invalid-feedback"
                  *ngIf="isFieldInvalid('quantity')"
                >
                  Quantity is required and must be between 0 and
                  {{ selectedItem?.quantity }}
                </div>
                <small class="form-text text-muted">
                  Available:
                  {{ selectedItem?.quantity | number : "1.2-2" }} shares
                </small>
              </div>

              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-danger"
                  [disabled]="removeFromPortfolioForm.invalid || isRemoving"
                >
                  <span
                    *ngIf="isRemoving"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i *ngIf="!isRemoving" class="fas fa-trash me-2"></i>
                  {{ isRemoving ? "Removing..." : "Remove from Portfolio" }}
                </button>
              </div>
            </form>
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

      .profit {
        color: #28a745;
        font-weight: bold;
      }

      .loss {
        color: #dc3545;
        font-weight: bold;
      }
    `,
  ],
})
export class PortfolioComponent implements OnInit {
  portfolioItems: Portfolio[] = [];
  filteredPortfolioItems: Portfolio[] = [];
  portfolioSummary: any = null;
  searchTerm = "";
  isLoading = false;
  isAdding = false;
  isRemoving = false;
  selectedItem: Portfolio | null = null;

  addToPortfolioForm: FormGroup;
  removeFromPortfolioForm: FormGroup;

  constructor(
    private portfolioService: PortfolioService,
    private formBuilder: FormBuilder
  ) {
    this.addToPortfolioForm = this.formBuilder.group({
      symbol: ["", [Validators.required]],
      companyName: ["", [Validators.required]],
      quantity: ["", [Validators.required, Validators.min(0.01)]],
      price: ["", [Validators.required, Validators.min(0.01)]],
    });

    this.removeFromPortfolioForm = this.formBuilder.group({
      quantity: ["", [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.isLoading = true;
    this.portfolioService.getAllPortfolios().subscribe({
      next: (portfolios) => {
        this.portfolioItems = portfolios;
        this.filteredPortfolioItems = portfolios;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading portfolio:", error);
        this.isLoading = false;
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

  filterPortfolio(): void {
    if (!this.searchTerm) {
      this.filteredPortfolioItems = this.portfolioItems;
    } else {
      this.filteredPortfolioItems = this.portfolioItems.filter(
        (item) =>
          item.symbol.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.companyName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getTotalReturnPercentage(): number {
    if (!this.portfolioSummary || this.portfolioSummary.totalCost === 0) {
      return 0;
    }
    return (
      (this.portfolioSummary.totalProfitLoss /
        this.portfolioSummary.totalCost) *
      100
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    const field =
      this.addToPortfolioForm.get(fieldName) ||
      this.removeFromPortfolioForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onAddToPortfolio(): void {
    if (this.addToPortfolioForm.valid) {
      this.isAdding = true;
      const request: AddToPortfolioRequest = this.addToPortfolioForm.value;

      this.portfolioService.addToPortfolio(request).subscribe({
        next: (response) => {
          this.isAdding = false;
          this.addToPortfolioForm.reset();
          this.loadPortfolio();
          // Close modal
          const modal = document.getElementById("addToPortfolioModal");
          if (modal) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(
              modal
            );
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        },
        error: (error) => {
          console.error("Error adding to portfolio:", error);
          this.isAdding = false;
        },
      });
    }
  }

  editPortfolioItem(item: Portfolio): void {
    // Implementation for editing portfolio item
    console.log("Edit portfolio item:", item);
  }

  removeFromPortfolio(item: Portfolio): void {
    this.selectedItem = item;
    this.removeFromPortfolioForm.patchValue({
      quantity: item.quantity,
    });
    // Show modal
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById("removeFromPortfolioModal")
    );
    modal.show();
  }

  onRemoveFromPortfolio(): void {
    if (this.removeFromPortfolioForm.valid && this.selectedItem) {
      this.isRemoving = true;
      const request: RemoveFromPortfolioRequest = {
        symbol: this.selectedItem.symbol,
        quantity: this.removeFromPortfolioForm.value.quantity,
      };

      this.portfolioService.removeFromPortfolio(request).subscribe({
        next: (response) => {
          this.isRemoving = false;
          this.removeFromPortfolioForm.reset();
          this.loadPortfolio();
          // Close modal
          const modal = document.getElementById("removeFromPortfolioModal");
          if (modal) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(
              modal
            );
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        },
        error: (error) => {
          console.error("Error removing from portfolio:", error);
          this.isRemoving = false;
        },
      });
    }
  }
}
