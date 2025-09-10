<template>
  <nav class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl border-b border-purple-500 border-opacity-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <router-link to="/dashboard" class="group flex-shrink-0 flex items-center transition-transform duration-300 hover:scale-105">
            <div class="h-10 w-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-3">
              <span class="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">FitServe</span>
              <div class="text-xs text-blue-200 opacity-90">Nutrition Tracker</div>
            </div>
          </router-link>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden md:flex md:items-center md:space-x-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-white hover:bg-opacity-20 hover:backdrop-blur-sm"
            :class="{
              'bg-white bg-opacity-20 text-white shadow-lg': $route.path === item.href,
              'text-blue-100 hover:text-white': $route.path !== item.href
            }"
          >
            <div class="flex items-center space-x-2">
              <!-- Dashboard Icon -->
              <svg v-if="item.name === 'Dashboard'" class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v4m4-4v4m4-4v4" />
              </svg>
              <!-- Food Log Icon -->
              <svg v-else-if="item.name === 'Food Log'" class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
              </svg>
              <!-- Progress Icon -->
              <svg v-else-if="item.name === 'Progress'" class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <!-- Goals Icon -->
              <svg v-else-if="item.name === 'Goals'" class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <!-- Reports Icon -->
              <svg v-else-if="item.name === 'Reports'" class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm font-semibold">{{ item.name }}</span>
            </div>
            <!-- Active indicator -->
            <div v-if="$route.path === item.href" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
          </router-link>
        </div>

        <!-- User menu -->
        <div class="flex items-center space-x-3">
          <!-- Daily Progress Badge (Hidden on mobile) -->
          <div class="hidden lg:flex items-center">
            <div class="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1.5">
              <svg class="w-4 h-4 text-emerald-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span class="text-sm font-bold text-white">{{ Math.round(nutritionStore.overallProgress) || 0 }}%</span>
              <span class="text-xs text-blue-200 ml-1">today</span>
            </div>
          </div>

          <!-- Profile dropdown -->
          <div class="relative" ref="profileDropdown">
            <button
              @click="toggleProfileMenu"
              type="button"
              class="group flex items-center space-x-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span class="text-sm font-bold text-white">
                  {{ userInitials }}
                </span>
              </div>
              <div class="hidden sm:block text-left">
                <div class="text-sm font-semibold text-white">{{ currentUser?.firstName || 'User' }}</div>
                <div class="text-xs text-blue-200">{{ currentUser?.email }}</div>
              </div>
              <svg class="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Profile dropdown menu -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95 translate-y-2"
              enter-to-class="transform opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 scale-100 translate-y-0"
              leave-to-class="transform opacity-0 scale-95 translate-y-2"
            >
              <div
                v-show="showProfileMenu"
                class="origin-top-right absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl bg-white ring-1 ring-gray-200 focus:outline-none z-50 overflow-hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <!-- User Info Header -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <div class="flex items-center space-x-4">
                    <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                      <span class="text-lg font-bold text-white">{{ userInitials }}</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-lg font-bold text-white">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
                      <p class="text-sm text-blue-200">{{ currentUser?.email }}</p>
                    </div>
                  </div>
                  
                  <!-- Quick Stats -->
                  <div class="mt-4 grid grid-cols-2 gap-3">
                    <div class="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-white">{{ Math.round(nutritionStore.overallProgress) || 0 }}%</div>
                      <div class="text-xs text-blue-200">Today's Progress</div>
                    </div>
                    <div class="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-white">{{ nutritionStore.remainingCalories || 0 }}</div>
                      <div class="text-xs text-blue-200">Calories Left</div>
                    </div>
                  </div>
                </div>
                
                <!-- Menu Items -->
                <div class="py-2">
                  <router-link
                    to="/profile"
                    class="group flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200"
                    role="menuitem"
                    @click="closeProfileMenu"
                  >
                    <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <div class="font-medium">Your Profile</div>
                      <div class="text-xs text-gray-500 group-hover:text-blue-600">Manage account settings</div>
                    </div>
                  </router-link>
                  
                  <router-link
                    to="/goals"
                    class="group flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 transition-all duration-200"
                    role="menuitem"
                    @click="closeProfileMenu"
                  >
                    <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                      <div class="font-medium">Nutrition Goals</div>
                      <div class="text-xs text-gray-500 group-hover:text-emerald-600">Set your daily targets</div>
                    </div>
                  </router-link>
                </div>
                
                <!-- Logout Section -->
                <div class="border-t border-gray-100 bg-gray-50">
                  <button
                    @click="handleLogout"
                    class="group flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                    role="menuitem"
                  >
                    <svg class="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <div>
                      <div class="font-medium">Sign Out</div>
                      <div class="text-xs text-red-400">End your session</div>
                    </div>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            type="button"
            class="md:hidden inline-flex items-center justify-center p-2 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200"
            aria-controls="mobile-menu"
            :aria-expanded="showMobileMenu"
          >
            <span class="sr-only">{{ showMobileMenu ? 'Close' : 'Open' }} main menu</span>
            <svg v-if="!showMobileMenu" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95 -translate-y-2"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-2"
    >
      <div v-show="showMobileMenu" class="md:hidden bg-gradient-to-b from-purple-700 to-indigo-800 border-t border-purple-500 border-opacity-30" id="mobile-menu">
        <div class="px-3 py-3 space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
            :class="{
              'bg-white bg-opacity-20 text-white shadow-lg': $route.path === item.href,
              'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white': $route.path !== item.href
            }"
            @click="closeMobileMenu"
          >
            <!-- Mobile Menu Icons -->
            <svg v-if="item.name === 'Dashboard'" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <svg v-else-if="item.name === 'Food Log'" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
            </svg>
            <svg v-else-if="item.name === 'Progress'" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <svg v-else-if="item.name === 'Goals'" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <svg v-else-if="item.name === 'Reports'" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{{ item.name }}</span>
          </router-link>
        </div>
        
        <!-- Mobile User Section -->
        <div class="border-t border-purple-500 border-opacity-30 px-3 py-3">
          <div class="flex items-center px-4 py-3 bg-white bg-opacity-10 rounded-xl">
            <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <span class="text-sm font-bold text-white">{{ userInitials }}</span>
            </div>
            <div class="ml-3 flex-1">
              <div class="text-sm font-semibold text-white">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
              <div class="text-xs text-blue-200">{{ currentUser?.email }}</div>
            </div>
          </div>
          
          <!-- Mobile Actions -->
          <div class="mt-3 space-y-1">
            <router-link
              to="/profile"
              class="flex items-center px-4 py-2 text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white rounded-xl transition-all duration-200"
              @click="closeMobileMenu"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-sm font-medium">Profile Settings</span>
            </router-link>
            
            <button
              @click="handleLogout"
              class="flex items-center w-full px-4 py-2 text-red-300 hover:bg-red-600 hover:bg-opacity-20 hover:text-red-200 rounded-xl transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNutritionStore } from '@/stores/nutrition'

