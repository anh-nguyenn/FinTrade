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
import { RegisterRequest } from "../../../models/user.model";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card fade-in">
            <div class="card-header text-center">
              <h3><i class="fas fa-user-plus me-2"></i>Create Account</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="firstName"
                      formControlName="firstName"
                      [class.is-invalid]="isFieldInvalid('firstName')"
                      placeholder="First name"
                    />
                    <div
                      class="invalid-feedback"
                      *ngIf="isFieldInvalid('firstName')"
                    >
                      First name is required
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="lastName"
                      formControlName="lastName"
                      [class.is-invalid]="isFieldInvalid('lastName')"
                      placeholder="Last name"
                    />
                    <div
                      class="invalid-feedback"
                      *ngIf="isFieldInvalid('lastName')"
                    >
                      Last name is required
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    formControlName="username"
                    [class.is-invalid]="isFieldInvalid('username')"
                    placeholder="Choose a username"
                  />
                  <div
                    class="invalid-feedback"
                    *ngIf="isFieldInvalid('username')"
                  >
                    Username is required (3-50 characters)
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="isFieldInvalid('email')"
                    placeholder="Enter your email"
                  />
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                    Please enter a valid email address
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
                    placeholder="Create a password"
                  />
                  <div
                    class="invalid-feedback"
                    *ngIf="isFieldInvalid('password')"
                  >
                    Password is required (6-100 characters)
                  </div>
                </div>

                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="registerForm.invalid || isLoading"
                  >
                    <span
                      *ngIf="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    <i *ngIf="!isLoading" class="fas fa-user-plus me-2"></i>
                    {{ isLoading ? "Creating Account..." : "Create Account" }}
                  </button>
                </div>

                <div class="text-center mt-3">
                  <p class="mb-0">
                    Already have an account?
                    <a routerLink="/login" class="text-decoration-none"
                      >Sign in here</a
                    >
                  </p>
                </div>
              </form>

              <div class="alert alert-danger mt-3" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i
                >{{ errorMessage }}
              </div>

              <div class="alert alert-success mt-3" *ngIf="successMessage">
                <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
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
        padding-top: 3rem;
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = "";
  successMessage = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(50)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      username: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      email: [
        "",
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      const registerRequest: RegisterRequest = this.registerForm.value;

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = "Account created successfully! Please sign in.";
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message || "Registration failed. Please try again.";
        },
      });
    }
  }
}
