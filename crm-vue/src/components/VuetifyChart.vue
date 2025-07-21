<template>
  <div class="chart-container">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start icon="mdi-chart-line" />
        {{ title }}
      </v-card-title>
      
      <v-card-text>
        <div class="chart-content">
          <!-- placeholder pr chart - j'ajouterai chart.js plus tard -->
          <div class="chart-placeholder">
            <v-icon size="64" color="primary" icon="mdi-chart-bar" />
            <p class="text-center mt-4 text-grey-600">
              graphique {{ type }} - {{ data.length }} éléments
            </p>
          </div>
          
          <!-- résumé des données -->
          <div class="data-summary mt-4">
            <v-row>
              <v-col v-for="(item, index) in data" :key="index" cols="6" md="3">
                <v-card variant="outlined" class="text-center pa-3">
                  <div class="text-h6 font-weight-bold" :class="getColorClass(item.type)">
                    {{ item.value }}
                  </div>
                  <div class="text-caption text-grey-600">
                    {{ item.label }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
interface ChartData {
  label: string
  value: number
  type: 'success' | 'warning' | 'error' | 'info'
}

interface Props {
  title: string
  type: 'bar' | 'line' | 'pie' | 'doughnut'
  data: ChartData[]
}

defineProps<Props>()

const getColorClass = (type: string) => {
  const classes = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info'
  }
  return classes[type as keyof typeof classes] || 'text-grey'
}
</script>

<style scoped>
.chart-container {
  height: 100%;
}

.chart-content {
  min-height: 300px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f5f5f5;
  border-radius: 8px;
}

.data-summary {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}
</style> 