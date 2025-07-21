<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Clients</h1>
        <p class="text-gray-600">Gérez votre base de clients</p>
      </div>
      <router-link v-if="isAdmin" to="/customers/new" class="btn btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Nouveau client
      </router-link>
      <button v-else disabled class="btn btn-primary opacity-50" title="Réservé aux administrateurs">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Nouveau client
      </button>
      <div v-if="!isAdmin" class="badge badge-info">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Mode consultation
      </div>
    </div>

    <div class="card bg-base-100 shadow mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Rechercher</span>
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Nom, email ou entreprise..."
              class="input input-bordered"
              @input="handleSearch"
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Statut</span>
            </label>
            <select v-model="statusFilter" class="select select-bordered" @change="handleFilter">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Actions</span>
            </label>
            <button @click="clearFilters" class="btn btn-outline">
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div v-if="loading" class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="customers.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
          <p class="text-gray-500 mb-4">
            {{ searchQuery || statusFilter ? 'Aucun client ne correspond à vos critères.' : 'Commencez par ajouter votre premier client.' }}
          </p>
          <router-link v-if="!searchQuery && !statusFilter" to="/customers/new" class="btn btn-primary">
            Ajouter un client
          </router-link>
        </div>

        <!-- ma table avec vuetify -->
        <VuetifyDataTable
          :items="toRaw(customers)"
          :loading="loading"
          type="customers"
          @view="viewCustomer"
          @edit="editCustomer"
          @delete="handleDelete"
        >
          <template #actions>
            <v-btn
              v-if="isAdmin"
              color="primary"
              prepend-icon="mdi-plus"
              @click="$router.push('/customers/new')"
            >
              nouveau client
            </v-btn>
          </template>
        </VuetifyDataTable>

        <!-- pagination -->
        <div v-if="pagination.totalPages > 1" class="flex justify-center mt-6">
          <div class="join">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="join-item btn"
            >
              «
            </button>
            <button
              v-for="page in getPageNumbers()"
              :key="page"
              @click="changePage(page)"
              :class="['join-item btn', { 'btn-active': page === pagination.page }]"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="join-item btn"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomers } from '@/composables/useCustomers'
import { useAuth } from '@/composables/useAuth'
import VuetifyDataTable from '@/components/VuetifyDataTable.vue'

const {
  customers,
  loading,
  error,
  pagination,
  fetchCustomers,
  searchCustomers,
  deleteCustomer
} = useCustomers()

const router = useRouter()
const { isAdmin } = useAuth()

const searchQuery = ref('')
const statusFilter = ref('')
let searchTimeout: number | null = null

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
  return new Date(date).toLocaleDateString('fr-FR')
}

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      searchCustomers(searchQuery.value)
    } else {
      fetchCustomers(pagination.value.page, pagination.value.limit)
    }
  }, 300)
}

const handleFilter = () => {
  fetchCustomers(pagination.value.page, pagination.value.limit)
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  fetchCustomers(pagination.value.page, pagination.value.limit)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchCustomers(page, pagination.value.limit)
  }
}

const getPageNumbers = () => {
  const pages = []
  const current = pagination.value.page
  const total = pagination.value.totalPages
  
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
}

const viewCustomer = (customer: any) => {
  router.push(`/customers/${customer.id}`)
}

const editCustomer = (customer: any) => {
  router.push(`/customers/${customer.id}/edit`)
}

const handleDelete = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
    try {
      await deleteCustomer(id)
    } catch (err) {
      console.error('suppression erreur:', err)
    }
  }
}

onMounted(() => {
  fetchCustomers()
})

watch(statusFilter, () => {
  handleFilter()
})
</script> 