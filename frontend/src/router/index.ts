import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import components
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import ForgotPassword from '@/components/auth/ForgotPassword.vue'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/food',
      name: 'food',
      component: () => import('@/views/Food.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/food/add',
      name: 'food-add',
      component: () => import('@/views/FoodAdd.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('@/views/Progress.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/progress/weight',
      name: 'progress-weight',
      component: () => import('@/views/ProgressWeight.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/goals',
      name: 'goals',
      component: () => import('@/views/Goals.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/Reports.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // For auth-required routes, check token validity first
  if (to.meta.requiresAuth) {
    const hasValidToken = authStore.checkAuthStatus()
    
    if (!hasValidToken) {
      console.log('No valid token found, redirecting to login')
      next('/login')
      return
    }
    
    // If we have a token but no user data, try to fetch it
    if (!authStore.user && authStore.token) {
      try {
        await authStore.fetchProfile()
      } catch (err) {
        console.warn('Failed to fetch profile in router guard, redirecting to login')
        next('/login')
        return
      }
    }
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
