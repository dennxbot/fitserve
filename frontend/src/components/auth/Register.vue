<template>
  <div class="min-h-screen flex items-center justify-center relative py-8">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-700 overflow-hidden">
      <!-- Floating Orbs Animation -->
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-400/15 rounded-full blur-2xl animate-pulse-slow"></div>
      <div class="absolute top-3/4 left-1/4 w-32 h-32 bg-green-400/20 rounded-full blur-3xl animate-float-reverse"></div>
      
      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 w-full max-w-4xl px-4 sm:px-6">
      <!-- Enhanced Glassmorphism Card with Compact Design -->
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8 transform transition-all duration-500">
        <!-- Compact Header Section -->
        <div class="text-center mb-6">
          <!-- Compact Logo -->
          <div class="mx-auto mb-4 relative">
            <div class="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center">
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          
          <!-- Compact Title -->
          <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Join FitServe
          </h1>
          <p class="text-gray-600 mb-4 text-sm">
            Start your personalized nutrition journey
          </p>
          
          <!-- Compact Access Note -->
          <div class="inline-flex items-center px-3 py-1 bg-emerald-50 rounded-full text-xs text-emerald-700">
            Already have an account? 
            <router-link to="/login" class="ml-1 font-semibold hover:text-emerald-800">
              Sign in
            </router-link>
          </div>
        </div>
        <!-- Enhanced Tabbed Registration Form -->
        <form class="space-y-6" @submit.prevent="handleRegister">
          <!-- Tab Navigation -->
          <div class="border-b border-gray-200">
            <nav class="grid grid-cols-4 gap-2 min-w-0" aria-label="Registration steps">
              <button
                v-for="(tab, index) in tabs"
                :key="tab.id"
                type="button"
                @click="switchTab(tab.id)"
                :class="[
