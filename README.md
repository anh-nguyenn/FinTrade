# FinTrade - Secure Trading Web Application

A full-stack trading web application built with Java Spring Boot backend and Angular frontend, featuring user authentication, portfolio tracking, and transaction management.

## Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Secure password encryption

- **Portfolio Management**

  - Real-time portfolio tracking
  - Profit/Loss calculations
  - Portfolio summary dashboard

- **Transaction Management**

  - Buy/Sell transaction recording
  - Transaction history and filtering
  - Commission tracking

- **Admin Panel**
  - User management
  - System administration
  - User status control

## 🛠️ Tech Stack

### Backend

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Data persistence
- **Hibernate** - ORM
- **MySQL** - Database
- **JWT** - Token-based authentication
- **Maven** - Build tool

### Frontend

- **Angular 17**
- **TypeScript**
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons
- **RxJS** - Reactive programming

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Angular CLI 17
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FinTrade
```

### 2. Database Setup

1. Create a MySQL database named `fintrade`
2. Update database credentials in `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/fintrade?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: your_username
    password: your_password
```

### 3. Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

The frontend will start on `http://localhost:4200`

## 📁 Project Structure

```
FinTrade/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/com/fintrade/
│   │   ├── entity/         # JPA Entities
│   │   ├── repository/     # Data Repositories
│   │   ├── service/        # Business Logic
│   │   ├── controller/     # REST Controllers
│   │   ├── security/       # Security Configuration
│   │   └── dto/           # Data Transfer Objects
│   └── src/main/resources/
│       └── application.yml # Configuration
├── frontend/               # Angular Frontend
│   ├── src/app/
│   │   ├── components/     # Angular Components
│   │   ├── services/       # API Services
│   │   ├── models/         # TypeScript Models
│   │   ├── guards/         # Route Guards
│   │   └── interceptors/   # HTTP Interceptors
│   └── src/environments/   # Environment Config
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Portfolio

- `GET /api/portfolio/all` - Get all portfolio items
- `GET /api/portfolio/summary` - Get portfolio summary
- `POST /api/portfolio/add` - Add to portfolio
- `POST /api/portfolio/remove` - Remove from portfolio

### Transactions

- `GET /api/transactions/all` - Get all transactions
- `POST /api/transactions/create` - Create transaction
- `GET /api/transactions/filter` - Filter transactions

### Admin (Admin only)

- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Add Transactions**: Record buy/sell transactions
3. **View Portfolio**: Monitor your holdings and performance
4. **Admin Panel**: Manage users (Admin only)

## 🔒 Security Features

- JWT token-based authentication
- Password encryption with BCrypt
- CORS configuration for frontend integration
- Role-based access control
- Input validation and sanitization

## 🚀 Deployment

### Backend Deployment

```bash
cd backend
mvn clean package
java -jar target/fintrade-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment

```bash
cd frontend
ng build --prod
# Deploy dist/ folder to your web server
```
