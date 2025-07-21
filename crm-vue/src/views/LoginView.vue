<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-primary">CRM Vue</h1>
          <p class="text-gray-600 mt-2">Connectez-vous à votre compte</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="votre@email.com"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Mot de passe</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="input input-bordered"
              required
            />
          </div>

          <div v-if="error" class="alert alert-error">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ error }}</span>
          </div>

          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </div>
        </form>

        <div class="divider">OU</div>

        <div class="text-center">
          <p class="text-sm text-gray-600 mb-4">Utilisez ces identifiants de démonstration :</p>
          <div class="space-y-2 text-xs">
            <div class="bg-base-200 p-2 rounded">
              <strong>Admin:</strong> admin@crm.com / password
            </div>
            <div class="bg-base-200 p-2 rounded">
              <strong>Utilisateur:</strong> user@crm.com / password
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { LoginCredentials } from '@/types'

const router = useRouter()
const { login, loading, error, clearError } = useAuth()

const form = ref<LoginCredentials>({
  email: '',
  password: ''
})

const handleLogin = async () => {
  clearError()
  
  try {
    await login(form.value)
    router.push('/dashboard')
  } catch (err) {
    console.error('Erreur de connexion:', err)
  }
}
</script> 