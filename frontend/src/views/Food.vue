<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Food Log</h1>
        <p class="mt-2 text-gray-600">Track your daily food intake and nutrition</p>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8 flex flex-wrap gap-4 justify-center md:justify-start">
        <!-- Add Food -->
        <button
          @click="showAddFood = true"
          class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white bg-opacity-20 rounded-lg group-hover:rotate-180 transition-transform duration-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-lg">Add Food</span>
          </div>
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
        </button>
        
        <!-- Scan Barcode -->
        <button
          @click="showBarcodeScanner = true"
          class="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <span class="text-lg">Scan Barcode</span>
          </div>
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
        </button>
        
        <!-- Create Custom Food -->
        <router-link
          to="/food/add"
          class="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white bg-opacity-20 rounded-lg group-hover:-rotate-12 transition-transform duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
              </svg>
            </div>
            <span class="text-lg">Create Food</span>
          </div>
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
        </router-link>
      </div>

      <!-- Today's Nutrition Summary -->
      <div class="mb-8">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Today's Nutrition</h2>
              <p class="text-gray-600">{{ formatDate(new Date()) }}</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-indigo-600">{{ Math.round(nutritionStore.overallProgress) || 0 }}%</div>
              <div class="text-sm text-gray-500">Daily Progress</div>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Calories Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-white bg-opacity-20 rounded-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold">{{ Math.round(((todaysSummary?.totalCalories || 0) / (nutritionGoals?.dailyCalories || 1)) * 100) }}%</div>
                  <div class="text-xs opacity-75">of goal</div>
                </div>
              </div>
              
              <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">Calories</h3>
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold">{{ todaysSummary?.totalCalories || 0 }}</span>
                  <span class="text-sm opacity-75">/ {{ nutritionGoals?.dailyCalories || 0 }}</span>
                </div>
              </div>
              
              <!-- Status Badge -->
              <div class="flex justify-center">
                <span class="px-3 py-1 rounded-full text-xs font-bold" :class="{
                  'bg-green-500 bg-opacity-20 text-green-100 border border-green-400 border-opacity-30': Math.max((nutritionGoals?.dailyCalories || 0) - (todaysSummary?.totalCalories || 0), 0) > 200,
                  'bg-yellow-500 bg-opacity-20 text-yellow-100 border border-yellow-400 border-opacity-30': Math.max((nutritionGoals?.dailyCalories || 0) - (todaysSummary?.totalCalories || 0), 0) > 0 && Math.max((nutritionGoals?.dailyCalories || 0) - (todaysSummary?.totalCalories || 0), 0) <= 200,
                  'bg-red-500 bg-opacity-20 text-red-100 border border-red-400 border-opacity-30': Math.max((nutritionGoals?.dailyCalories || 0) - (todaysSummary?.totalCalories || 0), 0) === 0,
                  'bg-purple-500 bg-opacity-20 text-purple-100 border border-purple-400 border-opacity-30': (todaysSummary?.totalCalories || 0) > (nutritionGoals?.dailyCalories || 0)
                }">
                  <span v-if="(todaysSummary?.totalCalories || 0) > (nutritionGoals?.dailyCalories || 0)">
                    {{ Math.round((todaysSummary?.totalCalories || 0) - (nutritionGoals?.dailyCalories || 0)) }} over
                  </span>
                  <span v-else>
                    {{ Math.round(Math.max((nutritionGoals?.dailyCalories || 0) - (todaysSummary?.totalCalories || 0), 0)) }} left
                  </span>
                </span>
              </div>
            </div>
          </div>
          
          <!-- Protein Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-white bg-opacity-20 rounded-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold">{{ Math.round(((todaysSummary?.totalProtein || 0) / (nutritionGoals?.dailyProtein || 1)) * 100) }}%</div>
                  <div class="text-xs opacity-75">of goal</div>
                </div>
              </div>
              
              <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">Protein</h3>
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold">{{ todaysSummary?.totalProtein || 0 }}g</span>
                  <span class="text-sm opacity-75">/ {{ nutritionGoals?.dailyProtein || 0 }}g</span>
                </div>
              </div>
              
              <div class="flex justify-center">
                <span class="px-3 py-1 rounded-full text-xs font-bold" :class="{
                  'bg-green-500 bg-opacity-20 text-green-100 border border-green-400 border-opacity-30': Math.max((nutritionGoals?.dailyProtein || 0) - (todaysSummary?.totalProtein || 0), 0) > 10,
                  'bg-yellow-500 bg-opacity-20 text-yellow-100 border border-yellow-400 border-opacity-30': Math.max((nutritionGoals?.dailyProtein || 0) - (todaysSummary?.totalProtein || 0), 0) > 0 && Math.max((nutritionGoals?.dailyProtein || 0) - (todaysSummary?.totalProtein || 0), 0) <= 10,
                  'bg-red-500 bg-opacity-20 text-red-100 border border-red-400 border-opacity-30': Math.max((nutritionGoals?.dailyProtein || 0) - (todaysSummary?.totalProtein || 0), 0) === 0,
                  'bg-purple-500 bg-opacity-20 text-purple-100 border border-purple-400 border-opacity-30': (todaysSummary?.totalProtein || 0) > (nutritionGoals?.dailyProtein || 0)
                }">
                  <span v-if="(todaysSummary?.totalProtein || 0) > (nutritionGoals?.dailyProtein || 0)">
                    {{ Math.round((todaysSummary?.totalProtein || 0) - (nutritionGoals?.dailyProtein || 0)) }}g over
                  </span>
                  <span v-else>
                    {{ Math.round(Math.max((nutritionGoals?.dailyProtein || 0) - (todaysSummary?.totalProtein || 0), 0) * 10) / 10 }}g left
                  </span>
                </span>
              </div>
            </div>
          </div>
          
          <!-- Carbs Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-white bg-opacity-20 rounded-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold">{{ Math.round(((todaysSummary?.totalCarbs || 0) / (nutritionGoals?.dailyCarbs || 1)) * 100) }}%</div>
                  <div class="text-xs opacity-75">of goal</div>
                </div>
              </div>
              
              <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">Carbs</h3>
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold">{{ todaysSummary?.totalCarbs || 0 }}g</span>
                  <span class="text-sm opacity-75">/ {{ nutritionGoals?.dailyCarbs || 0 }}g</span>
                </div>
              </div>
              
              <div class="flex justify-center">
                <span class="px-3 py-1 rounded-full text-xs font-bold" :class="{
                  'bg-green-500 bg-opacity-20 text-green-100 border border-green-400 border-opacity-30': Math.max((nutritionGoals?.dailyCarbs || 0) - (todaysSummary?.totalCarbs || 0), 0) > 25,
                  'bg-yellow-500 bg-opacity-20 text-yellow-100 border border-yellow-400 border-opacity-30': Math.max((nutritionGoals?.dailyCarbs || 0) - (todaysSummary?.totalCarbs || 0), 0) > 0 && Math.max((nutritionGoals?.dailyCarbs || 0) - (todaysSummary?.totalCarbs || 0), 0) <= 25,
                  'bg-red-500 bg-opacity-20 text-red-100 border border-red-400 border-opacity-30': Math.max((nutritionGoals?.dailyCarbs || 0) - (todaysSummary?.totalCarbs || 0), 0) === 0,
                  'bg-purple-500 bg-opacity-20 text-purple-100 border border-purple-400 border-opacity-30': (todaysSummary?.totalCarbs || 0) > (nutritionGoals?.dailyCarbs || 0)
                }">
                  <span v-if="(todaysSummary?.totalCarbs || 0) > (nutritionGoals?.dailyCarbs || 0)">
                    {{ Math.round((todaysSummary?.totalCarbs || 0) - (nutritionGoals?.dailyCarbs || 0)) }}g over
                  </span>
                  <span v-else>
                    {{ Math.round(Math.max((nutritionGoals?.dailyCarbs || 0) - (todaysSummary?.totalCarbs || 0), 0) * 10) / 10 }}g left
                  </span>
                </span>
              </div>
            </div>
          </div>
          
          <!-- Fat Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-white bg-opacity-20 rounded-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold">{{ Math.round(((todaysSummary?.totalFat || 0) / (nutritionGoals?.dailyFat || 1)) * 100) }}%</div>
                  <div class="text-xs opacity-75">of goal</div>
                </div>
              </div>
              
              <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">Fats</h3>
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold">{{ todaysSummary?.totalFat || 0 }}g</span>
                  <span class="text-sm opacity-75">/ {{ nutritionGoals?.dailyFat || 0 }}g</span>
                </div>
              </div>
              
              <div class="flex justify-center">
                <span class="px-3 py-1 rounded-full text-xs font-bold" :class="{
                  'bg-green-500 bg-opacity-20 text-green-100 border border-green-400 border-opacity-30': Math.max((nutritionGoals?.dailyFat || 0) - (todaysSummary?.totalFat || 0), 0) > 10,
                  'bg-yellow-500 bg-opacity-20 text-yellow-100 border border-yellow-400 border-opacity-30': Math.max((nutritionGoals?.dailyFat || 0) - (todaysSummary?.totalFat || 0), 0) > 0 && Math.max((nutritionGoals?.dailyFat || 0) - (todaysSummary?.totalFat || 0), 0) <= 10,
                  'bg-red-500 bg-opacity-20 text-red-100 border border-red-400 border-opacity-30': Math.max((nutritionGoals?.dailyFat || 0) - (todaysSummary?.totalFat || 0), 0) === 0,
                  'bg-purple-500 bg-opacity-20 text-purple-100 border border-purple-400 border-opacity-30': (todaysSummary?.totalFat || 0) > (nutritionGoals?.dailyFat || 0)
                }">
                  <span v-if="(todaysSummary?.totalFat || 0) > (nutritionGoals?.dailyFat || 0)">
                    {{ Math.round((todaysSummary?.totalFat || 0) - (nutritionGoals?.dailyFat || 0)) }}g over
                  </span>
                  <span v-else>
                    {{ Math.round(Math.max((nutritionGoals?.dailyFat || 0) - (todaysSummary?.totalFat || 0), 0) * 10) / 10 }}g left
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Food Entries by Meal -->
      <div class="space-y-6">
        <div v-for="(meal, index) in meals" :key="meal.type" class="bg-white rounded-xl shadow-lg overflow-hidden">
          <!-- Meal Header -->
          <div class="px-6 py-4" :class="{
            'bg-gradient-to-r from-orange-400 to-yellow-500': meal.type === 'breakfast',
            'bg-gradient-to-r from-blue-400 to-cyan-500': meal.type === 'lunch', 
            'bg-gradient-to-r from-purple-500 to-indigo-600': meal.type === 'dinner',
            'bg-gradient-to-r from-pink-400 to-rose-500': meal.type === 'snack'
          }">
            <div class="flex items-center justify-between text-white">
              <div class="flex items-center">
                <div class="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                  <svg v-if="meal.type === 'breakfast'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <svg v-else-if="meal.type === 'lunch'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <svg v-else-if="meal.type === 'dinner'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold">{{ meal.name }}</h3>
                  <p class="text-sm opacity-90">{{ getMealEntries(meal.type).length }} items logged</p>
                </div>
              </div>
              
              <!-- Meal Stats -->
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-lg font-bold">
                    {{ getMealEntries(meal.type).reduce((sum, entry) => sum + calculateEntryCalories(entry), 0) }}
                  </div>
                  <div class="text-xs opacity-90">calories</div>
                </div>
                <button
                  @click="addFoodToMeal(meal.type)"
                  class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Food
                </button>
              </div>
            </div>
          </div>
          
          <!-- Meal Content -->
          <div class="p-6">
            <div v-if="getMealEntries(meal.type).length === 0" class="text-center py-12">
              <div class="mb-4">
                <svg class="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
                </svg>
              </div>
              <h4 class="text-lg font-medium text-gray-600 mb-2">No food logged yet</h4>
              <p class="text-gray-500 mb-4">Start tracking your {{ meal.name.toLowerCase() }} nutrition</p>
              <button
                @click="addFoodToMeal(meal.type)"
                :class="[
                  'px-6 py-3 bg-gradient-to-r text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105',
                  {
                    'from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600': meal.type === 'breakfast',
                    'from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600': meal.type === 'lunch',
                    'from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700': meal.type === 'dinner',
                    'from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600': meal.type === 'snack'
                  }
                ]"
              >
                Add Your First Food
              </button>
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="entry in getMealEntries(meal.type)"
                :key="entry.id"
                class="group relative bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <div class="w-3 h-3 rounded-full mr-3" :class="{
                        'bg-gradient-to-r from-orange-400 to-yellow-500': meal.type === 'breakfast',
                        'bg-gradient-to-r from-blue-400 to-cyan-500': meal.type === 'lunch',
                        'bg-gradient-to-r from-purple-500 to-indigo-600': meal.type === 'dinner',
                        'bg-gradient-to-r from-pink-400 to-rose-500': meal.type === 'snack'
                      }"></div>
                      <h4 class="font-semibold text-gray-900 text-lg">{{ entry.food.name }}</h4>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div class="bg-blue-50 rounded-lg p-2 text-center">
                        <div class="font-bold text-blue-700">{{ calculateEntryCalories(entry) }}</div>
                        <div class="text-xs text-blue-600">calories</div>
                      </div>
                      <div class="bg-red-50 rounded-lg p-2 text-center">
                        <div class="font-bold text-red-700">{{ Math.round((entry.food.protein || 0) * (entry.quantity / (entry.food.servingSize || 100)) * 10) / 10 }}g</div>
                        <div class="text-xs text-red-600">protein</div>
                      </div>
                      <div class="bg-yellow-50 rounded-lg p-2 text-center">
                        <div class="font-bold text-yellow-700">{{ Math.round((entry.food.carbs || 0) * (entry.quantity / (entry.food.servingSize || 100)) * 10) / 10 }}g</div>
                        <div class="text-xs text-yellow-600">carbs</div>
                      </div>
                      <div class="bg-green-50 rounded-lg p-2 text-center">
                        <div class="font-bold text-green-700">{{ Math.round((entry.food.fat || 0) * (entry.quantity / (entry.food.servingSize || 100)) * 10) / 10 }}g</div>
                        <div class="text-xs text-green-600">fat</div>
                      </div>
                    </div>
                    
                    <div class="mt-3 text-sm text-gray-600">
                      <span class="font-medium">{{ entry.quantity }}{{ entry.unit || 'g' }}</span>
                      <span class="mx-2">•</span>
                      <span>{{ entry.food.servingSize || 100 }}{{ entry.food.servingUnit || 'g' }} serving</span>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      @click="editFoodEntry(entry)"
                      class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Edit entry"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteFoodEntry(entry.id)"
                      class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete entry"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Food Modal -->
    <div v-if="showAddFood" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <div class="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Find Food</h3>
                <p class="text-blue-100 text-sm">Search our food database</p>
              </div>
            </div>
            <button @click="showAddFood = false" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Modal Content -->
        <div class="p-6">
          <!-- Search Input -->
          <div class="relative mb-6">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @input="searchFood"
              type="text"
              placeholder="Search for food (e.g., chicken breast, apple)..."
              class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-lg"
            />
          </div>
          
          <!-- Loading State -->
          <div v-if="foodStore.loading" class="text-center py-8">
            <div class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching foods...
            </div>
          </div>
          
          <!-- Search Results -->
          <div v-else-if="foodStore.searchResults && foodStore.searchResults.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="food in (foodStore.searchResults || [])"
              :key="food.id"
              @click="selectFood(food)"
              class="group relative p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{{ food.name }}</h4>
                  <p class="text-gray-600 mt-1">{{ food.brand || 'Generic' }}</p>
                  <div class="flex items-center gap-4 mt-2 text-sm">
                    <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">{{ food.calories }} cal</span>
                    <span class="text-gray-500">per {{ food.servingSize || 100 }}{{ food.servingUnit || 'g' }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="p-2 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Results -->
          <div v-else-if="searchQuery && searchQuery.length > 0 && !foodStore.loading" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h4 class="text-lg font-medium text-gray-600 mb-2">No food found</h4>
            <p class="text-gray-500">Try a different search term or create a custom food.</p>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h4 class="text-lg font-medium text-gray-600 mb-2">Search for food</h4>
            <p class="text-gray-500">Type at least 2 characters to start searching</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Barcode Scanner Modal -->
    <div v-if="showBarcodeScanner" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <div class="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Scan Barcode</h3>
                <p class="text-emerald-100 text-sm">Enter or scan product barcode</p>
              </div>
            </div>
            <button @click="closeBarcodeScanner" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Modal Content -->
        <div class="p-6">
          <!-- Mode Toggle -->
          <div class="flex gap-2 mb-6">
            <button
              @click="toggleCameraMode"
              :class="[
                'flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300',
                !useCamera 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Manual Entry
              </div>
            </button>
            <button
              @click="toggleCameraMode"
              :class="[
                'flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300',
                useCamera 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Camera Scan
              </div>
            </button>
          </div>
          
          <!-- Instructions -->
          <div v-if="!useCamera" class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <div class="flex items-start">
              <div class="p-2 bg-emerald-500 rounded-lg mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 mb-1">Manual Entry:</h4>
                <ol class="text-sm text-gray-600 space-y-1">
                  <li>1. Enter the barcode numbers from the product</li>
                  <li>2. Click "Search" to find the product</li>
                  <li>3. The nutrition info will be loaded automatically</li>
                </ol>
              </div>
            </div>
          </div>
          
          <!-- Camera Scanner -->
          <div v-if="useCamera" class="mb-6">
            <div class="bg-black rounded-xl overflow-hidden relative" style="min-height: 300px;">
              <video 
                id="barcode-video" 
                class="w-full h-full"
                style="min-height: 300px;"
              ></video>
              
              <!-- Scanning overlay -->
              <div v-if="isCameraScanning" class="absolute inset-0 pointer-events-none">
                <!-- Dark overlay around scanning area -->
                <div class="absolute inset-0">
                  <div class="absolute inset-0 bg-black bg-opacity-50"></div>
                  <!-- Clear rectangular area for scanning (barcode shape) -->
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-transparent"></div>
                </div>
                
                <!-- Scanning frame (rectangular for barcodes) -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div class="w-80 h-32 relative">
                    <!-- Corner indicators -->
                    <div class="absolute top-0 left-0 w-12 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
                    <div class="absolute top-0 right-0 w-12 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
                    <div class="absolute bottom-0 left-0 w-12 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
                    <div class="absolute bottom-0 right-0 w-12 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>
                    
                    <!-- Scanning line animation (horizontal for barcode) -->
                    <div class="absolute inset-x-0 h-0.5 bg-emerald-400 animate-scan-line"></div>
                    
                    <!-- Barcode visualization hints -->
                    <div class="absolute inset-x-4 top-1/2 transform -translate-y-1/2 flex justify-between opacity-30">
                      <div class="w-0.5 h-16 bg-white"></div>
                      <div class="w-0.5 h-16 bg-white"></div>
                      <div class="w-1 h-16 bg-white"></div>
                      <div class="w-0.5 h-16 bg-white"></div>
                      <div class="w-1.5 h-16 bg-white"></div>
                      <div class="w-0.5 h-16 bg-white"></div>
                      <div class="w-1 h-16 bg-white"></div>
                      <div class="w-0.5 h-16 bg-white"></div>
                      <div class="w-0.5 h-16 bg-white"></div>
                      <div class="w-1.5 h-16 bg-white"></div>
                      <div class="w-0.5 h-16 bg-white"></div>
                      <div class="w-1 h-16 bg-white"></div>
                      <div class="w-0.5 h-16 bg-white"></div>
                    </div>
                  </div>
                  
                  <!-- Scanning text -->
                  <div class="mt-4 text-center">
                    <p class="text-white text-sm font-semibold bg-black bg-opacity-60 rounded-lg px-3 py-1 inline-block">
                      Align barcode horizontally
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Camera not started message -->
              <div v-if="!isCameraScanning && useCamera" class="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div class="text-center text-white">
                  <svg class="w-12 h-12 mx-auto mb-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>Starting camera...</p>
                </div>
              </div>
            </div>
            
            <!-- Camera selection -->
            <div v-if="videoDevices.length > 1" class="mt-3">
              <select 
                v-model="selectedDeviceId"
                @change="startCameraScanner"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-0"
              >
                <option v-for="device in videoDevices" :key="device.deviceId" :value="device.deviceId">
                  {{ device.label || `Camera ${videoDevices.indexOf(device) + 1}` }}
                </option>
              </select>
            </div>
            
            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600">Point your camera at the barcode</p>
              <p class="text-xs text-gray-500 mt-1">Make sure the barcode is well-lit and in focus</p>
            </div>
          </div>
          
          <!-- Barcode Input -->
          <form v-if="!useCamera" @submit.prevent="searchByBarcode">
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-800 mb-2">Barcode Number</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <input
                  v-model="barcodeInput"
                  type="text"
                  placeholder="Enter barcode (e.g., 049000006582)"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors text-lg"
                  pattern="[0-9]+"
                  required
                />
              </div>
              <p class="text-xs text-gray-500 mt-2">Usually 12-13 digits found below the barcode lines</p>
            </div>
            
            <!-- Loading State -->
            <div v-if="barcodeLoading" class="text-center py-4">
              <div class="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching for product...
              </div>
            </div>
            
            <!-- Error Message -->
            <div v-if="barcodeError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 mr-2 text-red-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-sm text-red-700 whitespace-pre-line">{{ barcodeError }}</div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button 
                type="button" 
                @click="closeBarcodeScanner" 
                class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                :disabled="barcodeLoading || !barcodeInput"
              >
                <span class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Product
                </span>
              </button>
            </div>
          </form>
          
          <!-- Example Barcodes -->
          <div class="mt-6 pt-6 border-t border-gray-100">
            <p class="text-xs text-gray-500 mb-3">Example barcodes to try:</p>
            <div class="flex flex-wrap gap-2">
              <button
                @click="barcodeInput = '049000006582'"
                class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs transition-colors"
              >
                Coca-Cola (049000006582)
              </button>
              <button
                @click="barcodeInput = '024100440481'"
                class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs transition-colors"
              >
                Pepsi (024100440481)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Food Entry Modal -->
    <div v-if="selectedFood" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center">
              <div class="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Add to Meal</h3>
                <p class="text-emerald-100 text-sm truncate">{{ selectedFood.name }}</p>
              </div>
            </div>
            <button @click="selectedFood = null" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Modal Content -->
        <div class="p-6">
          <form @submit.prevent="addFoodEntry" class="space-y-6">
            <!-- Food Info -->
            <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
              <h4 class="font-bold text-gray-900 text-lg mb-2">{{ selectedFood.name }}</h4>
              <p class="text-gray-600 mb-3">{{ selectedFood.brand || 'Generic Food' }}</p>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Serving Size:</span>
                  <span class="font-medium">{{ selectedFood.servingSize || 100 }}{{ selectedFood.servingUnit || 'g' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Calories per serving:</span>
                  <span class="font-medium">{{ selectedFood.calories }} kcal</span>
                </div>
              </div>
            </div>
            
            <!-- Form Inputs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-3">Select Meal *</label>
                <select v-model="entryForm.mealType" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors text-lg">
                  <option value="breakfast">🌅 Breakfast</option>
                  <option value="lunch">☀️ Lunch</option>
                  <option value="dinner">🌙 Dinner</option>
                  <option value="snack">🍎 Snack</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-3">Quantity (grams) *</label>
                <div class="relative">
                  <input
                    v-model.number="entryForm.quantity"
                    type="number"
                    step="0.1"
                    min="0.1"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors text-lg font-medium pr-12"
                    required
                  />
                  <div class="absolute right-3 top-3 text-gray-500 font-medium">g</div>
                </div>
                <p class="text-xs text-gray-500 mt-2">Standard serving: {{ selectedFood.servingSize || 100 }}{{ selectedFood.servingUnit || 'g' }}</p>
              </div>
            </div>
            
            <!-- Nutrition Preview -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
              <div class="flex items-center mb-4">
                <div class="p-2 bg-emerald-500 rounded-lg mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900">Nutrition Preview</h4>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-blue-100 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold text-blue-700">{{ calculatedNutrition.calories }}</div>
                  <div class="text-xs text-blue-600 uppercase tracking-wide">Calories</div>
                </div>
                <div class="bg-red-100 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold text-red-700">{{ calculatedNutrition.protein }}g</div>
                  <div class="text-xs text-red-600 uppercase tracking-wide">Protein</div>
                </div>
                <div class="bg-yellow-100 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold text-yellow-700">{{ calculatedNutrition.carbs }}g</div>
                  <div class="text-xs text-yellow-600 uppercase tracking-wide">Carbs</div>
                </div>
                <div class="bg-green-100 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold text-green-700">{{ calculatedNutrition.fat }}g</div>
                  <div class="text-xs text-green-600 uppercase tracking-wide">Fat</div>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-4 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                @click="selectedFood = null" 
                class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                :disabled="foodStore.loading"
              >
                <span v-if="foodStore.loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Food...
                </span>
                <span v-else class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to {{ entryForm.mealType.charAt(0).toUpperCase() + entryForm.mealType.slice(1) }}
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useFoodStore } from '@/stores/food'
import { useNutritionStore } from '@/stores/nutrition'
import type { Food, FoodEntry } from '@/types'
import { BrowserMultiFormatReader } from '@zxing/library'
import { BrowserCodeReader } from '@zxing/browser'

const foodStore = useFoodStore()
const nutritionStore = useNutritionStore()

const showAddFood = ref(false)
const showBarcodeScanner = ref(false)
const searchQuery = ref('')
const selectedFood = ref<Food | null>(null)
const selectedMealType = ref<string>('breakfast')
const barcodeInput = ref('')
const barcodeLoading = ref(false)
const barcodeError = ref<string | null>(null)
const useCamera = ref(false)
const cameraStream = ref<MediaStream | null>(null)
const codeReader = ref<BrowserMultiFormatReader | null>(null)
const selectedDeviceId = ref<string | null>(null)
const videoDevices = ref<MediaDeviceInfo[]>([])
const isCameraScanning = ref(false)

const entryForm = ref({
  mealType: 'breakfast',
  quantity: 100
})

const meals = [
  { type: 'breakfast', name: 'Breakfast' },
  { type: 'lunch', name: 'Lunch' },
  { type: 'dinner', name: 'Dinner' },
  { type: 'snack', name: 'Snacks' }
]

const todaysSummary = computed(() => nutritionStore.todaySummary)
const nutritionGoals = computed(() => nutritionStore.goals)

const calculatedNutrition = computed(() => {
  if (!selectedFood.value) return { calories: 0, protein: 0, carbs: 0, fat: 0 }
  
  const servingSize = selectedFood.value.servingSize || selectedFood.value.serving_size || 100
  const multiplier = entryForm.value.quantity / servingSize
  return {
    calories: Math.round((selectedFood.value.calories || 0) * multiplier),
    protein: Math.round((selectedFood.value.protein || 0) * multiplier * 10) / 10,
    carbs: Math.round((selectedFood.value.carbs || 0) * multiplier * 10) / 10,
    fat: Math.round((selectedFood.value.fat || 0) * multiplier * 10) / 10
  }
})

const getMealEntries = (mealType: string) => {
  return foodStore.todayEntries.filter(entry => entry.mealType === mealType)
}

const calculateEntryCalories = (entry: FoodEntry) => {
  if (!entry.food || !entry.quantity) return 0
  const servingSize = entry.food.servingSize || entry.food.serving_size || 100
  const multiplier = entry.quantity / servingSize
  return Math.round((entry.food.calories || 0) * multiplier)
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const searchFood = async () => {
  if (searchQuery.value && searchQuery.value.length >= 2) {
    await foodStore.searchFoods({ query: searchQuery.value, page: 1, limit: 20 })
  }
}

const selectFood = (food: Food) => {
  selectedFood.value = food
  showAddFood.value = false
  entryForm.value.mealType = selectedMealType.value
}

const addFoodToMeal = (mealType: string) => {
  selectedMealType.value = mealType
  showAddFood.value = true
}

const addFoodEntry = async () => {
  if (!selectedFood.value) return
  
  try {
    let foodId = selectedFood.value.id
    
    // If the food doesn't have an id (USDA food), create it in the database first
    if (!foodId && selectedFood.value.fdcId) {
      const foodData = {
        name: selectedFood.value.name,
        brand: selectedFood.value.brand,
        category: selectedFood.value.category,
        servingSize: selectedFood.value.servingSize,
        servingUnit: selectedFood.value.servingUnit,
        calories: selectedFood.value.calories,
        protein: selectedFood.value.protein,
        carbs: selectedFood.value.carbs,
        fat: selectedFood.value.fat,
        fiber: selectedFood.value.fiber,
        sugar: selectedFood.value.sugar,
        sodium: selectedFood.value.sodium,
        cholesterol: selectedFood.value.cholesterol,
        saturatedFat: selectedFood.value.saturatedFat,
        transFat: selectedFood.value.transFat,
        potassium: selectedFood.value.potassium,
        calcium: selectedFood.value.calcium,
        iron: selectedFood.value.iron,
        vitaminA: selectedFood.value.vitaminA,
        vitaminC: selectedFood.value.vitaminC,
        verified: selectedFood.value.verified,
        fdcId: selectedFood.value.fdcId
      }
      
      const result = await foodStore.createFood(foodData)
      if (result.success && result.data) {
        // Handle nested response structure from backend
        const createdFood = result.data.food || result.data
        foodId = createdFood.id
      } else {
        throw new Error(result.message || 'Failed to create food')
      }
    }
    
    // Ensure foodId is valid before proceeding
    if (!foodId) {
      throw new Error('Food ID is required but not available')
    }
    
    const entryData = {
      foodId: foodId,
      mealType: entryForm.value.mealType,
      quantity: entryForm.value.quantity,
      consumedAt: new Date().toISOString().split('T')[0]
    }
    
    const entryResult = await foodStore.addFoodEntry(entryData)
    if (!entryResult.success) {
      throw new Error(entryResult.message || 'Failed to add food entry')
    }
    
    selectedFood.value = null
    entryForm.value = {
      mealType: 'breakfast',
      quantity: 100
    }
    
    // Refresh today's data
    await Promise.all([
      foodStore.fetchTodayEntries(),
      nutritionStore.getTodaySummary()
    ])
  } catch (error) {
    console.error('Failed to add food entry:', error)
  }
}

const editFoodEntry = (entry: FoodEntry) => {
  // TODO: Implement edit functionality
  console.log('Edit entry:', entry)
}

const deleteFoodEntry = async (entryId: string) => {
  if (confirm('Are you sure you want to delete this food entry?')) {
    try {
      await foodStore.deleteFoodEntry(entryId)
      await Promise.all([
        foodStore.fetchTodayEntries(),
        nutritionStore.getTodaySummary()
      ])
    } catch (error) {
      console.error('Failed to delete food entry:', error)
    }
  }
}

const searchByBarcode = async () => {
  if (!barcodeInput.value || barcodeInput.value.trim() === '') {
    barcodeError.value = 'Please enter a barcode'
    return
  }
  
  barcodeLoading.value = true
  barcodeError.value = null
  
  try {
    const result = await foodStore.searchByBarcode(barcodeInput.value.trim())
    
    if (result.success && result.data && result.data.food) {
      // Successfully found the food
      const food = result.data.food
      
      // Check if the food has meaningful nutrition data
      // Allow foods with at least name and some nutrition info
      if (food.name && (food.calories !== undefined || food.calories > 0)) {
        selectedFood.value = food
        showBarcodeScanner.value = false
        barcodeInput.value = ''
        entryForm.value.mealType = 'breakfast'
      } else if (food.verified === false && (!food.name || !food.calories)) {
        // This indicates the backend couldn't fetch from USDA
        barcodeError.value = 'Unable to fetch product information. The barcode service may be temporarily unavailable. Please try:\n\n1. Enter the food manually using "Add Food"\n2. Try a different barcode\n3. Create a custom food entry'
      } else {
        barcodeError.value = 'Product found but nutrition information is incomplete. You can still add it manually.'
      }
    } else {
      barcodeError.value = result.message || 'Product not found. Please check the barcode and try again.'
    }
  } catch (error: any) {
    console.error('Barcode search error:', error)
    
    // Provide more helpful error messages based on the error
    if (error.message?.includes('USDA')) {
      barcodeError.value = 'The nutrition database service is currently unavailable. Please try again later or add the food manually.'
    } else if (error.message?.includes('network')) {
      barcodeError.value = 'Network error. Please check your connection and try again.'
    } else {
      barcodeError.value = 'Unable to search for this barcode. Please try entering the food manually or create a custom food entry.'
    }
  } finally {
    barcodeLoading.value = false
  }
}

const closeBarcodeScanner = () => {
  showBarcodeScanner.value = false
  barcodeInput.value = ''
  barcodeError.value = null
  barcodeLoading.value = false
  stopCameraScanner()
  useCamera.value = false
}

const startCameraScanner = async () => {
  try {
    isCameraScanning.value = true
    barcodeError.value = null
    
    // Initialize the code reader
    codeReader.value = new BrowserMultiFormatReader()
    
    // Get available video devices
    const devices = await BrowserCodeReader.listVideoInputDevices()
    videoDevices.value = devices
    
    if (devices.length === 0) {
      throw new Error('No camera found on this device')
    }
    
    // Use the first available device if not selected
    if (!selectedDeviceId.value && devices.length > 0) {
      selectedDeviceId.value = devices[0].deviceId
    }
    
    // Start scanning
    await codeReader.value.decodeFromVideoDevice(
      selectedDeviceId.value,
      'barcode-video',
      (result, error) => {
        if (result) {
          // Successfully scanned a barcode
          const barcodeText = result.getText()
          console.log('Scanned barcode:', barcodeText)
          
          // Stop scanning
          stopCameraScanner()
          
          // Set the barcode input and search
          barcodeInput.value = barcodeText
          useCamera.value = false
          searchByBarcode()
        }
        
        // NotFoundException is normal - it happens every frame until a barcode is found
        // Only log other types of errors
        if (error && !error.message?.includes('NotFoundException') && !error.message?.includes('No MultiFormat Readers')) {
          console.error('Scanning error:', error)
        }
      }
    )
  } catch (error: any) {
    console.error('Camera error:', error)
    isCameraScanning.value = false
    
    if (error.name === 'NotAllowedError' || error.message?.includes('Permission')) {
      barcodeError.value = 'Camera permission denied. Please allow camera access to scan barcodes.'
    } else if (error.message?.includes('No camera')) {
      barcodeError.value = 'No camera found. Please use manual barcode entry.'
    } else {
      barcodeError.value = 'Unable to access camera. Please check your camera settings or use manual entry.'
    }
  }
}

const stopCameraScanner = () => {
  if (codeReader.value) {
    codeReader.value.reset()
    codeReader.value = null
  }
  
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
    cameraStream.value = null
  }
  
  isCameraScanning.value = false
}

const toggleCameraMode = async () => {
  useCamera.value = !useCamera.value
  
  if (useCamera.value) {
    // Start camera when switching to camera mode
    setTimeout(() => {
      startCameraScanner()
    }, 100) // Small delay to ensure DOM is updated
  } else {
    // Stop camera when switching to manual mode
    stopCameraScanner()
  }
}

onMounted(async () => {
  await Promise.all([
    foodStore.fetchTodayEntries(),
    nutritionStore.fetchGoals(),
    nutritionStore.getTodaySummary()
  ])
})

onUnmounted(() => {
  // Clean up camera when component is destroyed
  stopCameraScanner()
})

watch(selectedFood, (newFood) => {
  if (newFood) {
    entryForm.value.quantity = 100
  }
})
</script>

<style scoped>
@keyframes scan-line {
  0% {
    top: 0;
  }
  50% {
    top: calc(100% - 2px);
  }
  100% {
    top: 0;
  }
}

.animate-scan-line {
  animation: scan-line 2s ease-in-out infinite;
}
</style>
