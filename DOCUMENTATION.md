# FinTrade - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Setup and Installation](#setup-and-installation)
8. [Usage Guide](#usage-guide)
9. [Security Features](#security-features)
10. [Development Guide](#development-guide)

---

## Project Overview

**FinTrade** is a comprehensive full-stack trading web application that allows users to manage their investment portfolios, track transactions, and monitor profit/loss in real-time. The application is built with modern web technologies and follows industry best practices for security and scalability.

### Key Features

- **User Authentication & Authorization**: Secure JWT-based login system with role-based access control
- **Portfolio Management**: Real-time portfolio tracking with automatic P&L calculations
- **Transaction Management**: Complete CRUD operations for buy/sell transactions
- **Admin Panel**: User management and system administration
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Real-time Data**: Live portfolio value calculations and profit/loss tracking

### Technology Stack

- **Backend**: Java 17, Spring Boot 3.2.0, Spring Security, Spring Data JPA, MySQL
- **Frontend**: Angular 17, TypeScript, Bootstrap 5, Font Awesome
- **Database**: MySQL 8.0 with JPA/Hibernate ORM
- **Authentication**: JWT tokens with configurable expiration
- **Build Tools**: Maven (backend), Angular CLI (frontend)

---

## Architecture Overview

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Angular)     │◄──►│   (Spring Boot) │◄──►│   (MySQL)       │
│   Port: 4200    │    │   Port: 8080    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture

#### Frontend (Angular)

```
src/app/
├── components/           # UI Components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Main dashboard
│   ├── portfolio/       # Portfolio management
│   ├── transactions/    # Transaction management
│   ├── admin/          # Admin panel
│   └── shared/         # Shared components
├── services/            # API Services
├── models/              # TypeScript interfaces
├── guards/              # Route guards
├── interceptors/        # HTTP interceptors
└── utils/               # Utility functions
```

#### Backend (Spring Boot)

```
src/main/java/com/fintrade/
├── controller/          # REST Controllers
├── service/            # Business Logic Layer
├── repository/         # Data Access Layer
├── entity/             # JPA Entities
├── dto/                # Data Transfer Objects
├── security/           # Security Configuration
└── exception/          # Exception Handling
```

---

## Backend Documentation

### Project Structure

The backend follows the **Spring Boot** framework with a layered architecture:

#### 1. Main Application Class

```java
@SpringBootApplication
public class FintradeBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(FintradeBackendApplication.class, args);
    }
}
```

#### 2. Entity Layer (Data Models)

##### User Entity

The `User` entity represents application users and implements Spring Security's `UserDetails` interface:

```java
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(unique = true)
    private String username;

    @NotBlank
    @Size(max = 100)
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(max = 100)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // ... other fields and methods
}
```

**Key Features:**

- Implements `UserDetails` for Spring Security integration
- Automatic timestamp management with `@PrePersist` and `@PreUpdate`
- Role-based access control with `USER` and `ADMIN` roles
- Email and username uniqueness constraints

##### Portfolio Entity

The `Portfolio` entity tracks user's stock holdings:

```java
@Entity
@Table(name = "portfolios")
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 10)
    private String symbol;

    @NotBlank
    @Size(max = 100)
    private String companyName;

    @NotNull
    @PositiveOrZero
    private BigDecimal quantity;

    @NotNull
    @PositiveOrZero
    private BigDecimal averagePrice;

    @NotNull
    @PositiveOrZero
    private BigDecimal currentPrice;

    // Calculated fields
    private BigDecimal totalValue;
    private BigDecimal totalCost;
    private BigDecimal profitLoss;
    private BigDecimal profitLossPercentage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ... other fields and methods
}
```

**Key Features:**

- Automatic calculation of portfolio values in `@PrePersist` and `@PreUpdate`
- Many-to-one relationship with User entity
- BigDecimal precision for financial calculations
- Real-time P&L calculations

##### Transaction Entity

The `Transaction` entity records buy/sell operations:

```java
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 10)
    private String symbol;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @NotNull
    @Positive
    private BigDecimal quantity;

    @NotNull
    @Positive
    private BigDecimal price;

    private BigDecimal commission = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ... other fields and methods

    public enum TransactionType {
        BUY, SELL
    }
}
```

**Key Features:**

- Enum for transaction types (BUY/SELL)
- Automatic total amount calculation including commission
- Many-to-one relationship with User entity
- Flexible commission tracking

#### 3. Repository Layer (Data Access)

The repositories extend `JpaRepository` for basic CRUD operations:

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByUser(User user);
    Optional<Portfolio> findByUserAndSymbol(User user, String symbol);
    List<Portfolio> findByUserAndSymbolContainingIgnoreCase(User user, String symbol);
}

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByTransactionDateDesc(User user);
    List<Transaction> findByUserAndTransactionTypeOrderByTransactionDateDesc(User user, TransactionType type);
    List<Transaction> findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(User user, LocalDateTime start, LocalDateTime end);
}
```

#### 4. Service Layer (Business Logic)

##### UserService

Handles user management and authentication:

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
```