'w-full py-2 px-1 border-b-2 font-medium text-[11px] sm:text-sm transition-colors duration-200',
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
                :disabled="!isTabAccessible(tab.id)"
              >
                <div class="flex flex-col items-center leading-tight truncate">
                  <div :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-colors duration-200',
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-white'
                      : isTabCompleted(tab.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  ]">
                    <svg v-if="isTabCompleted(tab.id)" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <span class="truncate sm:hidden">{{ tab.shortLabel }}</span>
                  <span class="truncate hidden sm:inline">{{ tab.label }}</span>
                </div>
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="min-h-[400px]">
            <!-- Tab 1: Personal Information -->
            <div v-if="activeTab === 'personal'" class="space-y-6">
              <div class="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-100">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <p class="text-sm text-gray-600">Tell us a bit about yourself</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- First Name -->
                  <div class="relative group">
                    <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="firstName"
                        v-model="form.firstName"
                        name="firstName"
                        type="text"
                        autocomplete="given-name"
                        required
                        maxlength="100"
                        :disabled="isLoading"
                        class="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                        placeholder="Enter your first name"
                        :class="{
                          'border-red-300 focus:border-red-500 focus:ring-red-500/50': form.firstName.length > 100
                        }"
                      />
                      <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                    </div>
                    <p v-if="form.firstName.length > 100" class="mt-2 text-xs text-red-600 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      First name must be 100 characters or less
                    </p>
                  </div>

                  <!-- Last Name -->
                  <div class="relative group">
                    <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="lastName"
                        v-model="form.lastName"
                        name="lastName"
                        type="text"
                        autocomplete="family-name"
                        required
                        maxlength="100"
                        :disabled="isLoading"
                        class="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                        placeholder="Enter your last name"
                        :class="{
                          'border-red-300 focus:border-red-500 focus:ring-red-500/50': form.lastName.length > 100
                        }"
                      />
                      <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                    </div>
                    <p v-if="form.lastName.length > 100" class="mt-2 text-xs text-red-600 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Last name must be 100 characters or less
                    </p>
                  </div>
                </div>
              </div>

              <!-- Date of Birth -->            
              <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div class="relative group">
                  <label for="dateOfBirth" class="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="dateOfBirth"
                      v-model="form.dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      :disabled="isLoading"
                      :max="maxDate"
                      class="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                    />
                    <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                  </div>
                  <p class="mt-2 text-xs text-gray-600">
                    This helps us provide age-appropriate recommendations
                  </p>
                </div>
              </div>
            </div>
            <!-- Tab 2: Health Profile -->
            <div v-if="activeTab === 'health'" class="space-y-6">
              <!-- Physical Stats -->
              <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Physical Stats</h3>
                    <p class="text-sm text-gray-600">Help us understand your body composition</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Gender -->
                  <div class="relative group">
                    <label for="gender" class="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    <select
                      id="gender"
                      v-model="form.gender"
                      name="gender"
                      required
                      :disabled="isLoading"
                      class="appearance-none bg-none block w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                    >
                      <option value="">Select gender</option>
                      <option value="male">🚹 Male</option>
                      <option value="female">🚺 Female</option>
                      <option value="other">⚧️ Other</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                    </div>
                  </div>


                  <!-- Height -->
                  <div class="relative group">
                    <label for="height" class="block text-sm font-semibold text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                      <input
                        id="height"
                        v-model.number="form.height"
                        name="height"
                        type="number"
                        min="100"
                        max="250"
                        required
                        :disabled="isLoading"
                        class="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                        placeholder="170"
                      />
                      <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                    </div>
                  </div>

                  <!-- Weight -->
                  <div class="relative group">
                    <label for="weight" class="block text-sm font-semibold text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      </div>
                      <input
                        id="weight"
                        v-model.number="form.weight"
                        name="weight"
                        type="number"
                        min="30"
                        max="300"
                        step="0.1"
                        required
                        :disabled="isLoading"
                        class="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                        placeholder="70.0"
                      />
                      <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Activity Level -->
              <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div class="relative group">
                  <label for="activityLevel" class="block text-sm font-semibold text-gray-700 mb-2">
                    Activity Level
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <select
                      id="activityLevel"
                      v-model="form.activityLevel"
                      name="activityLevel"
                      required
                      :disabled="isLoading"
                      class="appearance-none bg-none block w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                    >
                      <option value="">Select your activity level</option>
                      <option value="sedentary">🛋️ Sedentary (little/no exercise)</option>
                      <option value="lightly_active">🚶 Lightly Active (light exercise 1-3 days/week)</option>
                      <option value="moderately_active">🏃 Moderately Active (moderate exercise 3-5 days/week)</option>
                      <option value="very_active">💪 Very Active (hard exercise 6-7 days/week)</option>
                      <option value="extremely_active">🔥 Extremely Active (very hard exercise, physical job)</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                  </div>
                  <p class="mt-2 text-xs text-gray-600">
                    This helps us calculate your daily calorie needs more accurately
                  </p>
                </div>
              </div>
            </div>

            <!-- Tab 3: Goals & Targets -->
            <div v-if="activeTab === 'goals'" class="space-y-6">
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Fitness Goals</h3>
                    <p class="text-sm text-gray-600">Define your health and fitness objectives</p>
                  </div>
                </div>
                
                <!-- Fitness Goal -->
                <div class="relative group">
                  <label for="goal" class="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Fitness Goal
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <select
                      id="goal"
                      v-model="form.goal"
                      name="goal"
                      required
                      :disabled="isLoading"
                      @change="handleGoalChange"
                      class="appearance-none bg-none block w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                    >
                      <option value="">Select your primary goal</option>
                      <option value="lose_weight">🏃‍♀️ Lose Weight</option>
                      <option value="maintain_weight">⚖️ Maintain Current Weight</option>
                      <option value="gain_weight">📈 Gain Weight</option>
                      <option value="build_muscle">💪 Build Muscle</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                  </div>
                  <p class="mt-2 text-xs text-gray-600">
                    This helps us calculate your personalized nutrition goals
                  </p>
                </div>
              </div>

              <!-- Target Weight (conditional) -->
              <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 transform -translate-y-2"
                  enter-to-class="opacity-100 transform translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 transform translate-y-0"
                  leave-to-class="opacity-0 transform -translate-y-2"
                >
                  <div v-if="showTargetWeight" class="space-y-4">
                    <div class="relative group">
                      <label for="targetWeight" class="block text-sm font-semibold text-gray-700 mb-2">
                        Target Weight (kg)
                        <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <input
                          id="targetWeight"
                          v-model.number="form.targetWeight"
                          name="targetWeight"
                          type="number"
                          min="30"
                          max="300"
                          step="0.1"
                          :required="showTargetWeight"
                          :disabled="isLoading"
                          class="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                          placeholder="Enter your target weight"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500/50': showTargetWeight && !form.targetWeight
                          }"
                        />
                        <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                      </div>
                      <p class="mt-2 text-xs text-gray-600">
                        <span v-if="form.goal === 'lose_weight'">🎯 Your desired weight loss goal</span>
                        <span v-else-if="form.goal === 'gain_weight'">📈 Your desired weight gain goal</span>
                        <span v-else-if="form.goal === 'build_muscle'">💪 Your target weight while building muscle</span>
                      </p>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Tab 4: Account Setup -->
            <div v-if="activeTab === 'account'" class="space-y-6">
              <div class="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl p-6 border border-indigo-100">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Account Setup</h3>
                    <p class="text-sm text-gray-600">Create your secure FitServe account</p>
                  </div>
                </div>
                
                <div class="space-y-6">
                <!-- Email -->
                <div class="relative group">
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      class="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                      placeholder="Enter your email address"
                    />
                    <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                  </div>
                </div>

                <!-- Password -->
                <div class="relative group">
                  <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      v-model="form.password"
                      name="password"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      required
                      :disabled="isLoading"
                      class="block w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                      placeholder="Create a secure password"
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
                    <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                  </div>
                  <p class="mt-2 text-xs text-gray-600 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Must be at least 8 characters long
                  </p>
                </div>

                <!-- Confirm Password -->
                <div class="relative group">
                  <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      name="confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      required
                      :disabled="isLoading"
                      class="block w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                      placeholder="Confirm your password"
                      :class="{
                        'border-red-300 focus:border-red-500 focus:ring-red-500/50': passwordMismatch
                      }"
                    />
                    <!-- Show/Hide Password Button -->
                    <button
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <svg v-if="!showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    </button>
                    <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 -z-10 blur-sm"></div>
                  </div>
                  <p v-if="passwordMismatch" class="mt-2 text-xs text-red-600 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Passwords do not match
                  </p>
                </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Navigation Controls -->
          <div class="flex items-center justify-between pt-4">
            <button
              v-if="activeTab !== 'personal'"
              type="button"
              @click="previousTab"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div v-else></div>

            <button
              v-if="activeTab !== 'account'"
              type="button"
              @click="nextTab"
              :disabled="!canProceedToNextTab"
              class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Enhanced Terms & Conditions -->
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <label class="flex items-start cursor-pointer group">
              <div class="relative mt-1">
                <input
                  id="terms"
                  v-model="acceptTerms"
                  name="terms"
                  type="checkbox"
                  required
                  class="sr-only"
                />
                <div :class="[
                  'w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center',
                  acceptTerms 
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 border-emerald-500 shadow-lg' 
                    : 'border-gray-300 bg-white group-hover:border-emerald-400'
                ]">
                  <svg v-if="acceptTerms" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="ml-3 flex-1">
                <span class="text-sm text-gray-700 leading-relaxed">
                  I agree to the
                  <a href="#" class="text-emerald-600 hover:text-emerald-700 font-semibold underline decoration-2 underline-offset-2 transition-colors duration-200">Terms of Service</a>
                  and
                  <a href="#" class="text-emerald-600 hover:text-emerald-700 font-semibold underline decoration-2 underline-offset-2 transition-colors duration-200">Privacy Policy</a>
                </span>
                <p class="text-xs text-gray-500 mt-1">
                  By creating an account, you agree to our terms and privacy practices
                </p>
              </div>
            </label>
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
            <div v-if="errorDetails" class="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 shadow-sm">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3 flex-1">
                  <h3 class="text-sm font-semibold text-red-800 mb-1">{{ errorDetails.title }}</h3>
                  <p class="text-sm text-red-700">{{ errorDetails.message }}</p>
                  <div v-if="errorDetails.code === 'DUPLICATE_EMAIL'" class="text-sm mt-2 text-gray-700">
                    Already have an account?
                    <router-link to="/login" class="text-emerald-700 font-semibold hover:underline">Sign in</router-link>
                    or use a different email address.
                  </div>
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

          <!-- Submit Button (Account Tab Only) -->
          <div v-if="activeTab === 'account'" class="space-y-4">
            <button
              type="submit"
              :disabled="isLoading || !validateAccountTab()"
              class="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
            >
              <!-- Animated Background -->
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-700 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              
              <!-- Button Content -->
              <div class="relative flex items-center justify-center">
                <div v-if="isLoading" class="flex items-center">
                  <!-- Multi-layer Loading Animation -->
                  <div class="relative mr-3">
                    <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <div class="absolute inset-0 animate-ping rounded-full h-5 w-5 bg-white opacity-20"></div>
                  </div>
                  <span class="animate-pulse">Creating Your Account...</span>
                </div>
                <div v-else class="flex items-center">
                  <svg class="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Create My FitServe Account</span>
                </div>
              </div>
              
              <!-- Ripple Effect -->
              <div class="absolute inset-0 overflow-hidden rounded-xl">
                <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </button>
            
            <!-- Progress Indicator -->
            <div class="flex items-center justify-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Join thousands of users tracking their nutrition journey</span>
            </div>
            
            <!-- Security Notice -->
            <div class="flex items-center justify-center text-xs text-gray-500 mt-4">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Your personal information is encrypted and secure</span>
            </div>
          </div>
          </form>
      </div>
    </div>
    
    <!-- Background Particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full animate-bounce" style="animation-delay: 0s; animation-duration: 4s;"></div>
      <div class="absolute top-1/4 right-12 w-6 h-6 bg-emerald-400/30 rounded-full animate-bounce" style="animation-delay: 1s; animation-duration: 5s;"></div>
      <div class="absolute bottom-1/3 left-12 w-4 h-4 bg-blue-400/20 rounded-full animate-bounce" style="animation-delay: 2s; animation-duration: 6s;"></div>
      <div class="absolute top-2/3 right-1/3 w-5 h-5 bg-purple-400/25 rounded-full animate-bounce" style="animation-delay: 0.5s; animation-duration: 4.5s;"></div>
      <div class="absolute bottom-8 right-8 w-3 h-3 bg-pink-400/30 rounded-full animate-bounce" style="animation-delay: 3s; animation-duration: 3.5s;"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RegisterForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const form = ref<RegisterForm>({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  height: null,
  weight: null,
  activityLevel: '',
  goal: '',
  targetWeight: null
})

const acceptTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const fieldErrors = ref<Record<string, string>>({})

// Tab management
const activeTab = ref('personal')
const tabs = [
  { id: 'personal', label: 'Personal Information', shortLabel: 'Personal' },
  { id: 'health', label: 'Health Profile', shortLabel: 'Health' },
  { id: 'goals', label: 'Goals & Targets', shortLabel: 'Goals' },
  { id: 'account', label: 'Account Setup', shortLabel: 'Account' }
]

// Computed properties
const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

// Friendly error mapping
const isDuplicateEmailError = (msg: unknown) => {
  const s = String(msg || '').toLowerCase()
  return (
    (s.includes('duplicate') && s.includes('email')) ||
    (s.includes('unique') && s.includes('email')) ||
    s.includes('users_email_key') ||
    s.includes('unique constraint failed:') && s.includes('email') ||
    s.includes('already exist') && s.includes('email') ||
    s.includes('e11000') && s.includes('email')
  )
}

const errorDetails = computed(() => {
  if (!error.value) return null
  const raw = String(error.value)
  if (isDuplicateEmailError(raw)) {
    return {
      code: 'DUPLICATE_EMAIL',
      title: 'Email already in use',
      message: 'An account with this email already exists. Try signing in or use a different email.'
    }
  }
  return {
    code: 'GENERIC',
    title: 'Registration Failed',
    message: raw
  }
})

