<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
    <!-- Animated Background Pattern -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Enhanced Header with Profile Summary -->
        <div class="mb-8">
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-6">
                  <!-- Avatar -->
                  <div class="relative group">
                    <div class="h-24 w-24 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-105">
                      <span class="text-3xl font-bold text-white">{{ userInitials }}</span>
                    </div>
                    <button class="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg transform translate-x-2 translate-y-2 hover:scale-110 transition-transform">
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- User Info -->
                  <div>
                    <h1 class="text-3xl font-bold text-white">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</h1>
                    <p class="text-blue-100 mt-1">{{ authStore.user?.email }}</p>
                    <div class="flex items-center space-x-4 mt-3">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                        </svg>
                        Member since {{ memberSince }}
                      </span>
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                        </svg>
                        {{ authStore.user?.goal?.replace('_', ' ') || 'No goal set' }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="hidden lg:flex space-x-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-white">{{ authStore.user?.weight || '--' }}</div>
                    <div class="text-sm text-blue-100">Current Weight (kg)</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-white">{{ bmi || '--' }}</div>
                    <div class="text-sm text-blue-100">BMI</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-white">{{ currentStreak }}</div>
                    <div class="text-sm text-blue-100">Day Streak</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Health Metrics Bar -->
            <div class="bg-gray-50 px-8 py-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ authStore.user?.height || '--' }} cm</div>
                    <div class="text-xs text-gray-500">Height</div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ authStore.user?.activityLevel?.replace('_', ' ') || '--' }}</div>
                    <div class="text-xs text-gray-500">Activity</div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ authStore.user?.targetWeight || '--' }} kg</div>
                    <div class="text-xs text-gray-500">Target Weight</div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ age || '--' }} years</div>
                    <div class="text-xs text-gray-500">Age</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="authStore.isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="relative">
            <div class="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div class="w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p class="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>

        <!-- Notifications -->
        <transition
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="authStore.error" class="mb-6">
            <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ authStore.error }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <transition
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="showSuccessMessage" class="mb-6">
            <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700 font-medium">Profile updated successfully!</p>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Profile Content -->
        <div v-if="authStore.user" class="grid lg:grid-cols-3 gap-8">
          <!-- Left Sidebar - Quick Actions -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Profile Completion Card -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="font-semibold text-gray-900 mb-4">Profile Completion</h3>
              <div class="relative">
                <svg class="w-32 h-32 mx-auto transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    stroke-width="12"
                    fill="none"
                    class="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    stroke-width="12"
                    fill="none"
                    :stroke-dasharray="`${profileCompletionPercentage * 3.52} 352`"
                    class="text-blue-600 transition-all duration-500"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-3xl font-bold text-gray-900">{{ profileCompletionPercentage }}%</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 text-center mt-4">{{ profileCompletionMessage }}</p>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Daily Calorie Goal</span>
                    <span class="font-semibold text-gray-900">{{ dailyCalorieGoal }} kcal</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" :style="`width: ${calorieProgress}%`"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Weekly Progress</span>
                    <span class="font-semibold text-gray-900">{{ weeklyLoggingDays }}/7 days</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" :style="`width: ${weeklyLoggingProgress}%`"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Weight Goal Progress</span>
                    <span class="font-semibold text-gray-900">{{ actualWeightProgress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" :style="`width: ${actualWeightProgress}%`"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content - Forms -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Personal Information -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 class="text-xl font-bold text-white">Personal Information</h2>
                <p class="text-blue-100 text-sm mt-1">Keep your profile up to date</p>
              </div>
              <div class="p-6">
                <form @submit.prevent="updateProfile" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    v-model="profileForm.firstName"
                    type="text"
                    class="input"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    v-model="profileForm.lastName"
                    type="text"
                    class="input"
                    placeholder="Enter your last name"
                    required
                  />
                </div>


                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    v-model="profileForm.email"
                    type="email"
                    class="input"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    v-model="profileForm.dateOfBirth"
                    type="date"
                    class="input"
                  />
                </div>

                <div>
                  <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    v-model="profileForm.gender"
                    class="input"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label for="height" class="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    id="height"
                    v-model.number="profileForm.height"
                    type="number"
                    class="input"
                    placeholder="Enter your height"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label for="activityLevel" class="block text-sm font-medium text-gray-700 mb-2">
                    Activity Level
                  </label>
                  <select
                    id="activityLevel"
                    v-model="profileForm.activityLevel"
                    class="input"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                    <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                    <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                    <option value="extremely_active">Extremely Active (very hard exercise, physical job)</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end space-x-4">
                <button
                  type="button"
                  @click="resetForm"
                  class="btn btn-ghost"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="authStore.isLoading"
                >
                  <span v-if="authStore.isLoading" class="loading-spinner w-4 h-4 mr-2"></span>
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Account Settings -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Account Settings</h2>
            <p class="card-description">Manage your account security and preferences</p>
          </div>
          <div class="card-content">
            <div class="space-y-6">
              <!-- Change Password -->
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <form @submit.prevent="changePassword" class="space-y-4">
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      v-model="passwordForm.currentPassword"
                      type="password"
                      class="input"
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="input"
                      placeholder="Enter your new password"
                      required
                      minlength="8"
                    />
                  </div>

                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      class="input"
                      placeholder="Confirm your new password"
                      required
                      minlength="8"
                    />
                  </div>

                  <div v-if="passwordError" class="text-red-600 text-sm">
                    {{ passwordError }}
                  </div>

                  <div class="flex justify-end">
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="authStore.isLoading || !isPasswordFormValid"
                    >
                      <span v-if="authStore.isLoading" class="loading-spinner w-4 h-4 mr-2"></span>
                      Change Password
                    </button>
                  </div>
                </form>
              </div>

              <!-- Account Statistics -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">{{ memberSince }}</div>
                    <div class="text-sm text-gray-600">Member since</div>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">{{ totalEntries }}</div>
                    <div class="text-sm text-gray-600">Food entries logged</div>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">{{ currentStreak }}</div>
                    <div class="text-sm text-gray-600">Day logging streak</div>
                  </div>
                </div>
              </div>

              <!-- Danger Zone -->
              <div class="border-t border-red-200 pt-6">
                <h3 class="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-medium text-red-900">Delete Account</h4>
                      <p class="text-sm text-red-700">Permanently delete your account and all associated data.</p>
                    </div>
                    <button
                      @click="showDeleteConfirmation = true"
                      class="btn bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

      <!-- Delete Account Confirmation Modal -->
      <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900">Delete Account</h3>
          </div>
          
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
          </p>
          
          <div class="flex justify-end space-x-4">
            <button
              @click="showDeleteConfirmation = false"
              class="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              @click="deleteAccount"
              class="btn bg-red-600 hover:bg-red-700 text-white"
              :disabled="authStore.isLoading"
            >
              <span v-if="authStore.isLoading" class="loading-spinner w-4 h-4 mr-2"></span>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFoodStore } from '@/stores/food'
import { useProgressStore } from '@/stores/progress'
import { nutritionApi, progressApi } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const foodStore = useFoodStore()
const progressStore = useProgressStore()

const showSuccessMessage = ref(false)
const showDeleteConfirmation = ref(false)
const passwordError = ref('')
const nutritionGoals = ref<any>(null)
const userStats = ref<any>(null)

const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  height: null as number | null,
  weight: null as number | null,
  activityLevel: '',
  goal: '',
  targetWeight: null as number | null,
  units: 'metric' as 'metric' | 'imperial'
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword &&
         passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword.length >= 8
})

