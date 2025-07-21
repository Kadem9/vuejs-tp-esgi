import { ref, computed, readonly } from 'vue'
import type { User, LoginCredentials } from '@/types'
import { authService } from '@/services/authService'

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const isAuthenticated = computed(() => user.value !== null)
const isAdmin = computed(() => user.value?.role === 'admin')

const login = async (credentials: LoginCredentials) => {
  loading.value = true
  error.value = null

  try {
    const loggedInUser = await authService.login(credentials)
    user.value = loggedInUser
    console.log('🔐 Login:', loggedInUser.name, 'Role:', loggedInUser.role)
    return loggedInUser
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de connexion'
    throw err
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  loading.value = true
  try {
    console.log('Logout - Nettoyage du store')
    await authService.logout()
    clearAuth()
    console.log('Logout terminé - Store nettoyé')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de déconnexion'
  } finally {
    loading.value = false
  }
}

const checkAuth = async () => {
  try {
    const currentUser = await authService.getCurrentUser()
    user.value = currentUser
  } catch (err) {
    console.error('Erreur lors de la vérification de l\'authentification:', err)
  }
}

const clearError = () => {
  error.value = null
}

const clearAuth = () => {
  console.log('ClearAuth - Nettoyage complet')
  user.value = null
  error.value = null
  loading.value = false
  console.log('ClearAuth terminé - user.value:', user.value)
}

export const authStore = {
  user: readonly(user),
  loading: readonly(loading),
  error: readonly(error),
  isAuthenticated,
  isAdmin,
  login,
  logout,
  checkAuth,
  clearError,
  clearAuth
} 