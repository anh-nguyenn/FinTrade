import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="fas fa-chart-line me-2"></i>FinTrade
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto" *ngIf="authService.isLoggedIn()">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/dashboard"
                routerLinkActive="active"
              >
                <i class="fas fa-tachometer-alt me-1"></i>Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/portfolio"
                routerLinkActive="active"
              >
                <i class="fas fa-briefcase me-1"></i>Portfolio
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/transactions"
                routerLinkActive="active"
              >
                <i class="fas fa-exchange-alt me-1"></i>Transactions
              </a>
            </li>
            <li class="nav-item" *ngIf="authService.isAdmin()">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active">
                <i class="fas fa-users-cog me-1"></i>Admin
              </a>
            </li>
          </ul>

          <ul class="navbar-nav" *ngIf="authService.isLoggedIn()">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-user me-1"></i
                >{{ authService.getCurrentUser()?.firstName }}
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" (click)="logout()">
                    <i class="fas fa-sign-out-alt me-1"></i>Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <ul class="navbar-nav" *ngIf="!authService.isLoggedIn()">
            <li class="nav-item">
              <a class="nav-link" routerLink="/login">
                <i class="fas fa-sign-in-alt me-1"></i>Login
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/register">
                <i class="fas fa-user-plus me-1"></i>Register
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        padding: 1rem 0;
      }

      .navbar-brand {
        font-size: 1.5rem;
        font-weight: bold;
      }

      .nav-link {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        margin: 0 0.25rem;
        transition: all 0.3s ease;
      }

      .nav-link:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .nav-link.active {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .dropdown-menu {
        border: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }

      .dropdown-item {
        padding: 0.75rem 1rem;
        transition: all 0.3s ease;
      }

      .dropdown-item:hover {
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
