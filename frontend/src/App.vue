<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navigation from '@/components/layout/Navigation.vue'

const route = useRoute()
const authStore = useAuthStore()

// Check if current route requires authentication
const isAuthRoute = computed(() => {
  return ['/login', '/register', '/forgot-password'].includes(route.path)
})

// Initialize auth state on app load
onMounted(async () => {
  // First check if we have a valid token format before making API calls
  const hasValidToken = authStore.checkAuthStatus()
  
  if (hasValidToken) {
    // Only make API call if we have a valid token format
    await authStore.initializeAuth()
  }
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation (only show if not on auth pages) -->
    <Navigation v-if="!isAuthRoute && authStore.isAuthenticated" />
    
    <!-- Main content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading spinner */
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>