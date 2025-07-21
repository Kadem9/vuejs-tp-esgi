import type { Interaction, InteractionFormData, PaginatedResponse } from '@/types'
import { apiService } from './apiService'

class InteractionService {
  async getInteractions(page: number = 1, limit: number = 10, customerId?: string, type?: string, status?: string): Promise<PaginatedResponse<Interaction>> {
    return apiService.getInteractions({ page, limit, customerId, type, status })
  }

  async getInteractionById(id: string): Promise<Interaction | null> {
    try {
      return await apiService.getInteraction(id)
    } catch (error) {
      if (error instanceof Error && error.message.includes('non trouvée')) {
        return null
      }
      throw error
    }
  }

  async createInteraction(interactionData: InteractionFormData): Promise<Interaction> {
    return apiService.createInteraction(interactionData)
  }

  async updateInteraction(id: string, interactionData: Partial<InteractionFormData>): Promise<Interaction> {
    return apiService.updateInteraction(id, interactionData as any)
  }

  async deleteInteraction(id: string): Promise<void> {
    await apiService.deleteInteraction(id)
  }

  async getInteractionsByCustomer(customerId: string): Promise<Interaction[]> {
    const response = await apiService.getInteractions({ customerId, limit: 50 })
    return response.data
  }
}

export const interactionService = new InteractionService() 