<template>
  <div class="modal modal-open">
    <div class="modal-box w-11/12 max-w-2xl">
      <h3 class="font-bold text-lg mb-4">
        {{ isEditing ? 'Modifier l\'interaction' : 'Nouvelle interaction' }}
      </h3>

      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- type d'interaction -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Type *</span>
            </label>
            <select v-model="form.type" class="select select-bordered" required>
              <option value="">Sélectionner un type</option>
              <option value="call">Appel</option>
              <option value="email">Email</option>
              <option value="meeting">Réunion</option>
              <option value="note">Note</option>
              <option value="task">Tâche</option>
            </select>
          </div>

          <!-- client -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Client *</span>
            </label>
            <select v-model="form.customerId" class="select select-bordered" required>
              <option value="">Sélectionner un client</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }} - {{ customer.company }}
              </option>
            </select>
          </div>

          <!-- titre -->
          <div class="form-control md:col-span-2">
            <label class="label">
              <span class="label-text">Titre *</span>
            </label>
            <input 
              v-model="form.title" 
              type="text" 
              class="input input-bordered" 
              placeholder="Titre de l'interaction"
              required
            />
          </div>

          <!-- description -->
          <div class="form-control md:col-span-2">
            <label class="label">
              <span class="label-text">Description</span>
            </label>
            <textarea 
              v-model="form.description" 
              class="textarea textarea-bordered" 
              placeholder="Description détaillée..."
              rows="3"
            ></textarea>
          </div>

          <!-- date -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Date</span>
            </label>
            <input 
              v-model="form.date" 
              type="datetime-local" 
              class="input input-bordered"
            />
          </div>

          <!-- statut -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Statut</span>
            </label>
            <select v-model="form.status" class="select select-bordered">
              <option value="pending">En attente</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <!-- Priorité -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Priorité</span>
            </label>
            <select v-model="form.priority" class="select select-bordered">
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
        </div>

        <div class="modal-action">
          <button type="button" @click="$emit('close')" class="btn">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            {{ isEditing ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useInteractions } from '@/composables/useInteractions'
import { useCustomers } from '@/composables/useCustomers'
import type { Interaction, InteractionFormData } from '@/types'

interface Props {
  interaction?: Interaction | null
  isEditing?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'saved', interaction: Interaction): void
}

const props = withDefaults(defineProps<Props>(), {
  interaction: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

const { createInteraction, updateInteraction, loading } = useInteractions()
const { customers, fetchCustomers } = useCustomers()

const form = ref<InteractionFormData>({
  customerId: '',
  type: 'note',
  title: '',
  description: '',
  date: '',
  status: 'pending',
  priority: 'medium'
})

onMounted(() => {
  fetchCustomers()
  if (props.interaction && props.isEditing) {
    form.value = {
      customerId: props.interaction.customerId,
      type: props.interaction.type,
      title: props.interaction.title,
      description: props.interaction.description || '',
      date: props.interaction.date ? new Date(props.interaction.date).toISOString().slice(0, 16) : '',
      status: props.interaction.status,
      priority: props.interaction.priority
    }
  } else {
    // date par défaut = maintenant
    form.value.date = new Date().toISOString().slice(0, 16)
  }
})

const handleSubmit = async () => {
  try {
    if (props.isEditing && props.interaction) {
      const updatedInteraction = await updateInteraction(props.interaction.id, form.value)
      emit('saved', updatedInteraction)
    } else {
      const newInteraction = await createInteraction(form.value)
      emit('saved', newInteraction)
    }
  } catch (error) {
    console.error('save error:', error)
  }
}
</script> 