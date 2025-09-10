<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      <!-- Floating Orbs Animation -->
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
      
      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 w-full max-w-md px-6">
      <!-- Glassmorphism Card -->
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:scale-105">
        <!-- Header Section -->
        <div class="text-center mb-8">
          <!-- Logo with Animation -->
          <div class="mx-auto mb-6 relative">
            <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 hover:rotate-12 hover:scale-110">
              <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <!-- Floating particles around logo -->
            <div class="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
          
          <!-- Title with Gradient Text -->
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p class="text-gray-600 mb-6">
            Sign in to continue your nutrition journey
          </p>
          
          <!-- Quick Access Note -->
          <div class="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-700 border border-blue-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            New here? 
            <router-link to="/register" class="ml-1 font-semibold hover:text-blue-800 transition-colors duration-200">
              Create an account
            </router-link>
          </div>
        </div>
        <!-- Enhanced Form -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Email Field -->
          <div class="relative group">
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                :disabled="isLoading"
                class="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                placeholder="Enter your email address"
                @focus="clearFieldError('email')"
              />
              <!-- Animated border effect -->
              <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
            </div>
          </div>

          <!-- Password Field -->
          <div class="relative group">
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                class="block w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                placeholder="Enter your password"
                @focus="clearFieldError('password')"
              />
              <!-- Show/Hide Password Button -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
              <!-- Animated border effect -->
              <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
            </div>
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center cursor-pointer group">
              <div class="relative">
                <input
                  id="remember-me"
                  v-model="rememberMe"
                  name="remember-me"
                  type="checkbox"
                  class="sr-only"
                />
                <div :class="[
                  'w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center',
                  rememberMe 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 shadow-lg' 
                    : 'border-gray-300 bg-white group-hover:border-blue-400'
                ]">
                  <svg v-if="rememberMe" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                Remember me for 30 days
              </span>
            </label>

            <router-link 
              to="/forgot-password" 
              class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
            >
              Forgot password?
            </router-link>
          </div>

          <!-- Enhanced Error Message -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform -translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform -translate-y-2"
          >
            <div v-if="error" class="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 shadow-sm">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3 flex-1">
                  <h3 class="text-sm font-semibold text-red-800 mb-1">Sign In Failed</h3>
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>
                <button 
                  @click="authStore.clearError()" 
                  class="ml-2 text-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </Transition>

          <!-- Enhanced Submit Button -->
          <div class="space-y-4">
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
            >
              <!-- Animated Background -->
              <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              
              <!-- Button Content -->
              <div class="relative flex items-center justify-center">
                <div v-if="isLoading" class="flex items-center">
                  <!-- Animated Loading Spinner -->
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  <span class="animate-pulse">Signing you in...</span>
                </div>
                <div v-else class="flex items-center">
                  <svg class="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In to Your Account</span>
                </div>
              </div>
              
              <!-- Ripple Effect -->
              <div class="absolute inset-0 overflow-hidden rounded-xl">
                <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </button>
            
            <!-- Alternative Sign In Methods Placeholder -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">Quick & secure sign in</span>
              </div>
            </div>
            
            <!-- Security Notice -->
            <div class="flex items-center justify-center text-xs text-gray-500 mt-4">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Your data is protected with enterprise-grade encryption</span>
            </div>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Background Particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full animate-bounce" style="animation-delay: 0s; animation-duration: 3s;"></div>
      <div class="absolute top-1/4 right-8 w-4 h-4 bg-yellow-400/30 rounded-full animate-bounce" style="animation-delay: 1s; animation-duration: 4s;"></div>
      <div class="absolute bottom-1/4 left-8 w-6 h-6 bg-pink-400/20 rounded-full animate-bounce" style="animation-delay: 2s; animation-duration: 5s;"></div>
      <div class="absolute top-3/4 right-1/4 w-3 h-3 bg-green-400/40 rounded-full animate-bounce" style="animation-delay: 0.5s; animation-duration: 3.5s;"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const form = ref<LoginForm>({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const showPassword = ref(false)
const fieldErrors = ref<Record<string, string>>({})

// Computed properties
const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

const isFormValid = computed(() => {
  return form.value.email && 
         form.value.password && 
         form.value.email.includes('@') && 
         form.value.password.length >= 6
})

const emailValidation = computed(() => {
  if (!form.value.email) return { isValid: true, message: '' }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(form.value.email)
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address'
  }
})

const passwordValidation = computed(() => {
  if (!form.value.password) return { isValid: true, message: '' }
  const isValid = form.value.password.length >= 6
  return {
    isValid,
    message: isValid ? '' : 'Password must be at least 6 characters long'
  }
})

// Methods
const clearFieldError = (field: string) => {
  if (fieldErrors.value[field]) {
    delete fieldErrors.value[field]
  }
  if (error.value) {
    authStore.clearError()
  }
}

const validateField = (field: keyof LoginForm) => {
  if (field === 'email' && !emailValidation.value.isValid) {
    fieldErrors.value.email = emailValidation.value.message
    return false
  }
  if (field === 'password' && !passwordValidation.value.isValid) {
    fieldErrors.value.password = passwordValidation.value.message
    return false
  }
  delete fieldErrors.value[field]
  return true
}

const handleLogin = async () => {
  // Clear previous errors
  authStore.clearError()
  fieldErrors.value = {}
  
  // Validate form
  const isEmailValid = validateField('email')
  const isPasswordValid = validateField('password')
  
  if (!isEmailValid || !isPasswordValid) {
    return
  }
  
  try {
    const result = await authStore.login(form.value)
    
    if (result.success) {
      // Store remember me preference
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }
      
      // Redirect with a slight delay for better UX
      setTimeout(() => {
        const redirect = router.currentRoute.value.query.redirect as string
        router.push(redirect || '/dashboard')
      }, 500)
    }
  } catch (err) {
    console.error('Login error:', err)
  }
}

