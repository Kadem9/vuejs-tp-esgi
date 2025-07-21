import { ref, computed, readonly } from 'vue'
import type { Customer, CustomerFormData, PaginatedResponse } from '@/types'
import { customerService } from '@/services/customerService'

export function useCustomers() {
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const activeCustomers = computed(() => 
    customers.value.filter(c => c.status === 'active')
  )

  const prospects = computed(() => 
    customers.value.filter(c => c.status === 'prospect')
  )

  const fetchCustomers = async (page: number = 1, limit: number = 10, search?: string, status?: string) => {
    loading.value = true
    error.value = null

    try {
      const response: PaginatedResponse<Customer> = await customerService.getCustomers(page, limit, search, status)
      customers.value = response.data
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error loading customers'
    } finally {
      loading.value = false
    }
  }

  const fetchCustomerById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const customer = await customerService.getCustomerById(id)
      currentCustomer.value = customer
      return customer
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error loading customer'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCustomer = async (customerData: CustomerFormData) => {
    loading.value = true
    error.value = null

    try {
      const newCustomer = await customerService.createCustomer(customerData)
      customers.value.unshift(newCustomer)
      return newCustomer
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error creating customer'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCustomer = async (id: string, customerData: Partial<CustomerFormData>) => {
    loading.value = true
    error.value = null

    try {
      const updatedCustomer = await customerService.updateCustomer(id, customerData)
      
      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) {
        customers.value[index] = updatedCustomer
      }

      if (currentCustomer.value?.id === id) {
        currentCustomer.value = updatedCustomer
      }

      return updatedCustomer
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error updating customer'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCustomer = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await customerService.deleteCustomer(id)
      
      customers.value = customers.value.filter(c => c.id !== id)
      
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error deleting customer'
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchCustomers = async (query: string) => {
    if (!query.trim()) {
      await fetchCustomers()
      return
    }

    loading.value = true
    error.value = null

    try {
      const results = await customerService.searchCustomers(query)
      customers.value = results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error searching'
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    customers: readonly(customers),
    currentCustomer: readonly(currentCustomer),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    activeCustomers,
    prospects,
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    clearError
  }
} 