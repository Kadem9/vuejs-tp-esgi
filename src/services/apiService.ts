const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    return response.json();
  }

  // Authentification
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Clients
  async getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/customers?${searchParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getCustomer(id: string) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createCustomer(customerData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status?: string;
    notes?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(customerData)
    });
    return this.handleResponse(response);
  }

  async updateCustomer(id: string, customerData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status?: string;
    notes?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(customerData)
    });
    return this.handleResponse(response);
  }

  async deleteCustomer(id: string) {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return true;
  }

  // Statistiques
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService(); 