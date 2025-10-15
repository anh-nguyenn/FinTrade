# FinTrade Frontend

Angular 17 frontend application for the FinTrade trading platform.

## 🚀 Quick Start

1. **Prerequisites**

   - Node.js 18+
   - Angular CLI 17
   - npm or yarn

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Development Server**

   ```bash
   ng serve
   ```

4. **Open Browser**
   Navigate to `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/          # Angular Components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard component
│   │   ├── portfolio/      # Portfolio management
│   │   ├── transactions/   # Transaction management
│   │   ├── admin/          # Admin panel
│   │   └── navbar/         # Navigation component
│   ├── services/           # API Services
│   ├── models/             # TypeScript Models
│   ├── guards/             # Route Guards
│   ├── interceptors/       # HTTP Interceptors
│   └── app.routes.ts       # Routing configuration
├── environments/            # Environment configurations
└── styles.scss             # Global styles
```

## 🎨 Features

- **Responsive Design**: Bootstrap 5 with custom styling
- **Authentication**: Login/Register with JWT
- **Portfolio Management**: View and manage holdings
- **Transaction Tracking**: Record and filter transactions
- **Admin Panel**: User management (Admin only)
- **Real-time Updates**: Live data refresh

## 🔧 Configuration

### Environment Variables

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/api",
};
```

### API Integration

The frontend communicates with the Spring Boot backend through:

- **AuthService**: Authentication operations
- **PortfolioService**: Portfolio management
- **TransactionService**: Transaction operations
- **AdminService**: Admin functions

## 🚀 Build & Deployment

### Development Build

```bash
ng build
```

### Production Build

```bash
ng build --prod
```

### Serve Production Build

```bash
ng serve --prod
```

## 🧪 Testing

```bash
ng test
```

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎯 Key Components

### Dashboard

- Portfolio summary cards
- Recent transactions
- Quick access to main features

### Portfolio

- Holdings table
- Add/Remove functionality
- Real-time P&L calculations

### Transactions

- Transaction history
- Filtering and search
- Add new transactions

### Admin Panel

- User management
- System administration
- Role-based access

## 🔒 Security

- JWT token storage in localStorage
- HTTP interceptors for automatic token attachment
- Route guards for protected routes
- Role-based component visibility

## 🎨 Styling

- **Bootstrap 5**: UI framework
- **Font Awesome**: Icons
- **Custom SCSS**: Additional styling
- **Gradient Design**: Modern visual appeal
- **Responsive Grid**: Mobile-first approach
