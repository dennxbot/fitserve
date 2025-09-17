<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 shadow-2xl">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-4 mb-2">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white sm:text-4xl">Progress Tracking</h1>
                <p class="mt-1 text-lg text-blue-200 font-medium">Monitor your weight and fitness journey</p>
              </div>
            </div>
            
            <!-- Progress Summary -->
            <div v-if="backendProgress" class="mt-4 flex items-center space-x-6">
              <div class="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                <svg class="w-5 h-5 text-emerald-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span class="text-white font-semibold">{{ backendProgress.progressPercentage }}% to goal</span>
              </div>
              <div class="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                <svg class="w-5 h-5 text-yellow-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span class="text-white font-semibold">{{ Math.abs(backendProgress.weightTrend) }}kg {{ backendProgress.weightTrend < 0 ? 'lost' : backendProgress.weightTrend > 0 ? 'gained' : 'stable' }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 lg:mt-0 flex flex-wrap gap-3">
            <button
              @click="showAddWeight = true"
              class="inline-flex items-center px-6 py-3 bg-white text-purple-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Log Weight
            </button>
            <button
              @click="refreshData"
              class="inline-flex items-center px-4 py-3 border border-white border-opacity-30 rounded-2xl text-white bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
              :disabled="progressStore.loading"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="progressStore.loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span class="ml-4 text-gray-600">Loading your progress...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="progressStore.error" class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 font-semibold">{{ progressStore.error }}</p>
        </div>
      </div>

      <!-- Main Progress Content -->
      <div v-else-if="backendProgress" class="space-y-8">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Current Weight -->
          <div class="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-5v.01M12 2l-3 3h6l-3-3z" />
                  </svg>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-white">{{ backendProgress.currentWeight }}</div>
                  <div class="text-sm text-white/80">kg</div>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-white">Current Weight</h3>
              <div class="text-white/80 text-sm">
                Target: {{ targetWeight }}kg
              </div>
            </div>
          </div>

          <!-- Weight Change -->
          <div class="group relative rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden" :class="{
            'bg-gradient-to-br from-green-500 to-green-600': backendProgress.totalEntries > 1 && backendProgress.weightTrend < 0,
            'bg-gradient-to-br from-red-500 to-red-600': backendProgress.totalEntries > 1 && backendProgress.weightTrend > 0,
            'bg-gradient-to-br from-blue-500 to-blue-600': backendProgress.totalEntries === 1,
            'bg-gradient-to-br from-gray-500 to-gray-600': backendProgress.totalEntries === 0 || (backendProgress.totalEntries > 1 && backendProgress.weightTrend === 0)
          }">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="backendProgress.totalEntries > 1 && backendProgress.weightTrend < 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    <path v-else-if="backendProgress.totalEntries > 1 && backendProgress.weightTrend > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    <path v-else-if="backendProgress.totalEntries === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
                  </svg>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-white">
                    {{ backendProgress.totalEntries > 1 ? 
                      (backendProgress.weightTrend > 0 ? '+' : '') + backendProgress.weightTrend : 
                      backendProgress.totalEntries === 1 ? 'First' : 'N/A' }}
                  </div>
                  <div class="text-sm text-white/80">
                    {{ backendProgress.totalEntries > 1 ? 'kg' : 
                       backendProgress.totalEntries === 1 ? 'entry' : '' }}
                  </div>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-white">Weight Change</h3>
              <div class="text-white/80 text-sm">
                {{ backendProgress.totalEntries > 1 ? 
                  (backendProgress.weightTrend < 0 ? 'Lost' : backendProgress.weightTrend > 0 ? 'Gained' : 'No change') :
                  backendProgress.totalEntries === 1 ? 'Start tracking' : 'No entries' }}
              </div>
            </div>
          </div>

          <!-- BMI -->
          <div class="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-white">{{ calculatedBMI || 'N/A' }}</div>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-white">BMI</h3>
              <div class="text-white/80 text-sm">
                {{ bmiCategory }}
              </div>
            </div>
          </div>

          <!-- Goal Progress -->
          <div class="group relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-white">{{ backendProgress.progressPercentage }}%</div>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-white">Goal Progress</h3>
              <div class="w-full bg-white/20 rounded-full h-3 mt-2 overflow-hidden">
                <div 
                  class="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-inner"
                  :style="{ width: `${Math.min(backendProgress.progressPercentage, 100)}%` }"
                ></div>
              </div>
              <div class="text-white/80 text-sm mt-2">
                {{ remainingWeight.toFixed(1) }}kg {{ backendProgress?.goalType === 'maintain_weight' ? 'to maintain' : 'remaining' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics and Recent Entries Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Weight Progress Visualization -->
          <div class="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-white">Weight Progress</h3>
                </div>
                <div class="text-white/80 text-sm">
                  {{ backendProgress.totalEntries }} entries over {{ backendProgress.daysTracked }} days
                </div>
              </div>
            </div>
            <div class="p-6">
              <div v-if="backendProgress.weightEntries.length === 0" class="text-center py-12 text-gray-500">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p class="text-lg font-medium">No weight entries yet</p>
                <p class="mt-2">Start tracking by logging your first weight</p>
              </div>
              
              <!-- Simple Weight History -->
              <div v-else class="space-y-4">
                <div class="flex items-center justify-between text-sm text-gray-500 border-b border-gray-200 pb-2">
                  <span>Date</span>
                  <span>Weight</span>
                  <span>Change</span>
                </div>
                <div 
                  v-for="(entry, index) in sortedWeightEntries" 
                  :key="entry.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div class="text-sm text-gray-600">
                    {{ formatDate(entry.recorded_at) }}
                  </div>
                  <div class="font-semibold text-gray-900">
                    {{ entry.weight }}kg
                  </div>
                  <div class="text-sm" :class="{
                    'text-green-600': getWeightChange(entry, index) !== null && getWeightChange(entry, index)! < 0,
                    'text-red-600': getWeightChange(entry, index) !== null && getWeightChange(entry, index)! > 0,
                    'text-gray-500': getWeightChange(entry, index) !== null && getWeightChange(entry, index) === 0
                  }">
                    <span v-if="getWeightChange(entry, index) !== null">
                      {{ getWeightChange(entry, index)! > 0 ? '+' : '' }}{{ getWeightChange(entry, index) }}kg
                    </span>
                    <span v-else class="text-gray-400">—</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics Panel -->
          <div class="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-white">Statistics</h3>
              </div>
            </div>
            <div class="p-6 space-y-6">
              
              <!-- Weekly Average -->
              <div class="text-center p-4 bg-blue-50 rounded-2xl">
                <div class="text-3xl font-bold text-blue-600 mb-1">
                  {{ backendProgress.weeklyAverage || 'N/A' }}
                </div>
                <div class="text-sm font-medium text-blue-800">Weekly Average</div>
                <div class="text-xs text-blue-600 mt-1">kg</div>
              </div>

              <!-- Monthly Average -->
              <div class="text-center p-4 bg-green-50 rounded-2xl">
                <div class="text-3xl font-bold text-green-600 mb-1">
                  {{ backendProgress.monthlyAverage || 'N/A' }}
                </div>
                <div class="text-sm font-medium text-green-800">Monthly Average</div>
                <div class="text-xs text-green-600 mt-1">kg</div>
              </div>

              <!-- Total Entries -->
              <div class="text-center p-4 bg-purple-50 rounded-2xl">
                <div class="text-3xl font-bold text-purple-600 mb-1">
                  {{ backendProgress.totalEntries }}
                </div>
                <div class="text-sm font-medium text-purple-800">Total Entries</div>
                <div class="text-xs text-purple-600 mt-1">logged</div>
              </div>

              <!-- Goal Info -->
              <div class="border-t border-gray-200 pt-4">
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Start:</span>
                    <span class="font-medium">{{ getStartWeight() }}kg</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Current:</span>
                    <span class="font-medium">{{ backendProgress.currentWeight }}kg</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Target:</span>
                    <span class="font-medium">{{ targetWeight }}kg</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">{{ backendProgress?.goalType === 'maintain_weight' ? 'To maintain:' : 'Remaining:' }}</span>
                    <span class="font-medium text-blue-600">{{ remainingWeight.toFixed(1) }}kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-24">
        <div class="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Start Your Progress Journey</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Track your weight and monitor your fitness progress over time. Log your first weight entry to get started.
        </p>
        <button
          @click="showAddWeight = true"
          class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Log Your First Weight
        </button>
      </div>
    </div>

    <!-- Add Weight Modal -->
    <div v-if="showAddWeight || editingEntry" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ editingEntry ? 'Edit Weight Entry' : 'Log Weight Entry' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
            <input
              v-model.number="weightForm.weight"
              type="number"
              step="0.1"
              min="1"
              max="500"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="70.5"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              v-model="weightForm.date"
              type="date"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              :max="today"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              v-model="weightForm.notes"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              placeholder="How are you feeling? Any observations?"
            ></textarea>
          </div>
          
          <div v-if="progressStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <p class="text-sm text-red-700">{{ progressStore.error }}</p>
          </div>
          
          <div class="flex space-x-3">
            <button type="button" @click="closeModal" class="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300" :disabled="progressStore.loading">
              <span v-if="progressStore.loading">
                {{ editingEntry ? 'Updating...' : 'Adding...' }}
              </span>
              <span v-else>
                {{ editingEntry ? 'Update Entry' : 'Add Entry' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useAuthStore } from '@/stores/auth'

const progressStore = useProgressStore()
const authStore = useAuthStore()

// Local state
const showAddWeight = ref(false)
const editingEntry = ref<any>(null)
const backendProgress = ref<any>(null)

const weightForm = ref({
  weight: 0,
  date: new Date().toISOString().split('T')[0],
  notes: ''
})

const today = new Date().toISOString().split('T')[0]

// Computed properties that directly use backend data
const calculatedBMI = computed(() => {
  const user = authStore.currentUser
  if (!user?.height || !backendProgress.value?.currentWeight) return null
  
  const heightInM = user.height / 100
  const bmi = backendProgress.value.currentWeight / (heightInM * heightInM)
  return Math.round(bmi * 10) / 10
})

const bmiCategory = computed(() => {
  if (!calculatedBMI.value) return ''
  
  const bmi = calculatedBMI.value
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
})

const sortedWeightEntries = computed(() => {
  if (!backendProgress.value?.weightEntries) return []
  
  return [...backendProgress.value.weightEntries].sort((a, b) => 
    new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
  )
})

// Computed properties for safe calculations
const targetWeight = computed(() => {
  // For maintain_weight goal, target should be current weight
  if (backendProgress.value?.goalType === 'maintain_weight') {
    return backendProgress.value.currentWeight || 0;
  }
  return backendProgress.value?.targetWeight || 0;
});

const remainingWeight = computed(() => {
  if (!backendProgress.value?.currentWeight || !targetWeight.value) {
    return 0;
  }
  return Math.abs(targetWeight.value - backendProgress.value.currentWeight);
});

// Helper functions
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

const getWeightChange = (_entry: any, index: number): number | null => {
  if (!backendProgress.value?.weightEntries || index >= sortedWeightEntries.value.length - 1) {
    return null
  }
  
  const currentEntry = sortedWeightEntries.value[index]
  const previousEntry = sortedWeightEntries.value[index + 1]
  
  if (!currentEntry || !previousEntry) return null
  
  return Math.round((currentEntry.weight - previousEntry.weight) * 10) / 10
}

const getStartWeight = () => {
  if (!backendProgress.value?.weightEntries || backendProgress.value.weightEntries.length === 0) {
    return backendProgress.value?.currentWeight || 0
  }
  
  const sorted = [...backendProgress.value.weightEntries].sort((a, b) => 
    new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  )
  
  return sorted[0]?.weight || backendProgress.value.currentWeight
}

// Actions
const refreshData = async () => {
  try {
    progressStore.clearError()
    
    // Fetch fresh data from backend progress endpoint
    const result = await progressStore.getProgressStats()
    
    if (result.success) {
      backendProgress.value = result.data
      console.log('🔄 Progress data refreshed:', backendProgress.value)
    } else {
      console.error('Failed to fetch progress data:', result.message)
    }
  } catch (error) {
    console.error('Error refreshing progress data:', error)
  }
}

const addWeightEntry = async () => {
  try {
    const result = await progressStore.addWeightEntry({
      weight: weightForm.value.weight,
      date: weightForm.value.date,
      notes: weightForm.value.notes.trim() || undefined
    })
    
    if (result.success) {
      closeModal()
      await refreshData()
    }
  } catch (error) {
    console.error('Failed to add weight entry:', error)
  }
}


const closeModal = () => {
  showAddWeight.value = false
  editingEntry.value = null
  weightForm.value = {
    weight: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  }
  progressStore.clearError()
}

const submitForm = async () => {
  if (editingEntry.value) {
    try {
      const result = await progressStore.updateWeightEntry(editingEntry.value.id, {
        weight: weightForm.value.weight,
        date: weightForm.value.date,
        notes: weightForm.value.notes.trim() || undefined
      })
      
      if (result.success) {
        closeModal()
        await refreshData()
      }
    } catch (error) {
      console.error('Failed to update weight entry:', error)
    }
  } else {
    await addWeightEntry()
  }
}

// Initialize
onMounted(async () => {
  console.log('🚀 Progress page mounted - initializing...')
  
  // Ensure authentication
  if (!authStore.isAuthenticated) {
    console.log('⚠️ Not authenticated - attempting to initialize auth...')
    await authStore.initializeAuth()
  }
  
  // Load progress data
  await refreshData()
})
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105;
}
</style>
