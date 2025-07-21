<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Interactions</h1>
      <button 
        @click="showCreateModal = true"
        class="btn btn-primary"
      >
        <i class="fas fa-plus mr-2"></i>
        Nouvelle interaction
      </button>
    </div>

    <!-- mes filtres pour chercher -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Type</span>
            </label>
            <select v-model="filters.type" class="select select-bordered">
              <option value="">Tous les types</option>
              <option value="call">Appel</option>
              <option value="email">Email</option>
              <option value="meeting">Réunion</option>
              <option value="note">Note</option>
              <option value="task">Tâche</option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Statut</span>
            </label>
            <select v-model="filters.status" class="select select-bordered">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Priorité</span>
            </label>
            <select v-model="filters.priority" class="select select-bordered">
              <option value="">Toutes les priorités</option>
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Actions</span>
            </label>
            <button @click="applyFilters" class="btn btn-primary">
              Filtrer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- j'affiche tt mes interactions ici -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div v-if="loading" class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="error" class="alert alert-error">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ error }}</span>
        </div>

        <div v-else-if="interactions.length === 0" class="text-center py-8">
          <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500">Aucune interaction trouvée</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="interaction in interactions" 
            :key="interaction.id"
            class="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
            @click="viewInteraction(interaction)"
          >
            <div class="card-body p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="badge badge-primary">{{ getTypeLabel(interaction.type) }}</span>
                    <span :class="getStatusBadgeClass(interaction.status)">
                      {{ getStatusLabel(interaction.status) }}
                    </span>
                    <span :class="getPriorityBadgeClass(interaction.priority)">
                      {{ getPriorityLabel(interaction.priority) }}
                    </span>
                  </div>
                  
                  <h3 class="font-semibold text-lg">{{ interaction.title }}</h3>
                  
                  <p v-if="interaction.description" class="text-gray-600 mt-1">
                    {{ interaction.description }}
                  </p>
                  
                  <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div class="flex items-center gap-1">
                      <i class="fas fa-user"></i>
                      <span>{{ interaction.user?.name }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <i class="fas fa-building"></i>
                      <span>{{ interaction.customer?.name }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <i class="fas fa-calendar"></i>
                      <span>{{ formatDate(interaction.date) }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button 
                    @click.stop="editInteraction(interaction)"
                    class="btn btn-sm btn-outline"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click.stop="handleDeleteInteraction(interaction.id)"
                    class="btn btn-sm btn-error"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- pagination pour naviguer -->
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
              :class="['join-item btn', page === pagination.page ? 'btn-active' : '']"
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

    <!-- modal pr créer/modifier -->
    <InteractionModal 
      v-if="showCreateModal || showEditModal"
      :interaction="currentInteraction"
      :is-editing="showEditModal"
      @close="closeModal"
      @saved="onInteractionSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInteractions } from '@/composables/useInteractions'
import { useAuth } from '@/composables/useAuth'
import InteractionModal from '@/components/InteractionModal.vue'
import type { Interaction } from '@/types'

const router = useRouter()
const { isAdmin } = useAuth()
const {
  interactions,
  loading,
  error,
  pagination,
  fetchInteractions,
  createInteraction,
  updateInteraction,
  deleteInteraction,
  clearError
} = useInteractions()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const currentInteraction = ref<Interaction | null>(null)

const filters = ref({
  type: '',
  status: '',
  priority: ''
})

onMounted(() => {
  fetchInteractions()
})

const applyFilters = () => {
  fetchInteractions(1, 10, undefined, filters.value.type, filters.value.status)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchInteractions(page, 10, undefined, filters.value.type, filters.value.status)
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

const viewInteraction = (interaction: Interaction) => {
  currentInteraction.value = interaction
  showEditModal.value = true
}

const editInteraction = (interaction: Interaction) => {
  currentInteraction.value = interaction
  showEditModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  currentInteraction.value = null
  clearError()
}

const onInteractionSaved = () => {
  closeModal()
  fetchInteractions(pagination.value.page, 10, undefined, filters.value.type, filters.value.status)
}

const handleDeleteInteraction = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette interaction ?')) {
    try {
      await deleteInteraction(id)
      fetchInteractions(pagination.value.page, 10, undefined, filters.value.type, filters.value.status)
    } catch (error) {
      console.error('delete error:', error)
    }
  }
}

const getTypeLabel = (type: string) => {
  const labels = {
    call: 'Appel',
    email: 'Email',
    meeting: 'Réunion',
    note: 'Note',
    task: 'Tâche'
  }
  return labels[type as keyof typeof labels] || type
}

const getStatusLabel = (status: string) => {
  const labels = {
    pending: 'En attente',
    completed: 'Terminé',
    cancelled: 'Annulé'
  }
  return labels[status as keyof typeof labels] || status
}

const getPriorityLabel = (priority: string) => {
  const labels = {
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute'
  }
  return labels[priority as keyof typeof labels] || priority
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge badge-warning',
    completed: 'badge badge-success',
    cancelled: 'badge badge-error'
  }
  return classes[status as keyof typeof classes] || 'badge badge-neutral'
}

const getPriorityBadgeClass = (priority: string) => {
  const classes = {
    low: 'badge badge-info',
    medium: 'badge badge-warning',
    high: 'badge badge-error'
  }
  return classes[priority as keyof typeof classes] || 'badge badge-neutral'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 