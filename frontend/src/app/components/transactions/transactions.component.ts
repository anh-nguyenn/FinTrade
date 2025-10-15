import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { TransactionService } from "../../services/transaction.service";
import {
  Transaction,
  CreateTransactionRequest,
  TransactionFilters,
} from "../../models/transaction.model";

@Component({
  selector: "app-transactions",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1><i class="fas fa-exchange-alt me-2"></i>Transactions</h1>
            <button
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#addTransactionModal"
            >
              <i class="fas fa-plus me-2"></i>Add Transaction
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="typeFilter" class="form-label"
                      >Transaction Type</label
                    >
                    <select
                      class="form-select"
                      id="typeFilter"
                      formControlName="type"
                    >
                      <option value="">All Types</option>
                      <option value="BUY">Buy</option>
                      <option value="SELL">Sell</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="startDate" class="form-label">Start Date</label>
                    <input
                      type="date"
                      class="form-control"
                      id="startDate"
                      formControlName="startDate"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="endDate" class="form-label">End Date</label>
                    <input
                      type="date"
                      class="form-control"
                      id="endDate"
                      formControlName="endDate"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label class="form-label">&nbsp;</label>
                    <div class="d-grid">
                      <button type="submit" class="btn btn-outline-primary">
                        <i class="fas fa-filter me-1"></i>Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input
              type="text"
              class="form-control"
              placeholder="Search by symbol or company name..."
              [(ngModel)]="searchTerm"
              (input)="filterTransactions()"
            />
          </div>
        </div>
        <div class="col-md-6 text-end">
          <button
            class="btn btn-outline-secondary me-2"
            (click)="loadTransactions()"
          >
            <i class="fas fa-sync-alt me-1"></i>Refresh
          </button>
          <button class="btn btn-outline-warning" (click)="clearFilters()">
            <i class="fas fa-times me-1"></i>Clear Filters
          </button>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-table me-2"></i>Transaction History
              </h5>
            </div>
            <div class="card-body">
              <div *ngIf="isLoading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div
                *ngIf="!isLoading && filteredTransactions.length === 0"
                class="text-center py-5"
              >
                <i class="fas fa-exchange-alt fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No transactions found</h5>
                <p class="text-muted">
                  Start by adding your first transaction.
                </p>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#addTransactionModal"
                >
                  <i class="fas fa-plus me-2"></i>Add Transaction
                </button>
              </div>

              <div
                *ngIf="!isLoading && filteredTransactions.length > 0"
                class="table-responsive"
              >
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Symbol</th>
                      <th>Company</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Commission</th>
                      <th>Total Amount</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let transaction of filteredTransactions">
                      <td>
                        {{ transaction.transactionDate | date : "short" }}
                      </td>
                      <td>
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
                      </td>
                      <td>
                        <strong>{{ transaction.symbol }}</strong>
                      </td>
                      <td>{{ transaction.companyName }}</td>
                      <td>{{ transaction.quantity | number : "1.2-2" }}</td>
                      <td>
                        {{
                          transaction.price
                            | currency : "USD" : "symbol" : "1.2-2"
                        }}
                      </td>
                      <td>
                        {{
                          transaction.commission
                            | currency : "USD" : "symbol" : "1.2-2"
                        }}
                      </td>
                      <td>
                        <strong>{{
                          transaction.totalAmount
                            | currency : "USD" : "symbol" : "1.2-2"
                        }}</strong>
                      </td>
                      <td>{{ transaction.notes || "-" }}</td>
                      <td>
                        <div class="btn-group" role="group">
                          <button
                            class="btn btn-sm btn-outline-primary"
                            (click)="editTransaction(transaction)"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            (click)="deleteTransaction(transaction)"
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

    <!-- Add Transaction Modal -->
    <div class="modal fade" id="addTransactionModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-plus me-2"></i>Add Transaction
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form
              [formGroup]="transactionForm"
              (ngSubmit)="onSubmitTransaction()"
            >
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="transactionType" class="form-label"
                    >Transaction Type</label
                  >
                  <select
                    class="form-select"
                    id="transactionType"
                    formControlName="transactionType"
                    [class.is-invalid]="isFieldInvalid('transactionType')"
                  >
                    <option value="">Select Type</option>
                    <option value="BUY">Buy</option>
                    <option value="SELL">Sell</option>
                  </select>
                  <div
                    class="invalid-feedback"
                    *ngIf="isFieldInvalid('transactionType')"
                  >
                    Transaction type is required
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="symbol" class="form-label">Symbol</label>
                  <input
                    type="text"
                    class="form-control"
                    id="symbol"
                    formControlName="symbol"
                    placeholder="e.g., AAPL"
                    [class.is-invalid]="isFieldInvalid('symbol')"
                  />
                  <div
                    class="invalid-feedback"
                    *ngIf="isFieldInvalid('symbol')"
                  >
                    Symbol is required
                  </div>
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

              <div class="row">
                <div class="col-md-6 mb-3">
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

                <div class="col-md-6 mb-3">
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
              </div>

              <div class="mb-3">
                <label for="commission" class="form-label"
                  >Commission (Optional)</label
                >
                <input
                  type="number"
                  class="form-control"
                  id="commission"
                  formControlName="commission"
                  placeholder="0.00"
                  step="0.01"
                  value="0"
                />
              </div>

              <div class="mb-3">
                <label for="notes" class="form-label">Notes (Optional)</label>
                <textarea
                  class="form-control"
                  id="notes"
                  formControlName="notes"
                  rows="3"
                  placeholder="Add any notes about this transaction..."
                ></textarea>
              </div>

              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="transactionForm.invalid || isSubmitting"
                >
                  <span
                    *ngIf="isSubmitting"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i *ngIf="!isSubmitting" class="fas fa-plus me-2"></i>
                  {{ isSubmitting ? "Adding..." : "Add Transaction" }}
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
      .transaction-buy {
        border-left-color: #28a745;
      }

      .transaction-sell {
        border-left-color: #dc3545;
      }
    `,
  ],
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  searchTerm = "";
  isLoading = false;
  isSubmitting = false;

  transactionForm: FormGroup;
  filterForm: FormGroup;

  constructor(
    private transactionService: TransactionService,
    private formBuilder: FormBuilder
  ) {
    this.transactionForm = this.formBuilder.group({
      transactionType: ["", [Validators.required]],
      symbol: ["", [Validators.required]],
      companyName: ["", [Validators.required]],
      quantity: ["", [Validators.required, Validators.min(0.01)]],
      price: ["", [Validators.required, Validators.min(0.01)]],
      commission: [0],
      notes: [""],
    });

    this.filterForm = this.formBuilder.group({
      type: [""],
      startDate: [""],
      endDate: [""],
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.filteredTransactions = transactions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading transactions:", error);
        this.isLoading = false;
      },
    });
  }

  filterTransactions(): void {
    if (!this.searchTerm) {
      this.filteredTransactions = this.transactions;
    } else {
      this.filteredTransactions = this.transactions.filter(
        (transaction) =>
          transaction.symbol
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          transaction.companyName
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }
  }

  applyFilters(): void {
    const filters: TransactionFilters = this.filterForm.value;

    if (filters.type || filters.startDate || filters.endDate) {
      this.transactionService.filterTransactions(filters).subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.filteredTransactions = transactions;
        },
        error: (error) => {
          console.error("Error filtering transactions:", error);
        },
      });
    } else {
      this.loadTransactions();
    }
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.searchTerm = "";
    this.loadTransactions();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmitTransaction(): void {
    if (this.transactionForm.valid) {
      this.isSubmitting = true;
      const request: CreateTransactionRequest = this.transactionForm.value;

      this.transactionService.createTransaction(request).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.transactionForm.reset();
          this.loadTransactions();
          // Close modal
          const modal = document.getElementById("addTransactionModal");
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
          console.error("Error creating transaction:", error);
          this.isSubmitting = false;
        },
      });
    }
  }

  editTransaction(transaction: Transaction): void {
    // Implementation for editing transaction
    console.log("Edit transaction:", transaction);
  }

  deleteTransaction(transaction: Transaction): void {
    if (
      confirm(
        `Are you sure you want to delete this ${transaction.transactionType} transaction for ${transaction.symbol}?`
      )
    ) {
      this.transactionService.deleteTransaction(transaction.id).subscribe({
        next: (response) => {
          this.loadTransactions();
        },
        error: (error) => {
          console.error("Error deleting transaction:", error);
        },
      });
    }
  }
}