// Max date for date of birth (18 years ago)
const maxDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 13) // Minimum age 13
  return date.toISOString().split('T')[0]
})

const passwordMismatch = computed(() => {
  return form.value.password !== '' && 
         form.value.confirmPassword !== '' && 
         form.value.password !== form.value.confirmPassword
})

// Show target weight field for goals that require it
const showTargetWeight = computed(() => {
  return ['lose_weight', 'gain_weight', 'build_muscle'].includes(form.value.goal)
})

const isFormValid = computed(() => {
  const baseValidation = form.value.email !== '' &&
         form.value.password !== '' &&
         form.value.confirmPassword !== '' &&
         form.value.firstName !== '' &&
         form.value.lastName !== '' &&
         form.value.dateOfBirth !== '' &&
         form.value.gender !== '' &&
         form.value.height !== null &&
         form.value.height >= 100 &&
         form.value.height <= 250 &&
         form.value.weight !== null &&
         form.value.weight >= 30 &&
         form.value.weight <= 300 &&
         form.value.activityLevel !== '' &&
         form.value.goal !== '' &&
         form.value.firstName.length <= 100 &&
         form.value.lastName.length <= 100 &&
         form.value.password === form.value.confirmPassword &&
         form.value.password.length >= 8 &&
         acceptTerms.value
  
  // If goal requires target weight, validate it
  if (showTargetWeight.value) {
    return baseValidation &&
           form.value.targetWeight !== null &&
           form.value.targetWeight >= 30 &&
           form.value.targetWeight <= 300
  }
  
  return baseValidation
})

