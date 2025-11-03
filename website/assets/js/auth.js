// Authentication Service
class AuthService {
  constructor() {
    this.apiBase = '/api';
    this.tokenKey = 'sci_solia_token';
    this.userKey = 'sci_solia_user';
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.apiBase}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user info
      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(this.userKey, JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.apiBase}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    window.location.href = '/website/auth/login.html';
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  async validateSession() {
    if (!this.isAuthenticated()) {
      this.logout();
      return false;
    }

    try {
      const response = await fetch(`${this.apiBase}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/website/auth/login.html';
      return false;
    }
    return true;
  }
}

// Global auth instance
window.authService = new AuthService();

// Auto-redirect if not authenticated on protected pages
document.addEventListener('DOMContentLoaded', () => {
  const protectedPaths = ['/website/dashboard/', '/website/properties/'];
  const currentPath = window.location.pathname;
  
  if (protectedPaths.some(path => currentPath.includes(path))) {
    window.authService.requireAuth();
  }
});