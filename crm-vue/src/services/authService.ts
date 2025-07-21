import type { User, LoginCredentials } from '@/types'
import { apiService } from './apiService'

class AuthService {
  private currentUser: User | null = null

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiService.login(credentials.email, credentials.password)
    this.currentUser = response.user
    localStorage.setItem('token', response.token)
    return response.user
  }

  async logout(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser
    }

    const token = localStorage.getItem('token')
    if (token) {
      try {
        const user = await apiService.getCurrentUser()
        this.currentUser = user
        return user
      } catch {
        this.currentUser = null
        localStorage.removeItem('token')
        return null
      }
    }

    return null
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }
}

export const authService = new AuthService() 