// Tab validation methods
const validatePersonalTab = () => {
  const isValid = form.value.firstName.trim() !== '' &&
                  form.value.lastName.trim() !== '' &&
                  form.value.dateOfBirth !== '' &&
                  form.value.firstName.length <= 100 &&
                  form.value.lastName.length <= 100
  return isValid
}

const validateHealthTab = () => {
  return form.value.gender !== '' &&
         form.value.height !== null &&
         form.value.height >= 100 &&
         form.value.height <= 250 &&
         form.value.weight !== null &&
         form.value.weight >= 30 &&
         form.value.weight <= 300 &&
         form.value.activityLevel !== ''
}

const validateGoalsTab = () => {
  const baseValidation = form.value.goal !== ''
  if (showTargetWeight.value) {
    return baseValidation &&
           form.value.targetWeight !== null &&
           form.value.targetWeight >= 30 &&
           form.value.targetWeight <= 300
  }
  return baseValidation
}

const validateAccountTab = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return form.value.email !== '' &&
         emailRegex.test(form.value.email) &&
         form.value.password !== '' &&
         form.value.password.length >= 8 &&
         form.value.password === form.value.confirmPassword &&
         acceptTerms.value
}

// Tab completion status
const isTabCompleted = (tabId: string) => {
  switch (tabId) {
    case 'personal': return validatePersonalTab()
    case 'health': return validateHealthTab()
    case 'goals': return validateGoalsTab()
    case 'account': return validateAccountTab()
    default: return false
  }
}

// Tab accessibility
const isTabAccessible = (tabId: string) => {
  const tabIndex = tabs.findIndex(tab => tab.id === tabId)
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab.value)
  
  // Always allow access to current and previous tabs
  if (tabIndex <= currentIndex) return true
  
  // Allow access to next tab if current is completed
  if (tabIndex === currentIndex + 1) {
    return isTabCompleted(activeTab.value)
  }
  
  return false
}

// Can proceed to next tab
const canProceedToNextTab = computed(() => {
  return isTabCompleted(activeTab.value)
})

// Tab navigation methods
const switchTab = (tabId: string) => {
  if (isTabAccessible(tabId)) {
    activeTab.value = tabId
  }
}

const nextTab = () => {
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab.value)
  if (currentIndex < tabs.length - 1 && canProceedToNextTab.value) {
    activeTab.value = tabs[currentIndex + 1].id
  }
}

const previousTab = () => {
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab.value)
  if (currentIndex > 0) {
    activeTab.value = tabs[currentIndex - 1].id
  }
}

// Methods
const handleGoalChange = () => {
  // Clear target weight when switching to maintain_weight
  if (form.value.goal === 'maintain_weight') {
    form.value.targetWeight = null
  }
  // Auto-suggest target weight based on goal and current weight
  else if (form.value.weight && !form.value.targetWeight) {
    if (form.value.goal === 'lose_weight') {
      // Suggest 10% weight loss
      form.value.targetWeight = Math.round(form.value.weight * 0.9 * 10) / 10
    } else if (form.value.goal === 'gain_weight' || form.value.goal === 'build_muscle') {
      // Suggest 5-10% weight gain
      form.value.targetWeight = Math.round(form.value.weight * 1.05 * 10) / 10
    }
  }
}

// Enhanced validation methods
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    fieldErrors.value.email = 'Email is required'
    return false
  }
  if (!emailRegex.test(form.value.email)) {
    fieldErrors.value.email = 'Please enter a valid email address'
    return false
  }
  delete fieldErrors.value.email
  return true
}

const validatePassword = () => {
  if (!form.value.password) {
    fieldErrors.value.password = 'Password is required'
    return false
  }
  if (form.value.password.length < 8) {
    fieldErrors.value.password = 'Password must be at least 8 characters long'
    return false
  }
  delete fieldErrors.value.password
  return true
}

const validatePersonalInfo = () => {
  let isValid = true
  
  if (!form.value.firstName || form.value.firstName.trim() === '') {
    fieldErrors.value.firstName = 'First name is required'
    isValid = false
  } else if (form.value.firstName.length > 100) {
    fieldErrors.value.firstName = 'First name must be 100 characters or less'
    isValid = false
  } else {
    delete fieldErrors.value.firstName
  }
  
  if (!form.value.lastName || form.value.lastName.trim() === '') {
    fieldErrors.value.lastName = 'Last name is required'
    isValid = false
  } else if (form.value.lastName.length > 100) {
    fieldErrors.value.lastName = 'Last name must be 100 characters or less'
    isValid = false
  } else {
    delete fieldErrors.value.lastName
  }
  
  return isValid
}

