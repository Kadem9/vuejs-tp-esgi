<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">import / export</h3>
      
      <!-- section export -->
      <div class="mb-6">
        <h4 class="font-semibold mb-3">exporter</h4>
        <div class="flex gap-2">
          <button 
            @click="exportCustomers"
            class="btn btn-outline btn-sm"
            :disabled="loading"
          >
            <i class="fas fa-download mr-2"></i>
            clients
          </button>
          <button 
            @click="exportInteractions"
            class="btn btn-outline btn-sm"
            :disabled="loading"
          >
            <i class="fas fa-download mr-2"></i>
            interactions
          </button>
        </div>
      </div>

      <!-- section import -->
      <div class="mb-6">
        <h4 class="font-semibold mb-3">importer</h4>
        
        <!-- choix du type -->
        <div class="form-control mb-3">
          <label class="label">
            <span class="label-text">type de données</span>
          </label>
          <select v-model="importType" class="select select-bordered">
            <option value="customers">clients</option>
            <option value="interactions">interactions</option>
          </select>
        </div>

        <!-- upload du fichier -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">fichier csv</span>
          </label>
          <input
            ref="fileInput"
            type="file"
            accept=".csv"
            @change="handleFileSelect"
            class="file-input file-input-bordered w-full"
          />
          <label class="label">
            <span class="label-text-alt">format: nom,email,téléphone,entreprise,statut,notes</span>
          </label>
        </div>

        <!-- aperçu -->
        <div v-if="previewData.length > 0" class="mt-4">
          <h5 class="font-medium mb-2">aperçu ({{ previewData.length }} lignes)</h5>
          <div class="max-h-40 overflow-y-auto border rounded p-2">
            <div v-for="(row, index) in previewData.slice(0, 5)" :key="index" class="text-sm">
              {{ JSON.stringify(row) }}
            </div>
            <div v-if="previewData.length > 5" class="text-sm text-gray-500">
              ... et {{ previewData.length - 5 }} autres lignes
            </div>
          </div>
        </div>

        <!-- erreurs -->
        <div v-if="importErrors.length > 0" class="mt-4">
          <div class="alert alert-error">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
              <h4 class="font-bold">erreurs d'import</h4>
              <ul class="text-sm">
                <li v-for="error in importErrors" :key="error">{{ error }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- bouton import -->
        <button 
          v-if="previewData.length > 0 && importErrors.length === 0"
          @click="importData"
          class="btn btn-primary btn-sm mt-3"
          :disabled="loading"
        >
          <i class="fas fa-upload mr-2"></i>
          importer {{ validData.length }} éléments
        </button>
      </div>

      <!-- loading -->
      <div v-if="loading" class="flex justify-center py-4">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- message de succès -->
      <div v-if="successMessage" class="alert alert-success mt-4">
        <i class="fas fa-check-circle"></i>
        <span>{{ successMessage }}</span>
      </div>

      <!-- bouton fermer -->
      <div class="modal-action">
        <button @click="$emit('close')" class="btn">fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import { useCustomers } from '@/composables/useCustomers'
import { useInteractions } from '@/composables/useInteractions'
import { apiService } from '@/services/apiService'
import { 
  exportCustomersToCSV, 
  exportInteractionsToCSV, 
  parseCSV, 
  validateCustomerData, 
  validateInteractionData 
} from '@/services/exportService'

const emit = defineEmits<{
  close: []
  imported: []
}>()

const { customers } = useCustomers()
const { interactions } = useInteractions()

const fileInput = ref<HTMLInputElement>()
const importType = ref<'customers' | 'interactions'>('customers')
const previewData = ref<any[]>([])
const importErrors = ref<string[]>([])
const loading = ref(false)
const successMessage = ref('')

const validData = computed(() => {
  if (importType.value === 'customers') {
    return validateCustomerData(previewData.value).valid
  } else {
    return validateInteractionData(previewData.value).valid
  }
})

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  try {
    loading.value = true
    const data = await parseCSV(file)
    previewData.value = data
    
    // valider données
    if (importType.value === 'customers') {
      const { errors } = validateCustomerData(data)
      importErrors.value = errors
    } else {
      const { errors } = validateInteractionData(data)
      importErrors.value = errors
    }
  } catch (error) {
    console.error('file parse error:', error)
    importErrors.value = ['erreur lors de la lecture du fichier']
  } finally {
    loading.value = false
  }
}

const exportCustomers = () => {
  exportCustomersToCSV(toRaw(customers.value))
}

const exportInteractions = () => {
  exportInteractionsToCSV(toRaw(interactions.value))
}

const importData = async () => {
  if (validData.value.length === 0) return
  
  try {
    loading.value = true
    
    if (importType.value === 'customers') {
      await apiService.bulkImportCustomers(validData.value)
      successMessage.value = `${validData.value.length} clients importés`
    } else {
      await apiService.bulkImportInteractions(validData.value)
      successMessage.value = `${validData.value.length} interactions importées`
    }
    
    emit('imported')
    
    // reset du form
    previewData.value = []
    importErrors.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
  } catch (error) {
    console.error('import error:', error)
    importErrors.value = ['erreur lors de l\'import']
  } finally {
    loading.value = false
  }
}
</script> 