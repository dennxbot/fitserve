import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NutritionGoals, DailyNutritionSummary } from '@/types'
import { nutritionApi } from '@/services/api'
import { useFoodStore } from './food'

export const useNutritionStore = defineStore('nutrition', () => {
  // State
  const nutritionGoals = ref<NutritionGoals | null>(null)
  const dailySummaries = ref<Record<string, DailyNutritionSummary>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Get food store for nutrition calculations
  const foodStore = useFoodStore()

  // Getters
  const goals = computed(() => nutritionGoals.value) // Alias for template compatibility
  const loading = computed(() => isLoading.value) // Alias for template compatibility
  
  const todaySummary = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    const cachedSummary = dailySummaries.value[today]
    
    // If we have a cached summary, use it
    if (cachedSummary) {
      return cachedSummary
    }
    
    // Otherwise, calculate from food entries
    const foodNutrition = foodStore.totalNutritionToday
    
    return {
      date: today,
      totalCalories: Math.round(foodNutrition.calories || 0),
      totalProtein: Math.round(foodNutrition.protein || 0),
      totalCarbs: Math.round(foodNutrition.carbs || 0),
      totalFat: Math.round(foodNutrition.fat || 0),
      totalFiber: Math.round(foodNutrition.fiber || 0),
      totalSodium: Math.round(foodNutrition.sodium || 0)
    }
  })

  const nutritionProgress = computed(() => {
    if (!nutritionGoals.value) {
      return {
        calories: { current: 0, goal: 0, percentage: 0 },
        protein: { current: 0, goal: 0, percentage: 0 },
        carbs: { current: 0, goal: 0, percentage: 0 },
        fat: { current: 0, goal: 0, percentage: 0 }
      }
    }

    const summary = todaySummary.value
    const goals = nutritionGoals.value

    return {
      calories: {
        current: Math.round(summary.totalCalories),
        goal: goals.dailyCalories,
        percentage: Math.round((summary.totalCalories / goals.dailyCalories) * 100)
      },
      protein: {
        current: Math.round(summary.totalProtein),
        goal: goals.dailyProtein,
        percentage: Math.round((summary.totalProtein / goals.dailyProtein) * 100)
      },
      carbs: {
        current: Math.round(summary.totalCarbs),
        goal: goals.dailyCarbs,
        percentage: Math.round((summary.totalCarbs / goals.dailyCarbs) * 100)
      },
      fat: {
        current: Math.round(summary.totalFat),
        goal: goals.dailyFat,
        percentage: Math.round((summary.totalFat / goals.dailyFat) * 100)
      }
    }
  })

  const remainingCalories = computed(() => {
    if (!nutritionGoals.value) return 2000
    const summary = todaySummary.value
    return Math.round(Math.max(0, nutritionGoals.value.dailyCalories - summary.totalCalories))
  })

  const isOverCalorieGoal = computed(() => {
    if (!nutritionGoals.value) return false
    const summary = todaySummary.value
    return summary.totalCalories > nutritionGoals.value.dailyCalories
  })

  const overallProgress = computed(() => {
    if (!nutritionGoals.value) return 0
    const summary = todaySummary.value
    const goals = nutritionGoals.value
    
    const calorieProgress = (summary.totalCalories / goals.dailyCalories) * 100
    const proteinProgress = (summary.totalProtein / goals.dailyProtein) * 100
    const carbsProgress = (summary.totalCarbs / goals.dailyCarbs) * 100
    const fatProgress = (summary.totalFat / goals.dailyFat) * 100
    
    return Math.round((calorieProgress + proteinProgress + carbsProgress + fatProgress) / 4)
  })

  const macroDistribution = computed(() => {
    const summary = todaySummary.value
    const totalCalories = summary.totalCalories

    if (totalCalories === 0) {
      return { protein: 0, carbs: 0, fat: 0 }
    }

    return {
      protein: Math.round((summary.totalProtein * 4 / totalCalories) * 100),
      carbs: Math.round((summary.totalCarbs * 4 / totalCalories) * 100),
      fat: Math.round((summary.totalFat * 9 / totalCalories) * 100)
    }
  })

  // Actions
  const getNutritionGoals = async () => {
    try {
      isLoading.value = true
      const response = await nutritionApi.getNutritionGoals()
      
      if (response.success) {
        nutritionGoals.value = response.data
        return { success: true }
      } else {
        error.value = response.message || 'Failed to fetch nutrition goals'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch nutrition goals'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateNutritionGoals = async (goals: Partial<NutritionGoals>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await nutritionApi.updateNutritionGoals(goals)
      
      if (response.success) {
        nutritionGoals.value = response.data
        return { success: true }
      } else {
        error.value = response.message || 'Failed to update nutrition goals'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update nutrition goals'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const getDailySummary = async (date: string) => {
    try {
      isLoading.value = true
      const response = await nutritionApi.getDailySummary(date)
      
      if (response.success) {
        // Map backend response format to frontend expected format
        const backendData = response.data
        const mappedData = {
          date: backendData.date,
          totalCalories: backendData.totalNutrition?.calories || 0,
          totalProtein: backendData.totalNutrition?.protein || 0,
          totalCarbs: backendData.totalNutrition?.carbs || 0,
          totalFat: backendData.totalNutrition?.fat || 0,
          totalFiber: backendData.totalNutrition?.fiber || 0,
          totalSodium: backendData.totalNutrition?.sodium || 0
        }
        
        dailySummaries.value[date] = mappedData
        return { success: true, data: mappedData }
      } else {
        error.value = response.message || 'Failed to fetch daily summary'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch daily summary'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const getWeeklySummary = async (startDate: string, endDate: string) => {
    try {
      isLoading.value = true
      const response = await nutritionApi.getWeeklySummary(startDate, endDate)
      
      if (response.success) {
        // Map backend response format and store each day's summary
        const mappedData = response.data.map((backendSummary: any) => ({
          date: backendSummary.date,
          totalCalories: backendSummary.totalNutrition?.calories || 0,
          totalProtein: backendSummary.totalNutrition?.protein || 0,
          totalCarbs: backendSummary.totalNutrition?.carbs || 0,
          totalFat: backendSummary.totalNutrition?.fat || 0,
          totalFiber: backendSummary.totalNutrition?.fiber || 0,
          totalSodium: backendSummary.totalNutrition?.sodium || 0
        }))
        
        mappedData.forEach((summary: DailyNutritionSummary) => {
          dailySummaries.value[summary.date] = summary
        })
        
        return { success: true, data: mappedData }
      } else {
        error.value = response.message || 'Failed to fetch weekly summary'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch weekly summary'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const calculateRecommendedGoals = (user: any) => {
    if (!user.weight || !user.height || !user.activityLevel || !user.fitnessGoal) {
      return null
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number
    if (user.gender === 'male') {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * (new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()) + 5
    } else {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * (new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()) - 161
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    }

    let tdee = bmr * activityMultipliers[user.activityLevel]

    // Adjust for fitness goal
    switch (user.fitnessGoal) {
      case 'lose_weight':
        tdee -= 500 // 1 lb per week deficit
        break
      case 'gain_weight':
      case 'build_muscle':
        tdee += 300 // Moderate surplus
        break
      // maintain_weight uses TDEE as is
    }

    // Calculate macros (40% carbs, 30% protein, 30% fat)
    const protein = Math.round((tdee * 0.30) / 4)
    const carbs = Math.round((tdee * 0.40) / 4)
    const fat = Math.round((tdee * 0.30) / 9)

    return {
      dailyCalories: Math.round(tdee),
      dailyProtein: protein,
      dailyCarbs: carbs,
      dailyFat: fat,
      dailyFiber: Math.round(tdee / 1000 * 14), // 14g per 1000 calories
      dailySodium: 2300 // WHO recommendation
    }
  }

  const generateRecommendedGoals = async (user: any) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await nutritionApi.generateRecommendedGoals()
      
      if (response.success && response.data) {
        // Update the goals state with the recommended values
        nutritionGoals.value = response.data
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Failed to generate recommended goals'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate recommended goals'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const refreshTodaySummary = async () => {
    const today = new Date().toISOString().split('T')[0]
    return await getDailySummary(today)
  }

  const clearError = () => {
    error.value = null
  }

  // Alias methods for compatibility
  const fetchGoals = getNutritionGoals
  const getGoals = getNutritionGoals
  const updateGoals = updateNutritionGoals // Alias for Goals.vue compatibility
  const getTodaySummary = async () => {
    const today = new Date().toISOString().split('T')[0]
    return await getDailySummary(today)
  }

  return {
    // State
    nutritionGoals,
    dailySummaries,
    isLoading,
    error,
    // Getters
    todaySummary,
    nutritionProgress,
    remainingCalories,
    isOverCalorieGoal,
    overallProgress,
    macroDistribution,
    // Actions
    getNutritionGoals,
    updateNutritionGoals,
    getDailySummary,
    getWeeklySummary,
    calculateRecommendedGoals,
    generateRecommendedGoals,
    refreshTodaySummary,
    clearError,
    // Aliases
    goals,
    loading,
    fetchGoals,
    getGoals,
    updateGoals,
    getTodaySummary
  }
})