export class ValidationUtil {
  
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    
    if (password.length > 100) {
      return { isValid: false, message: 'Password must be less than 100 characters' };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return { 
        isValid: false, 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      };
    }
    
    return { isValid: true, message: '' };
  }
  
  static validateUsername(username: string): { isValid: boolean; message: string } {
    if (username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters long' };
    }
    
    if (username.length > 50) {
      return { isValid: false, message: 'Username must be less than 50 characters' };
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    
    return { isValid: true, message: '' };
  }
  
  static validateQuantity(quantity: number): { isValid: boolean; message: string } {
    if (quantity <= 0) {
      return { isValid: false, message: 'Quantity must be greater than 0' };
    }
    
    if (quantity > 1000000) {
      return { isValid: false, message: 'Quantity must be less than 1,000,000' };
    }
    
    return { isValid: true, message: '' };
  }
  
  static validatePrice(price: number): { isValid: boolean; message: string } {
    if (price <= 0) {
      return { isValid: false, message: 'Price must be greater than 0' };
    }
    
    if (price > 100000) {
      return { isValid: false, message: 'Price must be less than $100,000' };
    }
    
    return { isValid: true, message: '' };
  }
  
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
  
  static formatNumber(number: number, decimals: number = 2): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  }
}
