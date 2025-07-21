<template>
  <div class="p-6">
    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="!currentCustomer" class="text-center py-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Client non trouvé</h2>
      <router-link to="/customers" class="btn btn-primary">
        Retour à la liste
      </router-link>
    </div>

    <div v-else>
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center space-x-4">
          <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content rounded-full w-20">
              <span class="text-3xl">{{ currentCustomer.name.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">{{ currentCustomer.name }}</h1>
            <p class="text-gray-600">{{ currentCustomer.company }}</p>
            <div class="badge mt-2" :class="getStatusBadgeClass(currentCustomer.status)">
              {{ getStatusLabel(currentCustomer.status) }}
            </div>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <router-link :to="`/customers/${currentCustomer.id}/edit`" class="btn btn-primary">
            <i class="fas fa-edit mr-2"></i>
            Modifier
          </router-link>
          <button @click="handleDelete" class="btn btn-error">
            <i class="fas fa-trash mr-2"></i>
            Supprimer
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Informations de contact</h2>
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <div class="font-medium">Email</div>
                  <div class="text-gray-600">{{ currentCustomer.email }}</div>
                </div>
              </div>
              
              <div v-if="currentCustomer.phone" class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <div>
                  <div class="font-medium">Téléphone</div>
                  <div class="text-gray-600">{{ currentCustomer.phone }}</div>
                </div>
              </div>

              <div v-if="currentCustomer.company" class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <div>
                  <div class="font-medium">Entreprise</div>
                  <div class="text-gray-600">{{ currentCustomer.company }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Informations système</h2>
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <div class="font-medium">Créé le</div>
                  <div class="text-gray-600">{{ formatDate(currentCustomer.createdAt) }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <div>
                  <div class="font-medium">Modifié le</div>
                  <div class="text-gray-600">{{ formatDate(currentCustomer.updatedAt) }}</div>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                <div>
                  <div class="font-medium">Statut</div>
                  <div class="badge" :class="getStatusBadgeClass(currentCustomer.status)">
                    {{ getStatusLabel(currentCustomer.status) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentCustomer.notes" class="card bg-base-100 shadow mb-6">
        <div class="card-body">
          <h2 class="card-title">Notes</h2>
          <p class="text-gray-700 whitespace-pre-wrap">{{ currentCustomer.notes }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <router-link to="/customers" class="btn btn-outline">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Retour à la liste
        </router-link>
        
        <div class="flex space-x-2">
          <button class="btn btn-outline">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            Appeler
          </button>
          <button class="btn btn-outline">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Envoyer un email
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomers } from '@/composables/useCustomers'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { currentCustomer, loading, fetchCustomerById, deleteCustomer } = useCustomers()
const { isAdmin } = useAuth()

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active': return 'badge-success'
    case 'prospect': return 'badge-warning'
    case 'inactive': return 'badge-error'
    default: return 'badge-neutral'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Actif'
    case 'prospect': return 'Prospect'
    case 'inactive': return 'Inactif'
    default: return status
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleDelete = async () => {
  if (!currentCustomer.value) return
  
  if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
    try {
      await deleteCustomer(currentCustomer.value.id)
      router.push('/customers')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
  }
}

onMounted(async () => {
  const customerId = route.params.id as string
  if (customerId) {
    await fetchCustomerById(customerId)
  }
})
</script> 