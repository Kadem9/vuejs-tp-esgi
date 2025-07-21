<template>
  <div class="p-6">
    <div class="mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p class="text-gray-600">Bienvenue, {{ user?.name }} !</p>
        </div>
        <div class="badge badge-lg" :class="isAdmin ? 'badge-warning' : 'badge-info'">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          {{ isAdmin ? 'Administrateur' : 'Utilisateur' }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="stat bg-base-100 shadow rounded-lg">
        <div class="stat-figure text-primary">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <div class="stat-title">Total Clients</div>
        <div class="stat-value text-primary">{{ stats.totalCustomers }}</div>
      </div>

      <div class="stat bg-base-100 shadow rounded-lg">
        <div class="stat-figure text-success">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-title">Clients Actifs</div>
        <div class="stat-value text-success">{{ stats.activeCustomers }}</div>
      </div>

      <div class="stat bg-base-100 shadow rounded-lg">
        <div class="stat-figure text-info">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-title">Prospects</div>
        <div class="stat-value text-info">{{ stats.prospects }}</div>
      </div>

      <div class="stat bg-base-100 shadow rounded-lg">
        <div class="stat-figure text-warning">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <div class="stat-title">Interactions en attente</div>
        <div class="stat-value text-warning">{{ stats.pendingInteractions }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="stat bg-base-100 shadow rounded-lg">
        <div class="stat-figure text-secondary">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <div class="stat-title">Total Interactions</div>
        <div class="stat-value text-secondary">{{ stats.totalInteractions }}</div>
      </div>

      <div class="stat bg-base-100 shadow rounded-lg">
        <div class="stat-figure text-accent">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-title">Taux de Conversion</div>
        <div class="stat-value text-accent">{{ stats.conversionRate }}%</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Actions rapides</h2>
          <div class="space-y-3">
            <router-link to="/customers/new" class="btn btn-primary btn-block">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Nouveau client
            </router-link>
            <router-link to="/customers" class="btn btn-outline btn-block">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Voir tous les clients
            </router-link>
            <router-link to="/interactions" class="btn btn-outline btn-block">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Voir les interactions
            </router-link>
            <router-link v-if="isAdmin" to="/admin" class="btn btn-outline btn-block">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Administration
            </router-link>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Clients récents</h2>
          <div v-if="loading" class="flex justify-center py-4">
            <span class="loading loading-spinner loading-md"></span>
          </div>
          <div v-else-if="recentCustomers.length === 0" class="text-center py-4 text-gray-500">
            Aucun client récent
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="customer in recentCustomers.slice(0, 3)"
              :key="customer.id"
              class="flex items-center justify-between p-3 bg-base-200 rounded-lg"
            >
              <div>
                <div class="font-medium">{{ customer.name }}</div>
                <div class="text-sm text-gray-600">{{ customer.company }}</div>
              </div>
              <div class="badge" :class="getStatusBadgeClass(customer.status)">
                {{ getStatusLabel(customer.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isAdmin" class="card bg-base-100 shadow mb-8">
      <div class="card-body">
        <h2 class="card-title text-warning">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          Actions d'administration
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="stat bg-warning/10 rounded-lg p-4">
            <div class="stat-title text-warning">Clients inactifs</div>
            <div class="stat-value text-warning">{{ inactiveCustomersCount }}</div>
            <div class="stat-desc">Nécessitent une attention</div>
          </div>
          <div class="stat bg-info/10 rounded-lg p-4">
            <div class="stat-title text-info">Prospects</div>
            <div class="stat-value text-info">{{ prospectsCount }}</div>
            <div class="stat-desc">À convertir</div>
          </div>
          <div class="stat bg-success/10 rounded-lg p-4">
            <div class="stat-title text-success">Taux de conversion</div>
            <div class="stat-value text-success">{{ conversionRate }}%</div>
            <div class="stat-desc">Prospects → Clients</div>
          </div>
        </div>
        <div class="mt-4 flex space-x-2">
          <button class="btn btn-warning btn-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            Relancer les inactifs
          </button>
          <button class="btn btn-info btn-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Contacter les prospects
          </button>
        </div>
      </div>
    </div>

    <div v-if="!isAdmin" class="card bg-base-100 shadow mb-8">
      <div class="card-body">
        <h2 class="card-title text-info">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Mes tâches
        </h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-info/10 rounded-lg">
            <div>
              <div class="font-medium">Suivre les prospects</div>
              <div class="text-sm text-gray-600">3 prospects à contacter cette semaine</div>
            </div>
            <div class="badge badge-info">Urgent</div>
          </div>
          <div class="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
            <div>
              <div class="font-medium">Mettre à jour les fiches</div>
              <div class="text-sm text-gray-600">5 clients nécessitent une mise à jour</div>
            </div>
            <div class="badge badge-warning">En cours</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useCustomers } from '@/composables/useCustomers'
import type { DashboardStats } from '@/types'

const { user, isAdmin } = useAuth()
const { customers, loading, fetchCustomers } = useCustomers()

const stats = ref<DashboardStats>({
  totalCustomers: 0,
  activeCustomers: 0,
  prospects: 0,
  inactiveCustomers: 0,
  conversionRate: 0,
  totalInteractions: 0,
  pendingInteractions: 0
})

const recentCustomers = computed(() => customers.value.slice(0, 5))

const inactiveCustomersCount = computed(() => 
  customers.value.filter(c => c.status === 'inactive').length
)

const prospectsCount = computed(() => 
  customers.value.filter(c => c.status === 'prospect').length
)

const conversionRate = computed(() => {
  const total = customers.value.length
  const active = customers.value.filter(c => c.status === 'active').length
  return total > 0 ? Math.round((active / total) * 100) : 0
})

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

const calculateStats = () => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  stats.value = {
    totalCustomers: customers.value.length,
    activeCustomers: customers.value.filter(c => c.status === 'active').length,
    prospects: customers.value.filter(c => c.status === 'prospect').length,
    inactiveCustomers: customers.value.filter(c => c.status === 'inactive').length,
    conversionRate: conversionRate.value,
    totalInteractions: 0,
    pendingInteractions: 0
  }
}

onMounted(async () => {
  await fetchCustomers()
  calculateStats()
})
</script> 