##### PortfolioService

Manages portfolio operations and calculations:

```java
@Service
public class PortfolioService {
    @Autowired
    private PortfolioRepository portfolioRepository;

    public List<Portfolio> getPortfoliosByUser(User user) {
        return portfolioRepository.findByUser(user);
    }

    public Portfolio addToPortfolio(User user, String symbol, String companyName,
                                   BigDecimal quantity, BigDecimal price) {
        Optional<Portfolio> existingPortfolio = portfolioRepository
            .findByUserAndSymbol(user, symbol);

        if (existingPortfolio.isPresent()) {
            // Update existing portfolio
            Portfolio portfolio = existingPortfolio.get();
            BigDecimal newQuantity = portfolio.getQuantity().add(quantity);
            BigDecimal newTotalCost = portfolio.getTotalCost().add(quantity.multiply(price));
            BigDecimal newAveragePrice = newTotalCost.divide(newQuantity, 2, RoundingMode.HALF_UP);

            portfolio.setQuantity(newQuantity);
            portfolio.setAveragePrice(newAveragePrice);
            portfolio.setTotalCost(newTotalCost);

            return portfolioRepository.save(portfolio);
        } else {
            // Create new portfolio entry
            Portfolio portfolio = new Portfolio(symbol, companyName, quantity, price, price, user);
            return portfolioRepository.save(portfolio);
        }
    }

    public BigDecimal getTotalPortfolioValue(User user) {
        return portfolioRepository.findByUser(user)
            .stream()
            .map(Portfolio::getTotalValue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

##### TransactionService

Handles transaction management:

```java
@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByUser(User user) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user);
    }

    public List<Transaction> getRecentTransactions(User user, int limit) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user)
            .stream()
            .limit(limit)
            .collect(Collectors.toList());
    }
}
```

#### 5. Controller Layer (REST API)

##### AuthController

Handles authentication endpoints:

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken((UserDetails) authentication.getPrincipal());

        User user = (User) authentication.getPrincipal();
        List<String> roles = user.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getUsername(),
                                               user.getEmail(), user.getFirstName(),
                                               user.getLastName(), roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
                           signUpRequest.getPassword(), signUpRequest.getFirstName(),
                           signUpRequest.getLastName());

        userService.createUser(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
```

##### PortfolioController

Manages portfolio-related endpoints:

```java
@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @GetMapping("/all")
    public ResponseEntity<List<Portfolio>> getAllPortfolios(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Portfolio> portfolios = portfolioService.getPortfoliosByUser(user);
        return ResponseEntity.ok(portfolios);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getPortfolioSummary(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        BigDecimal totalValue = portfolioService.getTotalPortfolioValue(user);
        BigDecimal totalProfitLoss = portfolioService.getTotalProfitLoss(user);

        return ResponseEntity.ok(Map.of(
            "totalValue", totalValue,
            "totalProfitLoss", totalProfitLoss));
    }

    @PostMapping("/add")
    public ResponseEntity<Portfolio> addToPortfolio(@RequestBody Map<String, Object> request,
                                                   Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        String symbol = (String) request.get("symbol");
        String companyName = (String) request.get("companyName");
        BigDecimal quantity = new BigDecimal(request.get("quantity").toString());
        BigDecimal price = new BigDecimal(request.get("price").toString());

        Portfolio portfolio = portfolioService.addToPortfolio(user, symbol, companyName, quantity, price);
        return ResponseEntity.ok(portfolio);
    }
}
```

