import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { LoginRequest } from "../../../models/user.model";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card fade-in">
            <div class="card-header text-center">
              <h3><i class="fas fa-sign-in-alt me-2"></i>Login to FinTrade</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    formControlName="username"
                    [class.is-invalid]="isFieldInvalid('username')"
                    placeholder="Enter your username"
                  />
                  <div
                    class="invalid-feedback"
                    *ngIf="isFieldInvalid('username')"
                  >
                    Username is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [class.is-invalid]="isFieldInvalid('password')"
                    placeholder="Enter your password"
                  />
                  <div
                    class="invalid-feedback"
                    *ngIf="isFieldInvalid('password')"
                  >
                    Password is required
                  </div>
                </div>

                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    <span
                      *ngIf="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    <i *ngIf="!isLoading" class="fas fa-sign-in-alt me-2"></i>
                    {{ isLoading ? "Signing in..." : "Sign In" }}
                  </button>
                </div>

                <div class="text-center mt-3">
                  <p class="mb-0">
                    Don't have an account?
                    <a routerLink="/register" class="text-decoration-none"
                      >Sign up here</a
                    >
                  </p>
                </div>
              </form>

              <div class="alert alert-danger mt-3" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i
                >{{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding-top: 5rem;
      }

      .card {
        border: none;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }

      .form-control:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
      }

      .btn-primary {
        padding: 0.75rem;
        font-weight: 600;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";

      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message || "Login failed. Please try again.";
        },
      });
    }
  }
}
