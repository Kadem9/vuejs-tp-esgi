import { ref, computed, readonly } from 'vue'
import type { Interaction, InteractionFormData, PaginatedResponse } from '@/types'
import { interactionService } from '@/services/interactionService'

export function useInteractions() {
  const interactions = ref<Interaction[]>([])
  const currentInteraction = ref<Interaction | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const pendingInteractions = computed(() => 
    interactions.value.filter(i => i.status === 'pending')
  )

  const highPriorityInteractions = computed(() => 
    interactions.value.filter(i => i.priority === 'high')
  )

  const fetchInteractions = async (page: number = 1, limit: number = 10, customerId?: string, type?: string, status?: string) => {
    loading.value = true
    error.value = null

    try {
      const response: PaginatedResponse<Interaction> = await interactionService.getInteractions(page, limit, customerId, type, status)
      interactions.value = response.data
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error loading interactions'
    } finally {
      loading.value = false
    }
  }

  const fetchInteractionById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const interaction = await interactionService.getInteractionById(id)
      currentInteraction.value = interaction
      return interaction
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error loading interaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createInteraction = async (interactionData: InteractionFormData) => {
    loading.value = true
    error.value = null

    try {
      const newInteraction = await interactionService.createInteraction(interactionData)
      interactions.value.unshift(newInteraction)
      return newInteraction
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error creating interaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateInteraction = async (id: string, interactionData: Partial<InteractionFormData>) => {
    loading.value = true
    error.value = null

    try {
      const updatedInteraction = await interactionService.updateInteraction(id, interactionData)
      
      const index = interactions.value.findIndex(i => i.id === id)
      if (index !== -1) {
        interactions.value[index] = updatedInteraction
      }

      if (currentInteraction.value?.id === id) {
        currentInteraction.value = updatedInteraction
      }

      return updatedInteraction
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error updating interaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteInteraction = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await interactionService.deleteInteraction(id)
      
      interactions.value = interactions.value.filter(i => i.id !== id)
      
      if (currentInteraction.value?.id === id) {
        currentInteraction.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error deleting interaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getInteractionsByCustomer = async (customerId: string) => {
    loading.value = true
    error.value = null

    try {
      const customerInteractions = await interactionService.getInteractionsByCustomer(customerId)
      return customerInteractions
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'error loading customer interactions'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    interactions: readonly(interactions),
    currentInteraction: readonly(currentInteraction),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    pendingInteractions,
    highPriorityInteractions,
    fetchInteractions,
    fetchInteractionById,
    createInteraction,
    updateInteraction,
    deleteInteraction,
    getInteractionsByCustomer,
    clearError
  }
} 