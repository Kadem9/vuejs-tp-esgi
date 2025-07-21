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

  // auth
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

  // clients
  async getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
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

  async getCustomer(id: string): Promise<any> {
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
  }): Promise<any> {
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
  }): Promise<any> {
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

  async bulkImportCustomers(customers: any[]) {
    const response = await fetch(`${API_BASE_URL}/customers/bulk`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ customers })
    });
    return this.handleResponse(response);
  }

  // interactions
  async getInteractions(params: {
    page?: number;
    limit?: number;
    customerId?: string;
    type?: string;
    status?: string;
  } = {}): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/interactions?${searchParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getInteraction(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/interactions/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createInteraction(interactionData: {
    customerId: string;
    type: string;
    title: string;
    description?: string;
    date?: string;
    status?: string;
    priority?: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/interactions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(interactionData)
    });
    return this.handleResponse(response);
  }

  async updateInteraction(id: string, interactionData: {
    type: string;
    title: string;
    description?: string;
    date?: string;
    status?: string;
    priority?: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/interactions/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(interactionData)
    });
    return this.handleResponse(response);
  }

  async deleteInteraction(id: string) {
    const response = await fetch(`${API_BASE_URL}/interactions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return true;
  }

  async bulkImportInteractions(interactions: any[]) {
    const response = await fetch(`${API_BASE_URL}/interactions/bulk`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ interactions })
    });
    return this.handleResponse(response);
  }

  // stats
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService(); 