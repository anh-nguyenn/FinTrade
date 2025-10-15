import { Routes } from "@angular/router";
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { PortfolioComponent } from "./components/portfolio/portfolio.component";
import { TransactionsComponent } from "./components/transactions/transactions.component";
import { AdminComponent } from "./components/admin/admin.component";
import { authGuard } from "./guards/auth.guard";
import { adminGuard } from "./guards/admin.guard";

export const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: "portfolio",
    component: PortfolioComponent,
    canActivate: [authGuard],
  },
  {
    path: "transactions",
    component: TransactionsComponent,
    canActivate: [authGuard],
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [adminGuard],
  },
  { path: "**", redirectTo: "/dashboard" },
];
