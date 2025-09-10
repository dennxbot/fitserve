<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Enhanced Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-4">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics Dashboard
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-3">
          Nutrition Reports
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your progress, analyze trends, and gain insights into your nutrition journey
        </p>
      </div>

      <!-- Enhanced Control Panel -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 backdrop-blur-sm bg-white/90">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- Time Period Selector -->
          <div class="flex-1">
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Time Period
            </label>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <button
                v-for="period in [{ value: '7', label: '7 Days' }, { value: '14', label: '2 Weeks' }, { value: '30', label: '1 Month' }, { value: '90', label: '3 Months' }]"
                :key="period.value"
                @click="selectedPeriod = period.value; loadReportData()"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2',
                  selectedPeriod === period.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>

          <!-- Report Type Selector -->
          <div class="flex-1">
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Report Type
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="type in [{ value: 'summary', label: 'Summary', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }, { value: 'detailed', label: 'Detailed', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }, { value: 'entries', label: 'Entries', icon: 'M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3' }]"
                :key="type.value"
                @click="reportType = type.value; loadReportData()"
                :class="[
                  'flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2',
                  reportType === type.value
                    ? 'bg-green-600 text-white border-green-600 shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50'
                ]"
              >
                <svg class="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="type.icon" />
                </svg>
                {{ type.label }}
              </button>
            </div>
          </div>
          
          <!-- Refresh Button -->
          <div class="flex-shrink-0">
            <button
              @click="loadReportData"
              :disabled="isLoading"
              class="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div class="flex items-center">
                <svg 
                  :class="['w-5 h-5 mr-2 transition-transform duration-500', isLoading ? 'animate-spin' : 'group-hover:rotate-180']" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ isLoading ? 'Loading...' : 'Refresh Data' }}
              </div>
              <div class="absolute inset-0 -z-10 bg-gradient-to-r from-purple-700 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="relative">
          <!-- Animated loading rings -->
          <div class="inline-flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <div class="absolute animate-ping rounded-full h-8 w-8 bg-blue-400 opacity-20"></div>
          </div>
          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Loading Your Reports</h3>
            <p class="text-gray-600 animate-pulse">Analyzing your nutrition data...</p>
            <!-- Progress dots -->
            <div class="flex justify-center space-x-1 mt-4">
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Error State -->
      <div v-else-if="error" class="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 mb-8 shadow-lg">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-semibold text-red-800 mb-1">Unable to Load Reports</h3>
            <p class="text-red-700 mb-4">{{ error }}</p>
            <button 
              @click="loadReportData" 
              class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Reports Content -->
      <div v-else class="space-y-8">
        <!-- Enhanced Summary Cards -->
        <div v-if="reportType === 'summary'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <!-- Calories Card -->
          <div class="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-100 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200 to-red-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="flex items-start justify-between mb-4">
                <div class="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium text-orange-600 uppercase tracking-wider">Daily Average</p>
                </div>
              </div>
              <div class="mb-2">
                <p class="text-sm font-semibold text-gray-600 mb-1">Calories</p>
                <p class="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">{{ averageCalories }}</p>
                <p class="text-xs text-gray-500">kcal/day</p>
              </div>
              <div class="w-full bg-orange-200 rounded-full h-1.5 mt-4">
                <div class="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all duration-1000" :style="{ width: '75%' }"></div>
              </div>
            </div>
          </div>

          <!-- Protein Card -->
          <div class="group relative overflow-hidden bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-100 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-200 to-pink-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="flex items-start justify-between mb-4">
                <div class="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium text-red-600 uppercase tracking-wider">Daily Average</p>
                </div>
              </div>
              <div class="mb-2">
                <p class="text-sm font-semibold text-gray-600 mb-1">Protein</p>
                <p class="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">{{ averageProtein }}</p>
                <p class="text-xs text-gray-500">grams/day</p>
              </div>
              <div class="w-full bg-red-200 rounded-full h-1.5 mt-4">
                <div class="bg-gradient-to-r from-red-500 to-pink-500 h-1.5 rounded-full transition-all duration-1000" :style="{ width: '60%' }"></div>
              </div>
            </div>
          </div>

          <!-- Total Entries Card -->
          <div class="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="flex items-start justify-between mb-4">
                <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3" />
                  </svg>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium text-green-600 uppercase tracking-wider">Total Count</p>
                </div>
              </div>
              <div class="mb-2">
                <p class="text-sm font-semibold text-gray-600 mb-1">Food Entries</p>
                <p class="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">{{ totalEntries }}</p>
                <p class="text-xs text-gray-500">logged items</p>
              </div>
              <div class="w-full bg-green-200 rounded-full h-1.5 mt-4">
                <div class="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-1000" :style="{ width: '85%' }"></div>
              </div>
            </div>
          </div>

          <!-- Active Days Card -->
          <div class="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="flex items-start justify-between mb-4">
                <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium text-blue-600 uppercase tracking-wider">Activity Rate</p>
                </div>
              </div>
              <div class="mb-2">
                <p class="text-sm font-semibold text-gray-600 mb-1">Active Days</p>
                <div class="flex items-baseline space-x-1">
                  <p class="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{{ activeDays }}</p>
                  <p class="text-lg text-gray-500">/{{ selectedPeriod }}</p>
                </div>
                <p class="text-xs text-gray-500">days logged</p>
              </div>
              <div class="w-full bg-blue-200 rounded-full h-1.5 mt-4">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-1000" :style="{ width: `${Math.min(100, (activeDays / parseInt(selectedPeriod)) * 100)}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Weekly Nutrition Summary -->
        <div v-if="reportType === 'summary' && weeklyData" class="bg-white rounded-2xl border-2 border-gray-100 shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white mb-2">Nutrition Overview</h2>
                <p class="text-blue-100 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDateRange(startDate, endDate) }}
                </p>
              </div>
              <div class="text-right">
                <div class="bg-white/20 rounded-lg px-3 py-1 backdrop-blur-sm">
                  <p class="text-white text-sm font-medium">{{ weeklyData.entriesCount }} Total Entries</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-8">
          
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <!-- Enhanced Total Nutrition -->
              <div class="space-y-6">
                <div class="flex items-center mb-6">
                  <div class="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900">Total Intake</h3>
                </div>
                
                <div class="space-y-4">
                  <!-- Calories -->
                  <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                    <div class="flex justify-between items-center mb-2">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-2"></div>
                        <span class="text-gray-700 font-medium">Calories</span>
                      </div>
                      <span class="font-bold text-orange-600">{{ weeklyData.totalNutrition.calories }} kcal</span>
                    </div>
                    <div class="w-full bg-orange-200 rounded-full h-2">
                      <div class="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000" style="width: 90%"></div>
                    </div>
                  </div>
                  
                  <!-- Macronutrients -->
                  <div class="grid grid-cols-1 gap-3">
                    <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 border border-red-100">
                      <div class="flex justify-between items-center">
                        <div class="flex items-center">
                          <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <span class="text-gray-700 text-sm font-medium">Protein</span>
                        </div>
                        <span class="font-semibold text-red-600">{{ weeklyData.totalNutrition.protein }}g</span>
                      </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-100">
                      <div class="flex justify-between items-center">
                        <div class="flex items-center">
                          <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          <span class="text-gray-700 text-sm font-medium">Carbohydrates</span>
                        </div>
                        <span class="font-semibold text-yellow-600">{{ weeklyData.totalNutrition.carbs }}g</span>
                      </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100">
                      <div class="flex justify-between items-center">
                        <div class="flex items-center">
                          <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span class="text-gray-700 text-sm font-medium">Fat</span>
                        </div>
                        <span class="font-semibold text-purple-600">{{ weeklyData.totalNutrition.fat }}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Enhanced Meal Distribution -->
              <div class="space-y-6">
                <div class="flex items-center mb-6">
                  <div class="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900">Meal Distribution</h3>
                </div>
                
                <div class="space-y-5">
                  <div v-for="(meal, mealType, index) in weeklyData.mealBreakdown" :key="mealType" 
                       class="group relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <!-- Meal type colors -->
                    <div :class="[
                      'absolute top-0 left-0 w-1 h-full rounded-l-xl',
                      mealType === 'breakfast' ? 'bg-gradient-to-b from-yellow-400 to-orange-400' :
                      mealType === 'lunch' ? 'bg-gradient-to-b from-green-400 to-emerald-400' :
                      mealType === 'dinner' ? 'bg-gradient-to-b from-blue-400 to-indigo-400' :
                      'bg-gradient-to-b from-purple-400 to-pink-400'
                    ]"></div>
                    
                    <div class="ml-3">
                      <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center">
                          <div :class="[
                            'w-3 h-3 rounded-full mr-3',
                            mealType === 'breakfast' ? 'bg-yellow-500' :
                            mealType === 'lunch' ? 'bg-green-500' :
                            mealType === 'dinner' ? 'bg-blue-500' :
                            'bg-purple-500'
                          ]"></div>
                          <span class="text-gray-800 font-semibold capitalize">{{ mealType }}</span>
                        </div>
                        <div class="text-right">
                          <span class="font-bold text-lg" :class="[
                            mealType === 'breakfast' ? 'text-yellow-600' :
                            mealType === 'lunch' ? 'text-green-600' :
                            mealType === 'dinner' ? 'text-blue-600' :
                            'text-purple-600'
                          ]">{{ meal.calories }}</span>
                          <span class="text-gray-500 text-sm ml-1">kcal</span>
                        </div>
                      </div>
                      
                      <!-- Progress bar -->
                      <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          :class="[
                            'h-2 rounded-full transition-all duration-1000',
                            mealType === 'breakfast' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                            mealType === 'lunch' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                            mealType === 'dinner' ? 'bg-gradient-to-r from-blue-400 to-indigo-400' :
                            'bg-gradient-to-r from-purple-400 to-pink-400'
                          ]"
                          :style="{ width: `${Math.min(100, (meal.calories / weeklyData.totalNutrition.calories) * 100)}%` }"
                        ></div>
                      </div>
                      
                      <!-- Macros breakdown -->
                      <div class="flex justify-between text-xs text-gray-600">
                        <span>P: {{ meal.protein }}g</span>
                        <span>C: {{ meal.carbs }}g</span>
                        <span>F: {{ meal.fat }}g</span>
                        <span class="font-medium">{{ Math.round((meal.calories / weeklyData.totalNutrition.calories) * 100) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Breakdown -->
        <div v-if="reportType === 'detailed' && weeklyData && Object.keys(weeklyData.dailyBreakdown).length > 0" 
             class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="border-b border-gray-200 pb-4 mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Daily Breakdown</h2>
            <p class="text-gray-600">Detailed nutrition by day</p>
          </div>
          
          <div class="space-y-4">
            <div v-for="(dayData, date) in weeklyData.dailyBreakdown" :key="date" 
                 class="border border-gray-100 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-medium text-gray-900">{{ formatDate(date) }}</h3>
                <span class="text-sm text-gray-500">{{ dayData.calories }} kcal</span>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <span class="text-gray-600 block">Calories</span>
                  <span class="font-medium">{{ dayData.calories }}</span>
                </div>
                <div>
                  <span class="text-gray-600 block">Protein</span>
                  <span class="font-medium">{{ dayData.protein }}g</span>
                </div>
                <div>
                  <span class="text-gray-600 block">Carbs</span>
                  <span class="font-medium">{{ dayData.carbs }}g</span>
                </div>
                <div>
                  <span class="text-gray-600 block">Fat</span>
                  <span class="font-medium">{{ dayData.fat }}g</span>
                </div>
                <div>
                  <span class="text-gray-600 block">Fiber</span>
                  <span class="font-medium">{{ dayData.fiber }}g</span>
                </div>
                <div>
                  <span class="text-gray-600 block">Sodium</span>
                  <span class="font-medium">{{ dayData.sodium }}mg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Food Entries List -->
        <div v-if="reportType === 'entries' && foodEntries.length > 0" 
             class="bg-white rounded-2xl border-2 border-gray-100 shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white mb-2">Food Entries</h2>
                <p class="text-green-100 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3" />
                  </svg>
                  {{ foodEntries.length }} entries for {{ formatDateRange(startDate, endDate) }}
                </p>
              </div>
              <div class="text-right">
                <div class="bg-white/20 rounded-lg px-3 py-1 backdrop-blur-sm">
                  <p class="text-white text-sm font-medium">{{ Math.round(foodEntries.reduce((sum, entry) => sum + ((entry.food.calories * entry.quantity) / entry.food.serving_size), 0)) }} Total kcal</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-8">
            <div class="space-y-4">
              <div v-for="(entry, index) in foodEntries" :key="entry.id" 
                   class="group relative overflow-hidden bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300">
                <!-- Meal type indicator -->
                <div :class="[
                  'absolute top-0 left-0 w-2 h-full rounded-l-xl',
                  entry.mealType === 'breakfast' ? 'bg-gradient-to-b from-yellow-400 to-orange-400' :
                  entry.mealType === 'lunch' ? 'bg-gradient-to-b from-green-400 to-emerald-400' :
                  entry.mealType === 'dinner' ? 'bg-gradient-to-b from-blue-400 to-indigo-400' :
                  'bg-gradient-to-b from-purple-400 to-pink-400'
                ]"></div>
                
                <div class="ml-4">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                      <div class="flex items-start gap-3">
                        <!-- Food icon -->
                        <div :class="[
                          'p-2 rounded-lg mt-1',
                          entry.mealType === 'breakfast' ? 'bg-yellow-100' :
                          entry.mealType === 'lunch' ? 'bg-green-100' :
                          entry.mealType === 'dinner' ? 'bg-blue-100' :
                          'bg-purple-100'
                        ]">
                          <svg :class="[
                            'w-4 h-4',
                            entry.mealType === 'breakfast' ? 'text-yellow-600' :
                            entry.mealType === 'lunch' ? 'text-green-600' :
                            entry.mealType === 'dinner' ? 'text-blue-600' :
                            'text-purple-600'
                          ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div class="flex-1">
                          <h3 class="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors duration-300">{{ entry.food.name }}</h3>
                          <p class="text-gray-600 mb-2">{{ entry.food.brand || 'Generic Food Item' }}</p>
                          
                          <!-- Entry details -->
                          <div class="flex flex-wrap gap-3 text-sm">
                            <span class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-lg">
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                              </svg>
                              {{ entry.quantity }}{{ entry.unit }}
                            </span>
                            <span :class="[
                              'inline-flex items-center px-2 py-1 rounded-lg font-medium',
                              entry.mealType === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
                              entry.mealType === 'lunch' ? 'bg-green-100 text-green-800' :
                              entry.mealType === 'dinner' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            ]">
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {{ entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1) }}
                            </span>
                            <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {{ formatDateTime(entry.consumedAt) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Nutrition summary -->
                    <div class="text-right ml-4">
                      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                        <div class="text-2xl font-bold text-green-700 mb-1">
                          {{ Math.round((entry.food.calories * entry.quantity) / entry.food.serving_size) }}
                        </div>
                        <div class="text-xs text-green-600 font-medium mb-3">calories</div>
                        
                        <!-- Macro breakdown -->
                        <div class="grid grid-cols-3 gap-2 text-xs">
                          <div class="text-center p-1 bg-red-100 rounded">
                            <div class="font-bold text-red-700">{{ Math.round((entry.food.protein * entry.quantity) / entry.food.serving_size) }}</div>
                            <div class="text-red-600">P</div>
                          </div>
                          <div class="text-center p-1 bg-yellow-100 rounded">
                            <div class="font-bold text-yellow-700">{{ Math.round((entry.food.carbs * entry.quantity) / entry.food.serving_size) }}</div>
                            <div class="text-yellow-600">C</div>
                          </div>
                          <div class="text-center p-1 bg-purple-100 rounded">
                            <div class="font-bold text-purple-700">{{ Math.round((entry.food.fat * entry.quantity) / entry.food.serving_size) }}</div>
                            <div class="text-purple-600">F</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Empty State -->
        <div v-if="!hasData" class="text-center py-20">
          <div class="max-w-md mx-auto">
            <!-- Animated empty state illustration -->
            <div class="relative mb-8">
              <div class="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <!-- Floating dots animation -->
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
              </div>
              <div class="absolute top-4 right-8">
                <div class="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
              </div>
              <div class="absolute bottom-4 left-8">
                <div class="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.6s"></div>
              </div>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-gray-900">No Data to Display</h3>
              <p class="text-gray-600 leading-relaxed">
                It looks like you haven't logged any meals during this time period. Start tracking your nutrition to see detailed insights and trends.
              </p>
              
              <!-- Action buttons -->
              <div class="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                <router-link 
                  to="/food" 
                  class="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Start Logging Food
                  </div>
                  <div class="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </router-link>
                
                <button 
                  @click="loadReportData" 
                  class="group bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 border border-gray-200"
                >
                  <div class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Analytics - Simplified for now -->
        <div v-if="weeklyData && reportType === 'summary'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Meal Breakdown -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Meal Breakdown</h2>
              <p class="card-description">Nutrition distribution by meal type</p>
            </div>
            <div class="card-content">
              <div class="space-y-4">
                <div v-for="(mealData, mealType) in weeklyData.mealBreakdown" :key="mealType" 
                     class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div class="font-medium capitalize">{{ mealType }}</div>
                    <div class="text-sm text-gray-600">{{ mealData.calories }} kcal</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-500 space-x-2">
                      <span>P: {{ mealData.protein }}g</span>
                      <span>C: {{ mealData.carbs }}g</span>
                      <span>F: {{ mealData.fat }}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Period Summary -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Period Summary</h2>
              <p class="card-description">Key insights from your data</p>
            </div>
            <div class="card-content">
              <div class="space-y-4">
                <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div class="p-2 bg-blue-100 rounded-full mr-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium">Total Entries</div>
                    <div class="text-sm text-gray-600">
                      {{ totalEntries }} food entries logged
                    </div>
                  </div>
                </div>

                <div class="flex items-center p-3 bg-green-50 rounded-lg">
                  <div class="p-2 bg-green-100 rounded-full mr-3">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium">Active Days</div>
                    <div class="text-sm text-gray-600">
                      {{ activeDays }} days with logged meals
                    </div>
                  </div>
                </div>

                <div class="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div class="p-2 bg-purple-100 rounded-full mr-3">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium">Date Range</div>
                    <div class="text-sm text-gray-600">
                      {{ weeklyData ? formatDateRange(weeklyData.startDate, weeklyData.endDate) : 'No data' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations and styles */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.float-animation {
  animation: float 6s ease-in-out infinite;
}

.pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200px 100%;
  animation: shimmer 2s infinite;
}

/* Enhanced card hover effects */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Gradient text animation */
.gradient-text {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Progress bar animations */
.progress-animate {
  animation: progress-fill 2s ease-out;
}

@keyframes progress-fill {
  from { width: 0%; }
  to { width: var(--progress-width); }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #2563eb, #7c3aed);
}

/* Loading skeleton */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Glass morphism effect */
.glass {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Responsive enhancements */
@media (max-width: 768px) {
  .card-hover:hover {
    transform: none;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { nutritionApi, foodApi } from '@/services/api'
import type { FoodEntry, WeeklyNutritionSummary } from '@/types'

// Reactive data
const selectedPeriod = ref('30')
const reportType = ref('summary')
const isLoading = ref(false)
const error = ref<string | null>(null)
const weeklyData = ref<WeeklyNutritionSummary | null>(null)
const foodEntries = ref<FoodEntry[]>([])
const startDate = ref('')
const endDate = ref('')

// Computed values for summary cards
const averageCalories = computed(() => {
  if (!weeklyData.value || weeklyData.value.entriesCount === 0) return 0
  const days = Object.keys(weeklyData.value.dailyBreakdown || {}).length
  return days > 0 ? Math.round(weeklyData.value.totalNutrition.calories / days) : 0
})

const averageProtein = computed(() => {
  if (!weeklyData.value || weeklyData.value.entriesCount === 0) return 0
  const days = Object.keys(weeklyData.value.dailyBreakdown || {}).length
  return days > 0 ? Math.round(weeklyData.value.totalNutrition.protein / days) : 0
})

const totalEntries = computed(() => {
  return weeklyData.value?.entriesCount || 0
})

const activeDays = computed(() => {
  return weeklyData.value ? Object.keys(weeklyData.value.dailyBreakdown || {}).length : 0
})

const hasData = computed(() => {
  return weeklyData.value && (weeklyData.value.entriesCount > 0 || foodEntries.value.length > 0)
})

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const formatDateRange = (start: string, end: string) => {
  const startFormatted = new Date(start).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  const endFormatted = new Date(end).toLocaleDateString('en-US', {
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
  return `${startFormatted} - ${endFormatted}`
}

// Data loading functions
const loadWeeklyData = async () => {
  try {
    const response = await nutritionApi.getWeeklySummary(startDate.value, endDate.value)
    if (response.success) {
      weeklyData.value = response.data
    } else {
      throw new Error(response.message || 'Failed to load weekly data')
    }
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to load weekly data')
  }
}

const loadFoodEntries = async () => {
  try {
    const response = await foodApi.getFoodEntries() 
    if (response.success) {
      // Filter entries by date range
      const start = new Date(startDate.value)
      const end = new Date(endDate.value)
      end.setHours(23, 59, 59, 999) // Include the entire end date
      
      foodEntries.value = response.data.filter((entry: FoodEntry) => {
        const entryDate = new Date(entry.consumedAt)
        return entryDate >= start && entryDate <= end
      })
    } else {
      throw new Error(response.message || 'Failed to load food entries')
    }
  } catch (err: any) {
    console.warn('Failed to load food entries:', err.message)
    foodEntries.value = [] // Don't throw error for food entries
  }
}

const loadReportData = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    error.value = null
    
    // Calculate date range based on selected period
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - parseInt(selectedPeriod.value))
    
    startDate.value = start.toISOString().split('T')[0]
    endDate.value = end.toISOString().split('T')[0]
    
    // Load different data based on report type
    if (reportType.value === 'entries') {
      await loadFoodEntries()
    } else {
      await loadWeeklyData()
      if (reportType.value === 'entries') {
        await loadFoodEntries() // Load both for entries view
      }
    }
    
  } catch (err: any) {
    console.error('Failed to load report data:', err)
    error.value = err.message || 'Failed to load report data'
    weeklyData.value = null
    foodEntries.value = []
  } finally {
    isLoading.value = false
  }
}

// Change handlers for reactive updates
const onPeriodChange = async () => {
  await loadReportData()
}

const onReportTypeChange = async () => {
  await loadReportData()
}

// Initialize on mount
onMounted(async () => {
  await loadReportData()
})
</script>