#### 6. Security Configuration

The application uses Spring Security with JWT authentication:

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Security Features:**

- JWT token-based authentication
- BCrypt password encryption
- CORS configuration for frontend integration
- Role-based access control
- Stateless session management

---

## Frontend Documentation

### Project Structure

The frontend is built with **Angular 17** using standalone components and modern Angular features:

#### 1. Main Application Component

```typescript
@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .main-content {
        flex: 1;
        padding-top: 20px;
      }
    `,
  ],
})
export class AppComponent {
  title = "FinTrade";
}
```

#### 2. Routing Configuration

```typescript
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
```

#### 3. Component Architecture

##### Authentication Components

**Login Component:**

```typescript
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
                <!-- Password field and submit button -->
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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
```

##### Dashboard Component

The dashboard provides an overview of the user's portfolio and recent transactions:

```typescript
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <!-- Portfolio Summary Cards -->
      <div class="row mb-4" *ngIf="portfolioSummary">
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="dashboard-card">
            <h3>
              <i class="fas fa-dollar-sign me-2"></i>
              {{
                portfolioSummary.totalValue
                  | currency : "USD" : "symbol" : "1.2-2"
              }}
            </h3>
            <p>Total Portfolio Value</p>
          </div>
        </div>
        <!-- More summary cards -->
      </div>

      <div class="row">
        <!-- Portfolio Overview Table -->
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
              <!-- Portfolio table content -->
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
              <!-- Recent transactions content -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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
}
```

#### 4. Services Layer

##### AuthService

Handles authentication and user management:

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.apiUrl}/auth/signin`, loginRequest)
      .pipe(
        tap((response) => {
          localStorage.setItem("token", response.token);
          this.setCurrentUser(response);
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, registerRequest);
  }

  logout(): void {
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "ADMIN";
  }

  private setCurrentUser(jwtResponse: JwtResponse): void {
    const user: User = {
      id: jwtResponse.id,
      username: jwtResponse.username,
      email: jwtResponse.email,
      firstName: jwtResponse.firstName,
      lastName: jwtResponse.lastName,
      role: jwtResponse.roles[0]?.replace("ROLE_", "") || "USER",
      enabled: true,
      createdAt: "",
      updatedAt: "",
    };
    this.currentUserSubject.next(user);
  }
}
```

##### PortfolioService

Manages portfolio-related API calls:

```typescript
@Injectable({
  providedIn: "root",
})
export class PortfolioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/portfolio/all`);
  }

  getPortfolioSummary(): Observable<PortfolioSummary> {
    return this.http.get<PortfolioSummary>(`${this.apiUrl}/portfolio/summary`);
  }

  addToPortfolio(portfolioData: any): Observable<Portfolio> {
    return this.http.post<Portfolio>(
      `${this.apiUrl}/portfolio/add`,
      portfolioData
    );
  }

  removeFromPortfolio(symbol: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/portfolio/remove`, {
      symbol,
      quantity,
    });
  }

  searchPortfolios(symbol: string): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(
      `${this.apiUrl}/portfolio/search?symbol=${symbol}`
    );
  }
}
```

#### 5. Models and Interfaces

##### User Model

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
```

##### Portfolio Model

```typescript
export interface Portfolio {
  id: number;
  symbol: string;
  companyName: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  profitLoss: number;
  profitLossPercentage: number;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalProfitLoss: number;
}
```

##### Transaction Model

```typescript
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
  user: User;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 6. Guards and Interceptors

##### Auth Guard

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};
```

##### Admin Guard

```typescript
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  } else {
    router.navigate(["/dashboard"]);
    return false;
  }
};
```

##### Auth Interceptor

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
```

---

## Database Schema

### Tables Overview

#### 1. Users Table

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_enabled BOOLEAN DEFAULT TRUE
);
```

#### 2. Portfolios Table

```sql
CREATE TABLE portfolios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    average_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(15,2),
    total_cost DECIMAL(15,2),
    profit_loss DECIMAL(15,2),
    profit_loss_percentage DECIMAL(5,2),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 3. Transactions Table

```sql
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    transaction_type ENUM('BUY', 'SELL') NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    commission DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    user_id BIGINT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Relationships

