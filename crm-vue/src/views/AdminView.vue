<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Administration</h1>
      <p class="text-gray-600">Gestion du système CRM</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Statistiques système</h2>
          <div class="stats stats-vertical">
            <div class="stat">
              <div class="stat-title">Utilisateurs</div>
              <div class="stat-value text-primary">2</div>
              <div class="stat-desc">Utilisateurs actifs</div>
            </div>
            <div class="stat">
              <div class="stat-title">Clients</div>
              <div class="stat-value text-success">{{ totalCustomers }}</div>
              <div class="stat-desc">Clients enregistrés</div>
            </div>
            <div class="stat">
              <div class="stat-title">Taux de conversion</div>
              <div class="stat-value text-info">{{ conversionRate }}%</div>
              <div class="stat-desc">Prospects → Clients</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Actions système</h2>
          <div class="space-y-3">
            <button class="btn btn-outline btn-block">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Exporter les données
            </button>
            <button class="btn btn-outline btn-block">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Sauvegarde
            </button>
            <button class="btn btn-outline btn-block">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Paramètres
            </button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Informations système</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Version:</span>
              <span class="font-medium">1.0.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Environnement:</span>
              <span class="font-medium">Développement</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Base de données:</span>
              <span class="font-medium">Mock</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Dernière sauvegarde:</span>
              <span class="font-medium">Jamais</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow mt-6">
      <div class="card-body">
        <h2 class="card-title">Logs système</h2>
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Date</th>
                <th>Niveau</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ new Date().toLocaleString('fr-FR') }}</td>
                <td><span class="badge badge-info">INFO</span></td>
                <td>Système démarré avec succès</td>
              </tr>
              <tr>
                <td>{{ new Date(Date.now() - 60000).toLocaleString('fr-FR') }}</td>
                <td><span class="badge badge-success">SUCCESS</span></td>
                <td>Utilisateur connecté: {{ user?.name }}</td>
              </tr>
              <tr>
                <td>{{ new Date(Date.now() - 120000).toLocaleString('fr-FR') }}</td>
                <td><span class="badge badge-warning">WARNING</span></td>
                <td>Aucune sauvegarde effectuée depuis 30 jours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useCustomers } from '@/composables/useCustomers'

const { user } = useAuth()
const { customers, fetchCustomers } = useCustomers()

const totalCustomers = computed(() => customers.value.length)

const conversionRate = computed(() => {
  const total = customers.value.length
  const active = customers.value.filter(c => c.status === 'active').length
  return total > 0 ? Math.round((active / total) * 100) : 0
})

onMounted(() => {
  fetchCustomers()
})
</script> 