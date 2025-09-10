<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Nutrition Goals</h1>
        <p class="mt-2 text-gray-600">Set and manage your daily nutrition targets</p>
      </div>

      <!-- Loading State -->
      <div v-if="nutritionStore.loading" class="text-center py-8">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-600">Loading your goals...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="nutritionStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-red-700">{{ nutritionStore.error }}</p>
              <p v-if="nutritionStore.error.includes('Profile incomplete')" class="text-red-600 text-sm mt-1">
                Complete your profile to generate personalized recommendations.
              </p>
            </div>
          </div>
          <router-link 
            v-if="nutritionStore.error.includes('Profile incomplete')" 
            to="/profile" 
            class="btn btn-sm btn-outline text-red-700 border-red-300 hover:bg-red-50"
          >
            Update Profile
          </router-link>
        </div>
      </div>

      <!-- Current Goals Overview -->
      <div v-else class="space-y-8">
        <!-- Quick Actions -->
        <div class="flex flex-wrap gap-4">
          <!-- Edit Goals -->
          <button
            @click="showEditGoals = true"
            class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Goals</span>
            </div>
            <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
          </button>
          
          <!-- Get Recommendations -->
          <button
            @click="generateRecommendedGoals"
            class="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            :disabled="nutritionStore.loading"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span v-if="nutritionStore.loading">Generating...</span>
              <span v-else>Get Recommendations</span>
            </div>
            <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
          </button>
          
          <!-- Refresh Data -->
          <button
            @click="refreshData"
            class="group relative px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            :disabled="nutritionStore.loading"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </div>
          </button>
          
          <!-- Quick Link to Food Log -->
          <router-link 
            to="/food" 
            class="group relative px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Log Food</span>
            </div>
            <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
          </router-link>
        </div>

        <!-- Current Goals Cards -->
        <div v-if="nutritionStore.goals" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Calories -->
          <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                </div>
                <div v-if="todaySummary" class="text-right">
                  <div class="text-2xl font-bold">{{ Math.round((todaySummary.totalCalories / nutritionStore.goals.dailyCalories) * 100) || 0 }}%</div>
                  <div class="text-xs opacity-90">Complete</div>
                </div>
              </div>
              
              <div class="mb-2">
                <h3 class="text-lg font-semibold mb-1">Daily Calories</h3>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold">{{ nutritionStore.goals.dailyCalories }}</span>
                  <span class="text-sm opacity-75">kcal goal</span>
                </div>
              </div>
              
              <!-- Circular Progress -->
              <div v-if="todaySummary" class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm opacity-90">{{ todaySummary.totalCalories }} consumed</span>
                  <span class="text-sm font-medium">{{ nutritionStore.remainingCalories }} left</span>
                </div>
                <div class="w-full bg-white bg-opacity-30 rounded-full h-3">
                  <div 
                    class="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${Math.min((todaySummary.totalCalories / nutritionStore.goals.dailyCalories) * 100 || 0, 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Protein -->
          <div class="relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
                <div v-if="todaySummary" class="text-right">
                  <div class="text-2xl font-bold">{{ Math.round((todaySummary.totalProtein / nutritionStore.goals.dailyProtein) * 100) || 0 }}%</div>
                  <div class="text-xs opacity-90">Complete</div>
                </div>
              </div>
              
              <div class="mb-2">
                <h3 class="text-lg font-semibold mb-1">Protein</h3>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold">{{ nutritionStore.goals.dailyProtein }}</span>
                  <span class="text-sm opacity-75">g goal</span>
                </div>
              </div>
              
              <div v-if="todaySummary" class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm opacity-90">{{ todaySummary.totalProtein }}g consumed</span>
                  <span class="text-sm font-medium">{{ Math.max(0, nutritionStore.goals.dailyProtein - todaySummary.totalProtein) }}g left</span>
                </div>
                <div class="w-full bg-white bg-opacity-30 rounded-full h-3">
                  <div 
                    class="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${Math.min((todaySummary.totalProtein / nutritionStore.goals.dailyProtein) * 100 || 0, 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Carbohydrates -->
          <div class="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div v-if="todaySummary" class="text-right">
                  <div class="text-2xl font-bold">{{ Math.round((todaySummary.totalCarbs / nutritionStore.goals.dailyCarbs) * 100) || 0 }}%</div>
                  <div class="text-xs opacity-90">Complete</div>
                </div>
              </div>
              
              <div class="mb-2">
                <h3 class="text-lg font-semibold mb-1">Carbohydrates</h3>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold">{{ nutritionStore.goals.dailyCarbs }}</span>
                  <span class="text-sm opacity-75">g goal</span>
                </div>
              </div>
              
              <div v-if="todaySummary" class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm opacity-90">{{ todaySummary.totalCarbs }}g consumed</span>
                  <span class="text-sm font-medium">{{ Math.max(0, nutritionStore.goals.dailyCarbs - todaySummary.totalCarbs) }}g left</span>
                </div>
                <div class="w-full bg-white bg-opacity-30 rounded-full h-3">
                  <div 
                    class="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${Math.min((todaySummary.totalCarbs / nutritionStore.goals.dailyCarbs) * 100 || 0, 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fat -->
          <div class="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div v-if="todaySummary" class="text-right">
                  <div class="text-2xl font-bold">{{ Math.round((todaySummary.totalFat / nutritionStore.goals.dailyFat) * 100) || 0 }}%</div>
                  <div class="text-xs opacity-90">Complete</div>
                </div>
              </div>
              
              <div class="mb-2">
                <h3 class="text-lg font-semibold mb-1">Healthy Fats</h3>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold">{{ nutritionStore.goals.dailyFat }}</span>
                  <span class="text-sm opacity-75">g goal</span>
                </div>
              </div>
              
              <div v-if="todaySummary" class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm opacity-90">{{ todaySummary.totalFat }}g consumed</span>
                  <span class="text-sm font-medium">{{ Math.max(0, nutritionStore.goals.dailyFat - todaySummary.totalFat) }}g left</span>
                </div>
                <div class="w-full bg-white bg-opacity-30 rounded-full h-3">
                  <div 
                    class="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${Math.min((todaySummary.totalFat / nutritionStore.goals.dailyFat) * 100 || 0, 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Motivational Banner -->
        <div v-if="todaySummary" class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold mb-2">🎯 Today's Progress</h3>
              <p class="text-lg opacity-90" v-if="nutritionStore.overallProgress >= 90">
                Amazing work! You're crushing your nutrition goals! 🔥
              </p>
              <p class="text-lg opacity-90" v-else-if="nutritionStore.overallProgress >= 70">
                Great progress! You're well on track to hit your targets! 💪
              </p>
              <p class="text-lg opacity-90" v-else-if="nutritionStore.overallProgress >= 50">
                Good start! Keep going to reach your daily goals! 📈
              </p>
              <p class="text-lg opacity-90" v-else>
                Every meal counts! Let's work towards your goals together! 🌱
              </p>
            </div>
            <div class="text-right">
              <div class="text-4xl font-bold">{{ nutritionStore.overallProgress || 0 }}%</div>
              <div class="text-sm opacity-90">Overall Progress</div>
            </div>
          </div>
          
          <!-- Progress Ring -->
          <div class="mt-4 flex justify-center">
            <div class="relative">
              <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path class="stroke-current text-white text-opacity-30" stroke-width="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path class="stroke-current text-white" stroke-width="3" fill="none" stroke-linecap="round" 
                      :stroke-dasharray="`${nutritionStore.overallProgress || 0} ${100 - (nutritionStore.overallProgress || 0)}`"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                {{ nutritionStore.overallProgress || 0 }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Analytics -->
        <div v-if="nutritionStore.goals" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Macronutrient Breakdown -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center mb-6">
              <div class="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Macronutrient Balance</h3>
                <p class="text-gray-600">Your daily nutrition breakdown</p>
              </div>
            </div>
            
            <div class="space-y-4">
              <!-- Protein -->
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mr-3"></div>
                  <span class="font-medium text-gray-700">Protein</span>
                  <span class="text-sm text-gray-500 ml-2">({{ Math.round((nutritionStore.goals.dailyProtein * 4 / nutritionStore.goals.dailyCalories) * 100) || 0 }}%)</span>
                </div>
                <div class="text-right">
                  <div class="font-bold text-gray-900">{{ nutritionStore.goals.dailyProtein }}g</div>
                  <div class="text-xs text-gray-500">{{ nutritionStore.goals.dailyProtein * 4 }} kcal</div>
                </div>
              </div>
              
              <!-- Carbs -->
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-3"></div>
                  <span class="font-medium text-gray-700">Carbohydrates</span>
                  <span class="text-sm text-gray-500 ml-2">({{ Math.round((nutritionStore.goals.dailyCarbs * 4 / nutritionStore.goals.dailyCalories) * 100) || 0 }}%)</span>
                </div>
                <div class="text-right">
                  <div class="font-bold text-gray-900">{{ nutritionStore.goals.dailyCarbs }}g</div>
                  <div class="text-xs text-gray-500">{{ nutritionStore.goals.dailyCarbs * 4 }} kcal</div>
                </div>
              </div>
              
              <!-- Fat -->
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3"></div>
                  <span class="font-medium text-gray-700">Healthy Fats</span>
                  <span class="text-sm text-gray-500 ml-2">({{ Math.round((nutritionStore.goals.dailyFat * 9 / nutritionStore.goals.dailyCalories) * 100) || 0 }}%)</span>
                </div>
                <div class="text-right">
                  <div class="font-bold text-gray-900">{{ nutritionStore.goals.dailyFat }}g</div>
                  <div class="text-xs text-gray-500">{{ nutritionStore.goals.dailyFat * 9 }} kcal</div>
                </div>
              </div>
              
              <!-- Total Calories Summary -->
              <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-100">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-gray-800">Total Daily Target</span>
                  <span class="text-2xl font-bold text-blue-600">{{ nutritionStore.goals.dailyCalories }} kcal</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Today's Progress -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center mb-6">
              <div class="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Today's Summary</h3>
                <p class="text-gray-600">Your current progress and remaining targets</p>
              </div>
            </div>
            
            <div v-if="todaySummary" class="space-y-4">
              <!-- Calories Progress -->
              <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-gray-700">Calories Remaining</span>
                  <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-sm font-medium" :class="{
                      'bg-green-100 text-green-700': nutritionStore.remainingCalories > 200,
                      'bg-yellow-100 text-yellow-700': nutritionStore.remainingCalories > 0 && nutritionStore.remainingCalories <= 200,
                      'bg-red-100 text-red-700': nutritionStore.remainingCalories <= 0
                    }">
                      {{ nutritionStore.remainingCalories || 0 }} kcal
                    </span>
                  </div>
                </div>
                <div class="text-sm text-gray-600">
                  {{ todaySummary.totalCalories }} consumed of {{ nutritionStore.goals.dailyCalories }} kcal goal
                </div>
              </div>
              
              <!-- Overall Progress -->
              <div class="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-gray-700">Overall Achievement</span>
                  <span class="px-3 py-1 rounded-full text-sm font-medium" :class="{
                    'bg-green-100 text-green-700': nutritionStore.overallProgress >= 80,
                    'bg-yellow-100 text-yellow-700': nutritionStore.overallProgress >= 60,
                    'bg-blue-100 text-blue-700': nutritionStore.overallProgress >= 40,
                    'bg-gray-100 text-gray-700': nutritionStore.overallProgress < 40
                  }">
                    {{ Math.round(nutritionStore.overallProgress) || 0 }}% Complete
                  </span>
                </div>
                <div class="text-sm text-gray-600">
                  Average progress across all nutrition goals
                </div>
              </div>
              
              <!-- Last Updated -->
              <div class="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-700">Last Updated</span>
                  <span class="text-sm text-gray-600">{{ formatDate(todaySummary.date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
          <p class="text-gray-600 mb-4">Set your nutrition goals to start tracking your progress.</p>
          <button @click="showEditGoals = true" class="btn btn-primary">
            Set Your Goals
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Goals Modal -->
    <div v-if="showEditGoals" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <div class="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Customize Your Nutrition Goals</h3>
                <p class="text-blue-100 text-sm">Set your personalized daily targets</p>
              </div>
            </div>
            <button @click="closeEditModal" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        
          <form @submit.prevent="saveGoals" class="space-y-6">
            <!-- Goals Input Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Calories -->
              <div class="relative">
                <div class="flex items-center mb-3">
                  <div class="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-2"></div>
                  <label class="text-sm font-semibold text-gray-800">Daily Calories *</label>
                </div>
                <div class="relative">
                  <input
                    v-model.number="goalsForm.calories"
                    type="number"
                    min="800"
                    max="5000"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-lg font-medium"
                    placeholder="2000"
                    required
                  />
                  <div class="absolute right-3 top-3 text-gray-500 font-medium">kcal</div>
                </div>
                <div class="flex justify-between mt-2">
                  <p class="text-xs text-gray-500">Recommended: 1500-3000 kcal</p>
                  <div class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                    {{ goalsForm.calories || 0 }} kcal
                  </div>
                </div>
              </div>
              
              <!-- Protein -->
              <div class="relative">
                <div class="flex items-center mb-3">
                  <div class="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mr-2"></div>
                  <label class="text-sm font-semibold text-gray-800">Protein *</label>
                </div>
                <div class="relative">
                  <input
                    v-model.number="goalsForm.protein"
                    type="number"
                    min="20"
                    max="300"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-colors text-lg font-medium"
                    placeholder="150"
                    required
                  />
                  <div class="absolute right-3 top-3 text-gray-500 font-medium">g</div>
                </div>
                <div class="flex justify-between mt-2">
                  <p class="text-xs text-gray-500">Muscle building & repair</p>
                  <div class="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full font-medium">
                    {{ Math.round((goalsForm.protein * 4 / goalsForm.calories) * 100) || 0 }}% calories
                  </div>
                </div>
              </div>
              
              <!-- Carbohydrates -->
              <div class="relative">
                <div class="flex items-center mb-3">
                  <div class="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-2"></div>
                  <label class="text-sm font-semibold text-gray-800">Carbohydrates *</label>
                </div>
                <div class="relative">
                  <input
                    v-model.number="goalsForm.carbohydrates"
                    type="number"
                    min="20"
                    max="500"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-0 transition-colors text-lg font-medium"
                    placeholder="200"
                    required
                  />
                  <div class="absolute right-3 top-3 text-gray-500 font-medium">g</div>
                </div>
                <div class="flex justify-between mt-2">
                  <p class="text-xs text-gray-500">Primary energy source</p>
                  <div class="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full font-medium">
                    {{ Math.round((goalsForm.carbohydrates * 4 / goalsForm.calories) * 100) || 0 }}% calories
                  </div>
                </div>
              </div>
              
              <!-- Fat -->
              <div class="relative">
                <div class="flex items-center mb-3">
                  <div class="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-2"></div>
                  <label class="text-sm font-semibold text-gray-800">Healthy Fats *</label>
                </div>
                <div class="relative">
                  <input
                    v-model.number="goalsForm.fat"
                    type="number"
                    min="20"
                    max="200"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors text-lg font-medium"
                    placeholder="67"
                    required
                  />
                  <div class="absolute right-3 top-3 text-gray-500 font-medium">g</div>
                </div>
                <div class="flex justify-between mt-2">
                  <p class="text-xs text-gray-500">Hormone production & absorption</p>
                  <div class="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                    {{ Math.round((goalsForm.fat * 9 / goalsForm.calories) * 100) || 0 }}% calories
                  </div>
                </div>
              </div>
            </div>
          
            <!-- Visual Calorie Breakdown -->
            <div class="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div class="flex items-center mb-4">
                <div class="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900">Calorie Distribution</h4>
              </div>
              
              <div class="space-y-3">
                <!-- Protein Breakdown -->
                <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span class="font-medium text-gray-800">Protein</span>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-gray-900">{{ goalsForm.protein * 4 }} kcal</div>
                    <div class="text-xs text-gray-500">({{ Math.round((goalsForm.protein * 4 / goalsForm.calories) * 100) || 0 }}%)</div>
                  </div>
                </div>
                
                <!-- Carbs Breakdown -->
                <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span class="font-medium text-gray-800">Carbohydrates</span>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-gray-900">{{ goalsForm.carbohydrates * 4 }} kcal</div>
                    <div class="text-xs text-gray-500">({{ Math.round((goalsForm.carbohydrates * 4 / goalsForm.calories) * 100) || 0 }}%)</div>
                  </div>
                </div>
                
                <!-- Fat Breakdown -->
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span class="font-medium text-gray-800">Healthy Fats</span>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-gray-900">{{ goalsForm.fat * 9 }} kcal</div>
                    <div class="text-xs text-gray-500">({{ Math.round((goalsForm.fat * 9 / goalsForm.calories) * 100) || 0 }}%)</div>
                  </div>
                </div>
                
                <!-- Total Summary -->
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                    <span class="font-bold text-gray-800">Total Calories</span>
                    <div class="text-right">
                      <div class="text-2xl font-bold text-blue-600">{{ (goalsForm.protein * 4) + (goalsForm.carbohydrates * 4) + (goalsForm.fat * 9) }}</div>
                      <div class="text-xs text-gray-500">kcal per day</div>
                    </div>
                  </div>
                  
                  <!-- Calorie Goal Comparison -->
                  <div class="mt-3 text-center">
                    <div class="text-sm" :class="{
                      'text-green-600': Math.abs(((goalsForm.protein * 4) + (goalsForm.carbohydrates * 4) + (goalsForm.fat * 9)) - goalsForm.calories) <= 50,
                      'text-yellow-600': Math.abs(((goalsForm.protein * 4) + (goalsForm.carbohydrates * 4) + (goalsForm.fat * 9)) - goalsForm.calories) <= 100,
                      'text-red-600': Math.abs(((goalsForm.protein * 4) + (goalsForm.carbohydrates * 4) + (goalsForm.fat * 9)) - goalsForm.calories) > 100
                    }">
                      <span v-if="Math.abs(((goalsForm.protein * 4) + (goalsForm.carbohydrates * 4) + (goalsForm.fat * 9)) - goalsForm.calories) <= 50">
                        ✅ Perfect balance! Macros match your calorie goal.
                      </span>
                      <span v-else-if="Math.abs(((goalsForm.protein * 4) + (goalsForm.carbohydrates * 4) + (goalsForm.fat * 9)) - goalsForm.calories) <= 100">
                        ⚠️ Close match. {{ Math.abs(((goalsForm.protein * 4) + (goalsForm.carbohydrates * 4) + (goalsForm.fat * 9)) - goalsForm.calories) }} kcal difference.
                      </span>
                      <span v-else>
                        ❌ Macros don't match calorie goal. {{ Math.abs(((goalsForm.protein * 4) + (goalsForm.carbohydrates * 4) + (goalsForm.fat * 9)) - goalsForm.calories) }} kcal difference.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            <!-- Error Message -->
            <div v-if="nutritionStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm text-red-700 font-medium">{{ nutritionStore.error }}</p>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-4 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                @click="closeEditModal" 
                class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                :disabled="nutritionStore.loading"
              >
                <span v-if="nutritionStore.loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Goals...
                </span>
                <span v-else class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Goals
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNutritionStore } from '@/stores/nutrition'
import { useAuthStore } from '@/stores/auth'

const nutritionStore = useNutritionStore()
const authStore = useAuthStore()

const showEditGoals = ref(false)

const goalsForm = ref({
  calories: 2000,
  protein: 150,
  carbohydrates: 200,
  fat: 67
})

const todaySummary = computed(() => nutritionStore.todaySummary)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const generateRecommendedGoals = async () => {
  try {
    const user = authStore.currentUser
    if (!user) {
      console.error('No user data available for goal generation')
      return
    }
    
    const result = await nutritionStore.generateRecommendedGoals(user)
    if (result.success && nutritionStore.goals) {
      // Successfully generated recommendations, populate form and show modal
      goalsForm.value = {
        calories: nutritionStore.goals.dailyCalories,
        protein: nutritionStore.goals.dailyProtein,
        carbohydrates: nutritionStore.goals.dailyCarbs,
        fat: nutritionStore.goals.dailyFat
      }
      showEditGoals.value = true
    } else {
      // Failed to generate recommendations - error should be displayed via nutritionStore.error
      console.error('Failed to generate recommendations:', result.message)
    }
  } catch (error) {
    console.error('Failed to generate recommended goals:', error)
  }
}

const closeEditModal = () => {
  showEditGoals.value = false
  nutritionStore.clearError()
  
  // Reset form to current goals
  if (nutritionStore.goals) {
    goalsForm.value = {
      calories: nutritionStore.goals.dailyCalories,
      protein: nutritionStore.goals.dailyProtein,
      carbohydrates: nutritionStore.goals.dailyCarbs,
      fat: nutritionStore.goals.dailyFat
    }
  }
}

const saveGoals = async () => {
  try {
    // Map form fields to API format
    const goalsData = {
      dailyCalories: goalsForm.value.calories,
      dailyProtein: goalsForm.value.protein,
      dailyCarbs: goalsForm.value.carbohydrates,
      dailyFat: goalsForm.value.fat
    }
    
    await nutritionStore.updateGoals(goalsData)
    showEditGoals.value = false
    await refreshData()
  } catch (error) {
    console.error('Failed to save goals:', error)
  }
}

const refreshData = async () => {
  await Promise.all([
    nutritionStore.fetchGoals(),
    nutritionStore.getTodaySummary()
  ])
}

onMounted(async () => {
  await refreshData()
  
  // Initialize form with current goals
  if (nutritionStore.goals) {
    goalsForm.value = {
      calories: nutritionStore.goals.dailyCalories,
      protein: nutritionStore.goals.dailyProtein,
      carbohydrates: nutritionStore.goals.dailyCarbs,
      fat: nutritionStore.goals.dailyFat
    }
  }
})
</script>