- **Users → Portfolios**: One-to-Many (One user can have multiple portfolio items)
- **Users → Transactions**: One-to-Many (One user can have multiple transactions)
- **Portfolios → Users**: Many-to-One (Multiple portfolio items belong to one user)
- **Transactions → Users**: Many-to-One (Multiple transactions belong to one user)

---

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication Endpoints

#### POST /auth/signin

**Description**: User login
**Request Body**:

```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:

```json
{
  "token": "string",
  "type": "Bearer",
  "id": 1,
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "roles": ["ROLE_USER"]
}
```

#### POST /auth/signup

**Description**: User registration
**Request Body**:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

**Response**:

```json
{
  "message": "User registered successfully!"
}
```

### Portfolio Endpoints

#### GET /portfolio/all

**Description**: Get all portfolio items for the authenticated user
**Headers**: `Authorization: Bearer <token>`
**Response**:

```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "companyName": "Apple Inc.",
    "quantity": 10.0,
    "averagePrice": 150.0,
    "currentPrice": 155.0,
    "totalValue": 1550.0,
    "totalCost": 1500.0,
    "profitLoss": 50.0,
    "profitLossPercentage": 3.33
  }
]
```

#### GET /portfolio/summary

**Description**: Get portfolio summary statistics
**Headers**: `Authorization: Bearer <token>`
**Response**:

```json
{
  "totalValue": 1550.0,
  "totalProfitLoss": 50.0
}
```

#### POST /portfolio/add

**Description**: Add or update portfolio item
**Headers**: `Authorization: Bearer <token>`
**Request Body**:

```json
{
  "symbol": "AAPL",
  "companyName": "Apple Inc.",
  "quantity": 10.0,
  "price": 150.0
}
```

#### POST /portfolio/remove

**Description**: Remove or reduce portfolio item
**Headers**: `Authorization: Bearer <token>`
**Request Body**:

```json
{
  "symbol": "AAPL",
  "quantity": 5.0
}
```

### Transaction Endpoints

#### GET /transactions/all

**Description**: Get all transactions for the authenticated user
**Headers**: `Authorization: Bearer <token>`
**Response**:

```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "companyName": "Apple Inc.",
    "transactionType": "BUY",
    "quantity": 10.0,
    "price": 150.0,
    "totalAmount": 1500.0,
    "commission": 0.0,
    "notes": "Initial purchase",
    "transactionDate": "2024-01-15T10:30:00"
  }
]
```

#### POST /transactions/create

**Description**: Create a new transaction
**Headers**: `Authorization: Bearer <token>`
**Request Body**:

```json
{
  "symbol": "AAPL",
  "companyName": "Apple Inc.",
  "transactionType": "BUY",
  "quantity": 10.0,
  "price": 150.0,
  "commission": 0.0,
  "notes": "Initial purchase"
}
```

#### GET /transactions/filter

**Description**: Filter transactions by type or date range
**Headers**: `Authorization: Bearer <token>`
**Query Parameters**:

- `type`: BUY or SELL (optional)
- `startDate`: Start date in ISO format (optional)
- `endDate`: End date in ISO format (optional)

### Admin Endpoints

#### GET /admin/users

**Description**: Get all users (Admin only)
**Headers**: `Authorization: Bearer <admin_token>`

#### PUT /admin/users/{id}

**Description**: Update user (Admin only)
**Headers**: `Authorization: Bearer <admin_token>`

#### DELETE /admin/users/{id}

**Description**: Delete user (Admin only)
**Headers**: `Authorization: Bearer <admin_token>`

---

## Setup and Installation

### Prerequisites

Before setting up the application, ensure you have the following installed:

- **Java 17** or higher
- **Node.js 18** or higher
- **Angular CLI 17**
- **MySQL 8.0** or higher
- **Maven 3.6** or higher
- **Git** (for cloning the repository)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd FinTrade
```

### Step 2: Database Setup

1. **Install MySQL** and start the service
2. **Create the database**:
   ```sql
   CREATE DATABASE fintrade;
   ```
