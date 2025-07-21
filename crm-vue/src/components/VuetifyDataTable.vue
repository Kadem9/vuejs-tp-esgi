<template>
  <div class="vuetify-table-container">
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :items-per-page-options="[5, 10, 25, 50]"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      class="elevation-1"
      density="compact"
    >
      <!-- barre de recherche -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="rechercher"
            single-line
            hide-details
            class="mr-4"
          />
          <v-spacer />
          <slot name="actions" />
        </v-toolbar>
      </template>

      <!-- templates pr les cellules -->
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          variant="flat"
        >
          {{ getStatusLabel(item.status) }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          color="primary"
          @click="$emit('view', item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          color="warning"
          @click="$emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="$emit('delete', item)"
        />
      </template>

      <!-- pas de données -->
      <template v-slot:no-data>
        <v-alert
          type="info"
          text="aucune donnée trouvée"
          class="ma-4"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  items: readonly any[]
  loading?: boolean
  type?: 'customers' | 'interactions'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  type: 'customers'
})

const emit = defineEmits<{
  view: [item: any]
  edit: [item: any]
  delete: [item: any]
}>()

const search = ref('')
const itemsPerPage = ref(10)

const headers = computed(() => {
  if (props.type === 'customers') {
    return [
      { title: 'nom', key: 'name', sortable: true },
      { title: 'email', key: 'email', sortable: true },
      { title: 'entreprise', key: 'company', sortable: true },
      { title: 'statut', key: 'status', sortable: true },
      { title: 'actions', key: 'actions', sortable: false }
    ]
  } else {
    return [
      { title: 'titre', key: 'title', sortable: true },
      { title: 'type', key: 'type', sortable: true },
      { title: 'client', key: 'customer.name', sortable: true },
      { title: 'statut', key: 'status', sortable: true },
      { title: 'date', key: 'date', sortable: true },
      { title: 'actions', key: 'actions', sortable: false }
    ]
  }
})

const getStatusColor = (status: string) => {
  const colors = {
    active: 'success',
    prospect: 'warning',
    inactive: 'error',
    pending: 'warning',
    completed: 'success',
    cancelled: 'error'
  }
  return colors[status as keyof typeof colors] || 'grey'
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
</script>

<style scoped>
.vuetify-table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
</style> 