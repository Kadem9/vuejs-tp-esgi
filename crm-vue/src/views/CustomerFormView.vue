<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">
        {{ isEditing ? 'Modifier le client' : 'Nouveau client' }}
      </h1>
      <p class="text-gray-600">
        {{ isEditing ? 'Modifiez les informations du client' : 'Ajoutez un nouveau client à votre base' }}
      </p>
    </div>

    <div class="card bg-base-100 shadow max-w-2xl">
      <div class="card-body">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nom *</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Nom complet"
                class="input input-bordered"
                :class="{ 'input-error': errors.name }"
                required
              />
              <label v-if="errors.name" class="label">
                <span class="label-text-alt text-error">{{ errors.name }}</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Email *</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="email@exemple.com"
                class="input input-bordered"
                :class="{ 'input-error': errors.email }"
                required
              />
              <label v-if="errors.email" class="label">
                <span class="label-text-alt text-error">{{ errors.email }}</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Téléphone</span>
              </label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="01 23 45 67 89"
                class="input input-bordered"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Entreprise</span>
              </label>
              <input
                v-model="form.company"
                type="text"
                placeholder="Nom de l'entreprise"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Statut *</span>
            </label>
            <select
              v-model="form.status"
              class="select select-bordered"
              :class="{ 'select-error': errors.status }"
              required
            >
              <option value="">Sélectionner un statut</option>
              <option value="active">Actif</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactif</option>
            </select>
            <label v-if="errors.status" class="label">
              <span class="label-text-alt text-error">{{ errors.status }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Notes</span>
            </label>
            <textarea
              v-model="form.notes"
              class="textarea textarea-bordered h-24"
              placeholder="Notes sur le client..."
            ></textarea>
          </div>

          <div v-if="error && isEditing" class="alert alert-error">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ error }}</span>
          </div>

          <div class="flex justify-end space-x-3">
            <router-link to="/customers" class="btn btn-outline">
              Annuler
            </router-link>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              {{ loading ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomers } from '@/composables/useCustomers'
import type { CustomerFormData } from '@/types'

const route = useRoute()
const router = useRouter()
const { currentCustomer, loading, error, fetchCustomerById, createCustomer, updateCustomer, clearError } = useCustomers()

const isEditing = computed(() => {
  const id = route.params.id as string
  return id && id !== 'new'
})

const form = ref<CustomerFormData>({
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'prospect',
  notes: ''
})

const errors = ref<Partial<Record<keyof CustomerFormData, string>>>({})

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Le nom est requis'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'L\'email n\'est pas valide'
  }

  if (!form.value.status) {
    errors.value.status = 'Le statut est requis'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    if (isEditing.value) {
      const customerId = route.params.id as string
      await updateCustomer(customerId, form.value)
    } else {
      await createCustomer(form.value)
    }
    
    router.push('/customers')
  } catch (err) {
    console.error('save error:', err)
  }
}

const loadCustomerData = () => {
  if (currentCustomer.value) {
    form.value = {
      name: currentCustomer.value.name,
      email: currentCustomer.value.email,
      phone: currentCustomer.value.phone || '',
      company: currentCustomer.value.company || '',
      status: currentCustomer.value.status,
      notes: currentCustomer.value.notes || ''
    }
  }
}

onMounted(async () => {
  clearError()
  
  if (isEditing.value) {
    const customerId = route.params.id as string
    await fetchCustomerById(customerId)
    // petit délai pr que ça se mette à jour
    setTimeout(() => {
      loadCustomerData()
    }, 100)
  }
})
</script> 