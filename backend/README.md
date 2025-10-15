# FinTrade Backend

Spring Boot REST API for the FinTrade trading application.

## 🚀 Quick Start

1. **Prerequisites**

   - Java 17+
   - Maven 3.6+
   - MySQL 8.0+

2. **Database Setup**

   ```sql
   CREATE DATABASE fintrade;
   ```

3. **Configuration**
   Update `src/main/resources/application.yml` with your database credentials.

4. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

## 📋 API Documentation

### Authentication Endpoints

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Portfolio Endpoints

- `GET /api/portfolio/all` - Get user's portfolio
- `GET /api/portfolio/summary` - Get portfolio summary
- `POST /api/portfolio/add` - Add to portfolio
- `POST /api/portfolio/remove` - Remove from portfolio

### Transaction Endpoints

- `GET /api/transactions/all` - Get all transactions
- `POST /api/transactions/create` - Create transaction
- `GET /api/transactions/filter` - Filter transactions

### Admin Endpoints

- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/{id}` - Update user (Admin only)
- `DELETE /api/admin/users/{id}` - Delete user (Admin only)

## 🔧 Configuration

### Database Configuration

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/fintrade
    username: your_username
    password: your_password
```

### JWT Configuration

```yaml
jwt:
  secret: your-secret-key
  expiration: 86400000 # 24 hours
```

## 🏗️ Architecture

- **Controllers**: Handle HTTP requests
- **Services**: Business logic layer
- **Repositories**: Data access layer
- **Entities**: JPA entities for database mapping
- **DTOs**: Data transfer objects
- **Security**: JWT authentication and authorization

## 🧪 Testing

```bash
mvn test
```

## 📦 Build

```bash
mvn clean package
```

## 🚀 Production Deployment

1. Build the application:

   ```bash
   mvn clean package -Pprod
   ```

2. Run the JAR file:
   ```bash
   java -jar target/fintrade-backend-0.0.1-SNAPSHOT.jar
   ```