3. **Update database credentials** in `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/fintrade?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
       username: your_username
       password: your_password
   ```

### Step 3: Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   mvn clean install
   ```

3. **Run the application**:

   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Step 4: Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Update API URL** in `src/environments/environment.ts`:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: "http://localhost:8080/api",
   };
   ```

4. **Run the application**:

   ```bash
   ng serve
   ```

   The frontend will start on `http://localhost:4200`

### Step 5: Verify Installation

1. **Open your browser** and navigate to `http://localhost:4200`
2. **Register a new account** or use existing credentials
3. **Test the application** by adding transactions and viewing your portfolio

---

## Usage Guide

### For Complete Beginners

#### 1. Getting Started

1. **Register an Account**:

   - Click "Sign up here" on the login page
   - Fill in your details (username, email, password, first name, last name)
   - Click "Sign Up"

2. **Login**:
   - Enter your username and password
   - Click "Sign In"

#### 2. Adding Your First Transaction

1. **Navigate to Transactions**:

   - Click "Transactions" in the navigation menu

2. **Create a Buy Transaction**:

   - Click "Add Transaction" button
   - Fill in the form:
     - **Symbol**: Stock symbol (e.g., AAPL for Apple)
     - **Company Name**: Full company name (e.g., Apple Inc.)
     - **Transaction Type**: Select "BUY"
     - **Quantity**: Number of shares (e.g., 10)
     - **Price**: Price per share (e.g., 150.00)
     - **Commission**: Trading fees (optional, default 0)
     - **Notes**: Any additional notes (optional)
   - Click "Create Transaction"

3. **View Your Portfolio**:
   - Click "Portfolio" in the navigation menu
   - You'll see your holdings with current values and P&L

#### 3. Managing Your Portfolio

1. **View Portfolio Summary**:

   - The dashboard shows total portfolio value and P&L
   - Individual holdings are displayed in the portfolio table

2. **Add More Holdings**:

   - Create more BUY transactions to add to existing positions
   - The system automatically calculates average prices

3. **Sell Holdings**:
   - Create SELL transactions to reduce positions
   - The system updates your portfolio accordingly

#### 4. Tracking Performance

1. **Dashboard Overview**:

   - Total portfolio value
   - Total profit/loss
   - Number of portfolio items
   - Recent transactions

2. **Portfolio Details**:
   - Individual stock performance
   - Average cost vs current price
   - Profit/loss per holding
   - Percentage gains/losses

#### 5. Admin Features (Admin Users Only)

1. **User Management**:

   - View all registered users
   - Enable/disable user accounts
   - Delete user accounts

2. **System Administration**:
   - Monitor system usage
   - Manage user roles

### Advanced Usage

#### 1. Portfolio Optimization

- **Diversification**: Track multiple stocks across different sectors
- **Performance Analysis**: Use P&L percentages to identify best performers
- **Cost Basis Tracking**: Monitor average prices for tax purposes

#### 2. Transaction Management

- **Search Transactions**: Use the search feature to find specific transactions
- **Filter by Type**: View only BUY or SELL transactions
- **Date Range Filtering**: Analyze transactions within specific time periods

#### 3. Data Export

- **Transaction History**: Keep records of all trading activity
- **Portfolio Reports**: Generate summary reports for analysis

---

## Security Features

### Authentication & Authorization

1. **JWT Token Authentication**:

   - Secure token-based authentication
   - Configurable token expiration (24 hours by default)
   - Automatic token refresh on API calls

2. **Password Security**:

   - BCrypt password hashing
   - Strong password requirements
   - Secure password storage

3. **Role-Based Access Control**:
   - User and Admin roles
   - Protected admin endpoints
   - Route guards for frontend protection

### Data Protection

1. **Input Validation**:

   - Server-side validation for all inputs
   - SQL injection prevention
   - XSS protection

2. **CORS Configuration**:

   - Restricted cross-origin requests
   - Secure API endpoints
   - Credential handling

3. **Database Security**:
   - Parameterized queries
   - Connection encryption
   - Secure credential storage

### Best Practices

1. **Environment Configuration**:

   - Separate dev/prod configurations
   - Secure credential management
   - Environment-specific settings

