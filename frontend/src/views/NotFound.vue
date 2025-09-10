<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <!-- 404 Illustration -->
        <div class="mx-auto w-32 h-32 mb-8">
          <svg class="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        
        <!-- Error Message -->
        <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <!-- Action Buttons -->
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            @click="goBack"
            class="btn btn-ghost w-full sm:w-auto"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
          
          <router-link
            to="/dashboard"
            class="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Dashboard
          </router-link>
        </div>
        
        <!-- Helpful Links -->
        <div class="mt-12">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Popular Pages</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <router-link
              to="/food"
              class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
            >
              <div class="p-2 bg-blue-100 rounded-lg mr-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div class="text-left">
                <div class="font-medium text-gray-900">Food Log</div>
                <div class="text-sm text-gray-600">Track your meals</div>
              </div>
            </router-link>
            
            <router-link
              to="/progress"
              class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-green-300"
            >
              <div class="p-2 bg-green-100 rounded-lg mr-3">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="text-left">
                <div class="font-medium text-gray-900">Progress</div>
                <div class="text-sm text-gray-600">View your stats</div>
              </div>
            </router-link>
            
            <router-link
              to="/goals"
              class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-purple-300"
            >
              <div class="p-2 bg-purple-100 rounded-lg mr-3">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div class="text-left">
                <div class="font-medium text-gray-900">Goals</div>
                <div class="text-sm text-gray-600">Set your targets</div>
              </div>
            </router-link>
            
            <router-link
              to="/reports"
              class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-yellow-300"
            >
              <div class="p-2 bg-yellow-100 rounded-lg mr-3">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="text-left">
                <div class="font-medium text-gray-900">Reports</div>
                <div class="text-sm text-gray-600">Analyze trends</div>
              </div>
            </router-link>
          </div>
        </div>
        
        <!-- Contact Support -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            Still can't find what you're looking for?
            <a href="mailto:support@fitserve.com" class="text-blue-600 hover:text-blue-500 font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}
</script>