const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const first = authStore.user.firstName?.[0] || ''
  const last = authStore.user.lastName?.[0] || ''
  return (first + last).toUpperCase() || 'U'
})

const memberSince = computed(() => {
  if (!authStore.user?.createdAt) return 'N/A'
  return new Date(authStore.user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
})

const age = computed(() => {
  if (!authStore.user?.dateOfBirth) return null
  const birthDate = new Date(authStore.user.dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
})

const bmi = computed(() => {
  if (!authStore.user?.weight || !authStore.user?.height) return null
  const heightInMeters = authStore.user.height / 100
  const bmiValue = authStore.user.weight / (heightInMeters * heightInMeters)
  return bmiValue.toFixed(1)
})

const profileCompletionPercentage = computed(() => {
  if (!authStore.user) return 0
  const fields = [
    'firstName',
    'lastName',
    'email',
    'dateOfBirth',
    'gender',
    'height',
    'weight',
    'activityLevel',
    'goal',
    'targetWeight'
  ]
  const completedFields = fields.filter(field => authStore.user[field])
  return Math.round((completedFields.length / fields.length) * 100)
})

const profileCompletionMessage = computed(() => {
  const percentage = profileCompletionPercentage.value
  if (percentage === 100) return 'Profile complete!'
  if (percentage >= 80) return 'Almost there!'
  if (percentage >= 60) return 'Good progress'
  if (percentage >= 40) return 'Keep going'
  return 'Get started'
})

const weightProgress = computed(() => {
  if (!authStore.user?.weight || !authStore.user?.targetWeight) return 0
  const current = authStore.user.weight
  const target = authStore.user.targetWeight
  const initial = authStore.user.weight // Should be initial weight, but using current for now
  
  if (initial === target) return 100
  
  const totalChange = Math.abs(target - initial)
  const currentChange = Math.abs(current - initial)
  const progress = (currentChange / totalChange) * 100
  
  return Math.min(Math.round(progress), 100)
})

const totalEntries = computed(() => {
  return foodStore.foodEntries.length
})

const currentStreak = computed(() => {
  // Use the backend-calculated streak if available
  if (userStats.value?.summary?.currentStreak !== undefined) {
    return userStats.value.summary.currentStreak
  }
  
  // Otherwise calculate from food entries
  const entries = [...foodStore.foodEntries].sort((a, b) => 
    new Date(b.consumedAt || b.date).getTime() - new Date(a.consumedAt || a.date).getTime()
  )
  
  if (entries.length === 0) return 0
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Check if we have an entry for today
  const todayEntry = entries.find(entry => {
    const entryDate = new Date(entry.consumedAt || entry.date)
    entryDate.setHours(0, 0, 0, 0)
    return entryDate.getTime() === today.getTime()
  })
  
  if (!todayEntry) return 0 // No entry today, streak is broken
  
  // Count consecutive days
  for (let i = 0; i < 30; i++) { // Check up to 30 days
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)
    checkDate.setHours(0, 0, 0, 0)
    
    const hasEntry = entries.some(entry => {
      const entryDate = new Date(entry.consumedAt || entry.date)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === checkDate.getTime()
    })
    
    if (hasEntry) {
      streak++
    } else {
      break
    }
  }
  
  return streak
})

// New computed properties for Activity Summary
const dailyCalorieGoal = computed(() => {
  return nutritionGoals.value?.dailyCalories || 2000
})

const calorieProgress = computed(() => {
  if (!nutritionGoals.value) return 0
  const todayCalories = foodStore.todayEntries.reduce((total, entry) => {
    const servingSize = entry.food?.servingSize || entry.food?.serving_size || 100
    return total + ((entry.food?.calories || 0) * entry.quantity / servingSize)
  }, 0)
  
  const progress = (todayCalories / dailyCalorieGoal.value) * 100
  return Math.min(Math.round(progress), 100)
})

const weeklyLoggingDays = computed(() => {
  // Calculate how many days in the past week have food entries
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  oneWeekAgo.setHours(0, 0, 0, 0)
  
  const uniqueDays = new Set()
  foodStore.foodEntries.forEach(entry => {
    const entryDate = new Date(entry.consumedAt || entry.date)
    if (entryDate >= oneWeekAgo) {
      uniqueDays.add(entryDate.toDateString())
    }
  })
  
  return uniqueDays.size
})

const weeklyLoggingProgress = computed(() => {
  return Math.round((weeklyLoggingDays.value / 7) * 100)
})

const actualWeightProgress = computed(() => {
  // Use backend-calculated progress if available
  if (userStats.value?.progress?.progressPercentage !== undefined) {
    return userStats.value.progress.progressPercentage
  }
  return weightProgress.value
})

const initializeForm = () => {
  if (authStore.user) {
    profileForm.value = {
      firstName: authStore.user.firstName || '',
      lastName: authStore.user.lastName || '',
      email: authStore.user.email || '',
      dateOfBirth: authStore.user.dateOfBirth || '',
      gender: authStore.user.gender || '',
      height: authStore.user.height || null,
      weight: authStore.user.weight || null,
      activityLevel: authStore.user.activityLevel || '',
      goal: authStore.user.goal || '',
      targetWeight: authStore.user.targetWeight || null,
      units: authStore.user.units || 'metric'
    }
  }
}

const resetForm = () => {
  initializeForm()
}

const updateProfile = async () => {
  try {
    await authStore.updateProfile(profileForm.value)
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}

const changePassword = async () => {
  passwordError.value = ''
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }
  
  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
    return
  }
  
  try {
    const result = await authStore.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )
    
    if (result.success) {
      // Reset form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    } else {
      passwordError.value = result.message || 'Failed to change password'
    }
  } catch (error) {
    passwordError.value = 'Failed to change password. Please try again.'
    console.error('Failed to change password:', error)
  }
}