// Watchers for real-time validation
watch(() => form.value.email, () => {
  if (fieldErrors.value.email) {
    validateField('email')
  }
})

watch(() => form.value.password, () => {
  if (fieldErrors.value.password) {
    validateField('password')
  }
})

// Lifecycle hooks
onMounted(() => {
  // Check if user wants to be remembered
  const remembered = localStorage.getItem('rememberMe')
  if (remembered === 'true') {
    rememberMe.value = true
  }
  
  // Focus on email field
  const emailField = document.getElementById('email')
  if (emailField) {
    emailField.focus()
  }
})

onUnmounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
/* Custom animations */
@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(1deg); }
  50% { transform: translateY(-10px) rotate(-1deg); }
  75% { transform: translateY(-15px) rotate(0.5deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(-0.5deg); }
  66% { transform: translateY(-25px) rotate(1deg); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Animation classes */
.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 10s ease-in-out infinite 2s;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

/* Grid pattern background */
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Enhanced glassmorphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Custom focus ring */
.focus-ring {
  @apply focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500;
}

/* Custom checkbox styles */
input[type="checkbox"] + div {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button hover effects */
.btn-gradient {
  background: linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899);
  background-size: 300% 300%;
  animation: gradient-shift 6s ease infinite;
}

/* Input field enhancements */
.input-enhanced {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-enhanced:focus {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.15);
}

/* Card hover effect */
.card-float:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Loading spinner enhancement */
.spinner-enhanced {
  border-top-color: transparent;
  animation: spin 1s linear infinite, pulse 2s ease-in-out infinite alternate;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  from { opacity: 1; }
  to { opacity: 0.5; }
}

/* Responsive enhancements */
@media (max-width: 640px) {
  .card-float:hover {
    transform: none;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
  
  .animate-float-slow,
  .animate-float-delayed {
    animation-duration: 12s;
  }
}

/* Custom scrollbar for any scrollable content */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #3B82F6, #8B5CF6);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #2563EB, #7C3AED);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .bg-white\/95 {
    background-color: rgba(17, 24, 39, 0.95);
  }
  
  .text-gray-900 {
    color: rgba(243, 244, 246, 1);
  }
  
  .text-gray-600 {
    color: rgba(156, 163, 175, 1);
  }
  
  .border-gray-200 {
    border-color: rgba(75, 85, 99, 1);
  }
}
</style>
