<template>
  <div id="app">
    <AppHeader v-if="isAuthenticated" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import AppHeader from '@/components/ui/AppHeader.vue'

const { isAuthenticated, checkAuth } = useAuth()

onMounted(() => {
  checkAuth()
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f8fafc;
}

main {
  min-height: calc(100vh - 64px);
}
</style>