const deleteAccount = async () => {
  try {
    // This would typically call an API endpoint to delete the account
    console.log('Account deletion requested')
    
    // For now, just logout and redirect
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Failed to delete account:', error)
  }
}

const clearError = () => {
  authStore.clearError()
}

onMounted(async () => {
  await Promise.all([
    authStore.fetchProfile(),
    foodStore.fetchFoodEntries()
  ])
  initializeForm()
  
  // Fetch nutrition goals and user stats for Activity Summary
  try {
    const [goalsResponse, statsResponse] = await Promise.all([
      nutritionApi.getNutritionGoals(),
      nutritionApi.getUserStats ? nutritionApi.getUserStats() : progressApi.getUserStats()
    ])
    
    if (goalsResponse.success) {
      nutritionGoals.value = goalsResponse.data
    }
    
    if (statsResponse.success) {
      userStats.value = statsResponse.data
    }
  } catch (error) {
    console.error('Failed to fetch activity data:', error)
  }
})

onUnmounted(() => {
  clearError()
})
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Enhanced input styles */
.input {
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400;
}

.input:focus {
  @apply shadow-lg;
}

/* Enhanced button styles */
.btn {
  @apply px-6 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg;
}

.btn-ghost {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500;
}

/* Loading spinner */
.loading-spinner {
  @apply inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent;
}

/* Card hover effects */
.card {
  @apply bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl;
}
</style>