const clearFieldError = (field: string) => {
  if (fieldErrors.value[field]) {
    delete fieldErrors.value[field]
  }
  if (error.value) {
    authStore.clearError()
  }
}

const handleRegister = async () => {
  // Only allow registration from the account tab
  if (activeTab.value !== 'account') {
    nextTab() // Move to next tab instead
    return
  }
  
  // Clear previous errors
  authStore.clearError()
  fieldErrors.value = {}
  
  // Validate all tabs
  if (!validatePersonalTab() || !validateHealthTab() || !validateGoalsTab() || !validateAccountTab()) {
    return
  }
  
  try {
    const result = await authStore.register(form.value)
    
    if (result.success) {
      // Show success message briefly before redirect
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    }
  } catch (err) {
    console.error('Registration error:', err)
  }
}

// Auto-suggest target weight based on current weight and goal
watch(() => [form.value.weight, form.value.goal], ([newWeight, newGoal]) => {
  if (newWeight && newGoal && !form.value.targetWeight) {
    if (newGoal === 'lose_weight') {
      // Suggest 10% weight loss
      form.value.targetWeight = Math.round(newWeight * 0.9 * 10) / 10
    } else if (newGoal === 'gain_weight' || newGoal === 'build_muscle') {
      // Suggest 5-10% weight gain
      form.value.targetWeight = Math.round(newWeight * 1.05 * 10) / 10
    }
  }
})

// Watch for password mismatch
watch(() => [form.value.password, form.value.confirmPassword], () => {
  if (fieldErrors.value.confirmPassword && !passwordMismatch.value) {
    delete fieldErrors.value.confirmPassword
  }
})

// Focus management
onMounted(() => {
  // Focus on first input
  const firstNameField = document.getElementById('firstName')
  if (firstNameField) {
    firstNameField.focus()
  }
})

// React to auth errors: bring user to Account tab and mark email on duplicate
watch(error, (val) => {
  if (!val) return
  if (isDuplicateEmailError(val)) {
    activeTab.value = 'account'
    fieldErrors.value.email = 'This email is already registered. Try signing in.'
    setTimeout(() => {
      const emailField = document.getElementById('email') as HTMLInputElement | null
      emailField?.focus()
      emailField?.select?.()
    }, 0)
  }
})

// Clear error when component unmounts
onUnmounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
/* Custom animations - matching login page */
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

@keyframes float-reverse {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(-0.5deg); }
  50% { transform: translateY(-20px) rotate(1deg); }
  75% { transform: translateY(-5px) rotate(0.5deg); }
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

.animate-float-reverse {
  animation: float-reverse 9s ease-in-out infinite 1s;
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

/* Form section transitions */
.form-section {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Step indicator animations */
.step-indicator {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-indicator:hover {
  transform: scale(1.05);
}

/* Input field enhancements */
.input-enhanced {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-enhanced:focus {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.15);
}

/* Custom select styling */
select {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

/* Loading spinner enhancement */
.spinner-enhanced {
  border-top-color: transparent;
  animation: spin 1s linear infinite, pulse 2s ease-in-out infinite alternate;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Progress bar animations */
.progress-animate {
  animation: progress-fill 2s ease-out;
}

@keyframes progress-fill {
  from { width: 0%; }
  to { width: var(--progress-width); }
}

/* Custom checkbox enhancements */
input[type="checkbox"] + div {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button hover effects */
.btn-gradient {
  background: linear-gradient(45deg, #10B981, #3B82F6, #8B5CF6);
  background-size: 300% 300%;
  animation: gradient-shift 6s ease infinite;
}

/* Responsive enhancements */
@media (max-width: 768px) {
  .form-section:hover {
    transform: none;
    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
  }
  
  .animate-float-slow,
  .animate-float-delayed,
  .animate-float-reverse {
    animation-duration: 12s;
  }
  
  .step-indicator:hover {
    transform: none;
  }
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

/* Custom focus styles */
.focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Smooth scrolling for long form */
html {
  scroll-behavior: smooth;
}

/* Enhanced form validation styles */
.validation-error {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
</style>
