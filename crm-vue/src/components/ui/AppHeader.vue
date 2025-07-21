<template>
  <div class="navbar bg-base-100 shadow-lg">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/customers">Clients</router-link></li>
          <li><router-link to="/interactions">Interactions</router-link></li>
          <li v-if="isAdmin"><router-link to="/admin">Administration</router-link></li>
          <li><button @click="showImportExport = true">Import/Export</button></li>
        </ul>
      </div>
      <router-link to="/dashboard" class="btn btn-ghost text-xl">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        CRM Vue
      </router-link>
    </div>
    
    <div class="navbar-center hidden lg:flex">
      <div class="w-96 mr-4">
        <GlobalSearch />
      </div>
      <ul class="menu menu-horizontal px-1">
        <li><router-link to="/dashboard" class="btn btn-ghost">Dashboard</router-link></li>
        <li><router-link to="/customers" class="btn btn-ghost">Clients</router-link></li>
        <li><router-link to="/interactions" class="btn btn-ghost">Interactions</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin" class="btn btn-ghost">Administration</router-link></li>
        <li><button @click="showImportExport = true" class="btn btn-ghost">Import/Export</button></li>
      </ul>
    </div>
    
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img :src="user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" :alt="user?.name" />
          </div>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <div class="px-4 py-2 text-sm">
              <div class="font-medium">{{ user?.name }}</div>
              <div class="text-gray-500">{{ user?.email }}</div>
              <div class="badge mt-1" :class="isAdmin ? 'badge-warning' : 'badge-info'">
                {{ isAdmin ? 'Administrateur' : 'Utilisateur' }}
              </div>
            </div>
          </li>
          <li><hr class="my-2" /></li>
          <li><button @click="handleLogout" class="text-error">Déconnexion</button></li>
        </ul>
      </div>
    </div>

    <!-- modal import/export -->
    <ImportExportModal 
      v-if="showImportExport"
      @close="showImportExport = false"
      @imported="showImportExport = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import GlobalSearch from '@/components/GlobalSearch.vue'
import ImportExportModal from '@/components/ImportExportModal.vue'

const { user, isAdmin, logout } = useAuth()
const router = useRouter()
const showImportExport = ref(false)

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script> 