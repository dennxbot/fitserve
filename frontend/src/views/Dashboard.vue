<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Enhanced Page header -->
    <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-4 mb-2">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold leading-7 text-white sm:text-4xl">
                  Welcome back, {{ currentUser?.firstName }}! ✨
                </h1>
                <p class="mt-1 text-lg text-blue-200 font-medium">
                  {{ currentDate }}
                </p>
              </div>
            </div>
            <div class="mt-4 flex items-center space-x-6">
              <div class="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                <svg class="w-5 h-5 text-emerald-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                </svg>
                <span class="text-white font-semibold">{{ todayEntries.length }} meals logged today</span>
              </div>
              <div class="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                <svg class="w-5 h-5 text-yellow-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="text-white font-semibold">{{ Math.round(caloriesProgress) }}% of daily goals</span>
              </div>
            </div>
          </div>
          <div class="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            <router-link
              to="/food"
              class="inline-flex items-center px-6 py-3 border border-white border-opacity-30 rounded-2xl shadow-lg text-sm font-semibold text-white bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <svg class="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Food Log
            </router-link>
            <router-link
              to="/food/add"
              class="inline-flex items-center px-6 py-3 border-2 border-transparent rounded-2xl shadow-lg text-sm font-bold text-blue-600 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Log Food
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <!-- Enhanced Quick stats -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <!-- Calories -->
        <div class="group relative bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-white">{{ Math.round(caloriesProgress) }}%</div>
              </div>
            </div>
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-white">Calories Today</h3>
              <div class="text-white/90 text-sm font-medium">
                {{ todaySummary?.totalCalories || 0 }} / {{ nutritionGoals?.dailyCalories || 2000 }} cal
              </div>
              <div class="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  class="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-inner"
                  :style="{ width: `${Math.min(caloriesProgress, 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-medium text-white/80">
                  {{ remainingCalories > 0 ? `${Math.round(remainingCalories)} left` : `${Math.round((todaySummary?.totalCalories || 0) - (nutritionGoals?.dailyCalories || 0))} over` }}
                </span>
                <div class="flex items-center text-white/80">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                  </svg>
                  <span class="text-xs font-medium">{{ todayEntries.length }} meals</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Protein -->
        <div class="group relative bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-white">{{ Math.round(proteinProgress) }}%</div>
              </div>
            </div>
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-white">Protein</h3>
              <div class="text-white/90 text-sm font-medium">
                {{ todaySummary?.totalProtein || 0 }}g / {{ nutritionGoals?.dailyProtein || 150 }}g
              </div>
              <div class="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  class="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-inner"
                  :style="{ width: `${Math.min(proteinProgress, 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-medium text-white/80">
                  {{ remainingProtein > 0 ? `${Math.round(remainingProtein)}g left` : `${Math.round((todaySummary?.totalProtein || 0) - (nutritionGoals?.dailyProtein || 0))}g over` }}
                </span>
                <div class="flex items-center text-white/80">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span class="text-xs font-medium">muscle fuel</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carbs -->
        <div class="group relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-white">{{ Math.round(carbsProgress) }}%</div>
              </div>
            </div>
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-white">Carbs</h3>
              <div class="text-white/90 text-sm font-medium">
                {{ todaySummary?.totalCarbs || 0 }}g / {{ nutritionGoals?.dailyCarbs || 250 }}g
              </div>
              <div class="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  class="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-inner"
                  :style="{ width: `${Math.min(carbsProgress, 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-medium text-white/80">
                  {{ remainingCarbs > 0 ? `${Math.round(remainingCarbs)}g left` : `${Math.round((todaySummary?.totalCarbs || 0) - (nutritionGoals?.dailyCarbs || 0))}g over` }}
                </span>
                <div class="flex items-center text-white/80">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="text-xs font-medium">energy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fat -->
        <div class="group relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-white">{{ Math.round(fatProgress) }}%</div>
              </div>
            </div>
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-white">Fat</h3>
              <div class="text-white/90 text-sm font-medium">
                {{ todaySummary?.totalFat || 0 }}g / {{ nutritionGoals?.dailyFat || 67 }}g
              </div>
              <div class="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  class="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-inner"
                  :style="{ width: `${Math.min(fatProgress, 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-medium text-white/80">
                  {{ remainingFat > 0 ? `${Math.round(remainingFat)}g left` : `${Math.round((todaySummary?.totalFat || 0) - (nutritionGoals?.dailyFat || 0))}g over` }}
                </span>
                <div class="flex items-center text-white/80">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span class="text-xs font-medium">healthy fats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Enhanced Recent meals -->
        <div class="lg:col-span-2">
          <div class="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-white">Today's Meals</h3>
                </div>
                <router-link
                  to="/food"
                  class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
                >
                  <span>View all</span>
                  <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
            <div class="p-6">
              
              <div v-if="todayEntries.length === 0" class="text-center py-12">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No meals logged today</h3>
                <p class="text-gray-500 mb-6">Start tracking your nutrition by logging your first meal of the day!</p>
                <div class="space-y-3">
                  <router-link
                    to="/food/add"
                    class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <svg class="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Log Your First Meal
                  </router-link>
                  <div class="text-xs text-gray-400">Track calories, protein, carbs, and more</div>
                </div>
              </div>
              
              <div v-else class="space-y-4">
                <div
                  v-for="entry in todayEntries.slice(0, 5)"
                  :key="entry.id"
                  class="group relative bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 flex-1">
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <p class="font-semibold text-gray-900 mb-1">{{ entry.food.name }}</p>
                        <div class="flex items-center space-x-3 text-sm text-gray-500">
                          <span class="inline-flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            {{ entry.quantity }}{{ entry.unit }}
                          </span>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="{
                            'bg-yellow-100 text-yellow-800': entry.mealType === 'breakfast',
                            'bg-green-100 text-green-800': entry.mealType === 'lunch',
                            'bg-orange-100 text-orange-800': entry.mealType === 'dinner',
                            'bg-purple-100 text-purple-800': entry.mealType === 'snack'
                          }">
                            {{ entry.mealType }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right space-y-1">
                      <div class="text-lg font-bold text-gray-900">{{ calculateEntryCalories(entry) }}</div>
                      <div class="text-xs text-gray-500 font-medium">calories</div>
                      <div class="text-xs text-gray-400">{{ formatTime(entry.consumedAt) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Quick actions & progress -->
        <div class="space-y-6">
          <!-- Quick actions -->
          <div class="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-white">Quick Actions</h3>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <router-link
                  to="/food/add"
                  class="group w-full flex items-center px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-2xl text-sm font-semibold text-gray-700 hover:text-blue-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div class="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center mr-4 transition-colors duration-300">
                    <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold">Log Food</div>
                    <div class="text-xs text-gray-500">Track your meals</div>
                  </div>
                  <svg class="ml-auto w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
                
                <router-link
                  to="/progress"
                  class="group w-full flex items-center px-5 py-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-2xl text-sm font-semibold text-gray-700 hover:text-purple-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div class="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center mr-4 transition-colors duration-300">
                    <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold">Log Weight</div>
                    <div class="text-xs text-gray-500">Track progress</div>
                  </div>
                  <svg class="ml-auto w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
                
                <router-link
                  to="/goals"
                  class="group w-full flex items-center px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-2xl text-sm font-semibold text-gray-700 hover:text-green-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div class="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center mr-4 transition-colors duration-300">
                    <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold">Update Goals</div>
                    <div class="text-xs text-gray-500">Set targets</div>
                  </div>
                  <svg class="ml-auto w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Enhanced Weight progress -->
          <div class="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-white">Weight Progress</h3>
                </div>
                <router-link
                  to="/progress"
                  class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
                >
                  <span>Details</span>
                  <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
            <div class="p-6">
              <div v-if="latestWeight" class="text-center space-y-4">
                <div class="relative">
                  <div class="text-4xl font-bold text-gray-900 mb-1">{{ latestWeight.weight }}</div>
                  <div class="text-sm font-medium text-gray-500 mb-4">kg current weight</div>
                  
                  <div v-if="weightTrend" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold" :class="{
                    'bg-red-50 text-red-700 border border-red-200': weightTrend > 0,
                    'bg-green-50 text-green-700 border border-green-200': weightTrend < 0,
                    'bg-gray-50 text-gray-700 border border-gray-200': weightTrend === 0
                  }">
                    <svg class="w-4 h-4 mr-2" :class="{
                      'text-red-500': weightTrend > 0,
                      'text-green-500': weightTrend < 0,
                      'text-gray-500': weightTrend === 0
                    }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path v-if="weightTrend > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7" />
                      <path v-else-if="weightTrend < 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7l9.2 9.2M17 7v10H7" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
                    </svg>
                    {{ weightTrend > 0 ? '+' : '' }}{{ Math.abs(weightTrend).toFixed(1) }}kg this week
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-8">
                <div class="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">No weight entries yet</h4>
                <p class="text-gray-500 mb-4">Start tracking your weight progress today!</p>
                <router-link
                  to="/progress"
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Log First Weight
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFoodStore } from '@/stores/food'
import { useNutritionStore } from '@/stores/nutrition'
import { useProgressStore } from '@/stores/progress'

const authStore = useAuthStore()
const foodStore = useFoodStore()
const nutritionStore = useNutritionStore()
const progressStore = useProgressStore()

// Computed properties
const currentUser = computed(() => authStore.currentUser)
const todaySummary = computed(() => nutritionStore.todaySummary)
const nutritionGoals = computed(() => nutritionStore.goals)
const todayEntries = computed(() => foodStore.todayEntries)
const latestWeight = computed(() => progressStore.latestWeight)
const weightTrend = computed(() => progressStore.weeklyTrend)

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const caloriesProgress = computed(() => {
  if (!nutritionGoals.value) return 0
  const summary = todaySummary.value
  if (!summary || !summary.totalCalories) return 0
  return Math.min((summary.totalCalories / nutritionGoals.value.dailyCalories) * 100, 100)
})

const proteinProgress = computed(() => {
  if (!nutritionGoals.value) return 0
  const summary = todaySummary.value
  if (!summary || !summary.totalProtein) return 0
  return Math.min((summary.totalProtein / nutritionGoals.value.dailyProtein) * 100, 100)
})

const carbsProgress = computed(() => {
  if (!nutritionGoals.value) return 0
  const summary = todaySummary.value
  if (!summary || !summary.totalCarbs) return 0
  return Math.min((summary.totalCarbs / nutritionGoals.value.dailyCarbs) * 100, 100)
})

const fatProgress = computed(() => {
  if (!nutritionGoals.value) return 0
  const summary = todaySummary.value
  if (!summary || !summary.totalFat) return 0
  return Math.min((summary.totalFat / nutritionGoals.value.dailyFat) * 100, 100)
})

const remainingCalories = computed(() => {
  if (!nutritionGoals.value) return 2000
  const summary = todaySummary.value
  if (!summary) return nutritionGoals.value.dailyCalories
  return Math.max(nutritionGoals.value.dailyCalories - (summary.totalCalories || 0), 0)
})

const remainingProtein = computed(() => {
  if (!nutritionGoals.value) return 150
  const summary = todaySummary.value
  if (!summary) return nutritionGoals.value.dailyProtein
  return Math.max(nutritionGoals.value.dailyProtein - (summary.totalProtein || 0), 0)
})

const remainingCarbs = computed(() => {
  if (!nutritionGoals.value) return 250
  const summary = todaySummary.value
  if (!summary) return nutritionGoals.value.dailyCarbs
  return Math.max(nutritionGoals.value.dailyCarbs - (summary.totalCarbs || 0), 0)
})

const remainingFat = computed(() => {
  if (!nutritionGoals.value) return 67
  const summary = todaySummary.value
  if (!summary) return nutritionGoals.value.dailyFat
  return Math.max(nutritionGoals.value.dailyFat - (summary.totalFat || 0), 0)
})

// Methods
const calculateEntryCalories = (entry: any) => {
  if (!entry.food || !entry.food.calories || !entry.quantity) {
    return 0
  }
  const servingSize = entry.food.servingSize || entry.food.serving_size || 100
  const multiplier = entry.quantity / servingSize
  return Math.round((entry.food.calories || 0) * multiplier)
}

const formatTime = (dateString: string) => {
  if (!dateString) return 'Unknown time'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Invalid time'
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Lifecycle
onMounted(async () => {
  // Load initial data with user profile refresh
  await Promise.all([
    authStore.fetchProfile(), // Refresh current user data
    nutritionStore.fetchGoals(),
    nutritionStore.getTodaySummary(),
    foodStore.fetchTodayEntries(),
    progressStore.fetchWeightEntries()
  ])
  
  // Debug logging
  console.log('Dashboard Data Loaded:', {
    currentUser: authStore.currentUser,
    latestWeight: progressStore.latestWeight
  })
})
</script>