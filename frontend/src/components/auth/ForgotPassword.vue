<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
          <svg class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <form v-if="!emailSent" class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Enter your email address"
            :disabled="isLoading"
          />
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !email"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="!isLoading" class="h-5 w-5 text-primary-500 group-hover:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <svg v-else class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Sending...' : 'Send reset link' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Back to sign in
          </router-link>
        </div>
      </form>

      <!-- Success message -->
      <div v-else class="mt-8 space-y-6">
        <div class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Reset link sent!
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>
                  We've sent a password reset link to <strong>{{ email }}</strong>.
                  Please check your email and follow the instructions to reset your password.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center space-y-2">
          <p class="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or
          </p>
          <button
            @click="resendEmail"
            :disabled="resendCooldown > 0"
            class="font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Back to sign in
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Form data
const email = ref('')
const emailSent = ref(false)
const resendCooldown = ref(0)
let resendTimer: NodeJS.Timeout | null = null

// Computed properties
const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

// Methods
const handleForgotPassword = async () => {
  if (!email.value) return
  
  authStore.clearError()
  
  const result = await authStore.forgotPassword(email.value)
  
  if (result.success) {
    emailSent.value = true
    startResendCooldown()
  }
}

const resendEmail = async () => {
  if (resendCooldown.value > 0) return
  
  authStore.clearError()
  
  const result = await authStore.forgotPassword(email.value)
  
  if (result.success) {
    startResendCooldown()
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60 // 60 seconds cooldown
  
  resendTimer = setInterval(() => {
    resendCooldown.value--
    
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer!)
      resendTimer = null
    }
  }, 1000)
}

// Cleanup
onUnmounted(() => {
  authStore.clearError()
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})
</script>