<template>
  <div class="relative">
    <!-- ma barre de recherche globale -->
    <div class="form-control">
      <div class="input-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="rechercher clients, interactions..."
          class="input input-bordered w-full"
          @input="handleSearch"
          @focus="showResults = true"
          @blur="handleBlur"
        />
        <button class="btn btn-square btn-primary" :disabled="isLoading">
          <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-search"></i>
        </button>
      </div>
    </div>

          <!-- mes résultats de recherche -->
    <div v-if="showResults && (searchResults.customers.length > 0 || searchResults.interactions.length > 0)" 
         class="absolute top-full left-0 right-0 z-50 mt-2 bg-base-100 shadow-lg rounded-lg border max-h-96 overflow-y-auto">
      
              <!-- mes clients -->
      <div v-if="searchResults.customers.length > 0" class="p-4">
        <h3 class="font-semibold text-sm text-gray-600 mb-2">clients</h3>
        <div class="space-y-2">
          <div
            v-for="customer in searchResults.customers"
            :key="customer.id"
            @click="selectCustomer(customer)"
            class="p-2 hover:bg-base-200 rounded cursor-pointer flex items-center space-x-3"
          >
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-8">
                <span class="text-xs">{{ customer.name.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium">{{ customer.name }}</div>
              <div class="text-sm text-gray-500">{{ customer.email }}</div>
            </div>
            <div class="badge badge-sm" :class="getStatusBadgeClass(customer.status)">
              {{ getStatusLabel(customer.status) }}
            </div>
          </div>
        </div>
      </div>

              <!-- mes interactions -->
      <div v-if="searchResults.interactions.length > 0" class="p-4 border-t">
        <h3 class="font-semibold text-sm text-gray-600 mb-2">interactions</h3>
        <div class="space-y-2">
          <div
            v-for="interaction in searchResults.interactions"
            :key="interaction.id"
            @click="selectInteraction(interaction)"
            class="p-2 hover:bg-base-200 rounded cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">{{ interaction.title }}</div>
                <div class="text-sm text-gray-500">
                  {{ interaction.customer?.name }} • {{ getTypeLabel(interaction.type) }}
                </div>
              </div>
              <div class="badge badge-sm" :class="getStatusBadgeClass(interaction.status)">
                {{ getStatusLabel(interaction.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- loading -->
      <div v-if="isLoading" class="p-4 text-center text-gray-500">
        <i class="fas fa-spinner fa-spin mr-2"></i>
        chargement...
      </div>

      <!-- pas de résultats -->
      <div v-else-if="searchQuery && searchResults.customers.length === 0 && searchResults.interactions.length === 0" 
           class="p-4 text-center text-gray-500">
        aucun résultat trouvé
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomers } from '@/composables/useCustomers'
import { useInteractions } from '@/composables/useInteractions'
import type { Customer, Interaction } from '@/types'

const router = useRouter()
const { customers, fetchCustomers, loading: customersLoading } = useCustomers()
const { interactions, fetchInteractions, loading: interactionsLoading } = useInteractions()

const searchQuery = ref('')
const showResults = ref(false)
const isLoading = ref(false)

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) {
    return { customers: [], interactions: [] }
  }

  const query = searchQuery.value.toLowerCase()
  
  const filteredCustomers = customers.value.filter(customer => 
    customer.name.toLowerCase().includes(query) ||
    customer.email.toLowerCase().includes(query) ||
    customer.company?.toLowerCase().includes(query)
  )

  const filteredInteractions = interactions.value.filter(interaction =>
    interaction.title.toLowerCase().includes(query) ||
    interaction.description?.toLowerCase().includes(query) ||
    interaction.customer?.name.toLowerCase().includes(query)
  )

  return {
    customers: filteredCustomers.slice(0, 5),
    interactions: filteredInteractions.slice(0, 5)
  }
})

const handleSearch = () => {
  showResults.value = true
}

const handleBlur = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

const selectCustomer = (customer: Customer) => {
  router.push(`/customers/${customer.id}`)
  searchQuery.value = ''
  showResults.value = false
}

const selectInteraction = (interaction: Interaction) => {
  router.push(`/interactions`)
  searchQuery.value = ''
  showResults.value = false
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    active: 'badge-success',
    prospect: 'badge-warning',
    inactive: 'badge-error',
    pending: 'badge-warning',
    completed: 'badge-success',
    cancelled: 'badge-error'
  }
  return classes[status as keyof typeof classes] || 'badge-neutral'
}

const getStatusLabel = (status: string) => {
  const labels = {
    active: 'actif',
    prospect: 'prospect',
    inactive: 'inactif',
    pending: 'en attente',
    completed: 'terminé',
    cancelled: 'annulé'
  }
  return labels[status as keyof typeof labels] || status
}

const getTypeLabel = (type: string) => {
  const labels = {
    call: 'appel',
    email: 'email',
    meeting: 'réunion',
    note: 'note',
    task: 'tâche'
  }
  return labels[type as keyof typeof labels] || type
}

// charger les données au montage
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      fetchCustomers(1, 100), // charger tt les clients
      fetchInteractions(1, 100) // charger tt les interactions
    ])
  } finally {
    isLoading.value = false
  }
})
</script> 