// Icons (you can replace these with actual icon components)
const DashboardIcon = 'div' // Replace with actual icon
const FoodIcon = 'div' // Replace with actual icon
const ProgressIcon = 'div' // Replace with actual icon
const GoalsIcon = 'div' // Replace with actual icon
const ReportsIcon = 'div' // Replace with actual icon

const router = useRouter()
const authStore = useAuthStore()
const nutritionStore = useNutritionStore()

// Reactive state
const showProfileMenu = ref(false)
const showMobileMenu = ref(false)
const profileDropdown = ref<HTMLElement | null>(null)

// Computed properties
const currentUser = computed(() => authStore.currentUser)
const userInitials = computed(() => {
  if (!currentUser.value) return 'U'
  const first = currentUser.value.firstName?.[0] || ''
  const last = currentUser.value.lastName?.[0] || ''
  return (first + last).toUpperCase() || 'U'
})

// Navigation items
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: DashboardIcon
  },
  {
    name: 'Food Log',
    href: '/food',
    icon: FoodIcon
  },
  {
    name: 'Progress',
    href: '/progress',
    icon: ProgressIcon
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: GoalsIcon
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: ReportsIcon
  }
]

// Methods
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  if (showMobileMenu.value) {
    showMobileMenu.value = false
  }
}

const closeProfileMenu = () => {
  showProfileMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showProfileMenu.value) {
    showProfileMenu.value = false
  }
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
  closeProfileMenu()
}

// Click outside handler
const handleClickOutside = (event: Event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target as Node)) {
    showProfileMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>