2. **Error Handling**:
   - Global exception handling
   - Secure error messages
   - Logging and monitoring

---

## Development Guide

### Backend Development

#### 1. Adding New Features

1. **Create Entity** (if needed):

   ```java
   @Entity
   @Table(name = "new_table")
   public class NewEntity {
       // Entity fields and methods
   }
   ```

2. **Create Repository**:

   ```java
   @Repository
   public interface NewEntityRepository extends JpaRepository<NewEntity, Long> {
       // Custom query methods
   }
   ```

3. **Create Service**:

   ```java
   @Service
   public class NewEntityService {
       // Business logic
   }
   ```

4. **Create Controller**:
   ```java
   @RestController
   @RequestMapping("/api/new-entity")
   public class NewEntityController {
       // REST endpoints
   }
   ```

#### 2. Testing

1. **Unit Tests**:

   ```bash
   mvn test
   ```

2. **Integration Tests**:
   ```bash
   mvn verify
   ```

#### 3. Database Migrations

The application uses Hibernate's `ddl-auto: update` for automatic schema updates. For production, consider using Flyway or Liquibase for proper migration management.

### Frontend Development

#### 1. Adding New Components

1. **Generate Component**:

   ```bash
   ng generate component components/new-feature
   ```

2. **Add to Routes** (if needed):

   ```typescript
   { path: "new-feature", component: NewFeatureComponent }
   ```

3. **Create Service** (if needed):
   ```bash
   ng generate service services/new-feature
   ```

#### 2. Styling

The application uses Bootstrap 5 with custom CSS. Follow these guidelines:

1. **Use Bootstrap classes** when possible
2. **Custom styles** in component-specific CSS
3. **Responsive design** for mobile compatibility
4. **Consistent color scheme** and typography

#### 3. State Management

The application uses RxJS for state management:

1. **Services** for API communication
2. **BehaviorSubject** for user state
3. **Observables** for reactive data flow

### Code Quality

#### 1. Backend Standards

- **Java 17** features and best practices
- **Spring Boot** conventions
- **RESTful API** design
- **Proper error handling**
- **Comprehensive logging**

#### 2. Frontend Standards

- **TypeScript** strict mode
- **Angular** best practices
- **Component-based architecture**
- **Reactive programming** with RxJS
- **Accessibility** considerations

#### 3. Testing

- **Unit tests** for business logic
- **Integration tests** for API endpoints
- **Component tests** for UI components
- **E2E tests** for critical user flows

---

## Troubleshooting

### Common Issues

#### 1. Backend Issues

**Problem**: Database connection failed
**Solution**:

- Check MySQL service is running
- Verify database credentials in `application.yml`
- Ensure database exists

**Problem**: Port 8080 already in use
**Solution**:

- Change port in `application.yml`
- Kill process using port 8080

#### 2. Frontend Issues

**Problem**: CORS errors
**Solution**:

- Check backend CORS configuration
- Verify API URL in environment files

**Problem**: Build errors
**Solution**:

- Clear node_modules and reinstall
- Check Angular CLI version compatibility

#### 3. Database Issues

**Problem**: Tables not created
**Solution**:

- Check Hibernate configuration
- Verify database permissions
- Check application logs for errors

### Performance Optimization

#### 1. Backend Optimization

- **Database indexing** on frequently queried columns
- **Connection pooling** configuration
- **Caching** for frequently accessed data
- **Pagination** for large datasets

#### 2. Frontend Optimization

- **Lazy loading** for routes
- **OnPush change detection** strategy
- **Virtual scrolling** for large lists
- **Image optimization** and compression

---

## Conclusion

FinTrade is a comprehensive trading application that demonstrates modern full-stack development practices. The application provides:

- **Secure authentication** and authorization
- **Real-time portfolio tracking** with automatic calculations
- **Complete transaction management** system
- **Admin panel** for user management
- **Responsive design** for all devices
- **Scalable architecture** for future enhancements

The codebase follows industry best practices and is well-documented for easy maintenance and extension. Whether you're a beginner learning web development or an experienced developer looking for a reference implementation, FinTrade provides a solid foundation for understanding modern web application development.

For questions, issues, or contributions, please refer to the project's issue tracker or contact the development team.
