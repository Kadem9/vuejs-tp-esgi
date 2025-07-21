import type { Customer, CustomerFormData, PaginatedResponse } from '@/types'
import { apiService } from './apiService'

class CustomerService {
  async getCustomers(page: number = 1, limit: number = 10, search?: string, status?: string): Promise<PaginatedResponse<Customer>> {
    return apiService.getCustomers({ page, limit, search, status })
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      return await apiService.getCustomer(id)
    } catch (error) {
      if (error instanceof Error && error.message.includes('non trouvé')) {
        return null
      }
      throw error
    }
  }

  async createCustomer(customerData: CustomerFormData): Promise<Customer> {
    return apiService.createCustomer(customerData)
  }

  async updateCustomer(id: string, customerData: Partial<CustomerFormData>): Promise<Customer> {
    return apiService.updateCustomer(id, customerData as any)
  }

  async deleteCustomer(id: string): Promise<void> {
    await apiService.deleteCustomer(id)
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const response = await apiService.getCustomers({ search: query, limit: 50 })
    return response.data
  }
}

export const customerService = new CustomerService() 