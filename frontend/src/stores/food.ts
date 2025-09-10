import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Food, FoodEntry, FoodSearchForm, FoodEntryForm, PaginatedResponse } from '@/types'
import { foodApi } from '@/services/api'

export const useFoodStore = defineStore('food', () => {
  // State
  const foods = ref<Food[]>([])
  const foodEntries = ref<FoodEntry[]>([])
  const searchResults = ref<Food[]>([])
  const selectedFood = ref<Food | null>(null)
  const isLoading = ref(false)
  const isSearching = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // Getters
  const todayEntries = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return foodEntries.value.filter(entry => 
      entry.consumedAt && entry.consumedAt.startsWith(today)
    )
  })

  const entriesByMeal = computed(() => {
    const grouped: Record<string, FoodEntry[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    }
    
    todayEntries.value.forEach(entry => {
      grouped[entry.mealType].push(entry)
    })
    
    return grouped
  })

  const totalCaloriesToday = computed(() => {
    return todayEntries.value.reduce((total, entry) => {
      const servingSize = entry.food.servingSize || entry.food.serving_size || 100
      return total + (entry.food.calories * entry.quantity / servingSize)
    }, 0)
  })

  const totalNutritionToday = computed(() => {
    return todayEntries.value.reduce((totals, entry) => {
      const servingSize = entry.food?.servingSize || entry.food?.serving_size || 100
      
      if (!entry.food || !entry.quantity || !servingSize) {
        return totals
      }
      
      const multiplier = entry.quantity / servingSize
      const entryNutrition = {
        calories: (entry.food.calories || 0) * multiplier,
        protein: (entry.food.protein || 0) * multiplier,
        carbs: (entry.food.carbs || 0) * multiplier,
        fat: (entry.food.fat || 0) * multiplier,
        fiber: (entry.food.fiber || 0) * multiplier,
        sodium: (entry.food.sodium || 0) * multiplier
      }
      
      return {
        calories: totals.calories + entryNutrition.calories,
        protein: totals.protein + entryNutrition.protein,
        carbs: totals.carbs + entryNutrition.carbs,
        fat: totals.fat + entryNutrition.fat,
        fiber: totals.fiber + entryNutrition.fiber,
        sodium: totals.sodium + entryNutrition.sodium
      }
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0
    })
  })

  // Actions
  const searchFoods = async (searchForm: FoodSearchForm) => {
    try {
      isSearching.value = true
      error.value = null
      searchQuery.value = searchForm.query
      
      const response = await foodApi.searchFoods(searchForm)
      
      if (response.success) {
        searchResults.value = response.data
      // pagination.value = response.data.pagination // Backend doesn't return pagination data
        return { success: true }
      } else {
        error.value = response.message || 'Search failed'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Search failed'
      return { success: false, message: error.value }
    } finally {
      isSearching.value = false
    }
  }

  const getFoodById = async (id: string) => {
    try {
      isLoading.value = true
      const response = await foodApi.getFoodById(id)
      
      if (response.success) {
        selectedFood.value = response.data
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Failed to fetch food'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch food'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const createFood = async (foodData: Omit<Food, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await foodApi.createFood(foodData)
      
      if (response.success) {
        foods.value.push(response.data)
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Failed to create food'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create food'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const addFoodEntry = async (entryData: FoodEntryForm) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await foodApi.addFoodEntry(entryData)
      
      if (response.success) {
        foodEntries.value.push(response.data)
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Failed to add food entry'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add food entry'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateFoodEntry = async (id: string, entryData: Partial<FoodEntryForm>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await foodApi.updateFoodEntry(id, entryData)
      
      if (response.success) {
        const index = foodEntries.value.findIndex(entry => entry.id === id)
        if (index !== -1) {
          foodEntries.value[index] = response.data
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Failed to update food entry'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update food entry'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const searchByBarcode = async (barcode: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await foodApi.searchByBarcode(barcode)
      
      if (response.success) {
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Product not found'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search by barcode'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteFoodEntry = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await foodApi.deleteFoodEntry(id)
      
      if (response.success) {
        foodEntries.value = foodEntries.value.filter(entry => entry.id !== id)
        return { success: true }
      } else {
        error.value = response.message || 'Failed to delete food entry'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete food entry'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const getFoodEntries = async (date?: string) => {
    try {
      isLoading.value = true
      const response = await foodApi.getFoodEntries(date)
      
      if (response.success) {
        foodEntries.value = response.data
        return { success: true }
      } else {
        error.value = response.message || 'Failed to fetch food entries'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch food entries'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const scanBarcode = async (barcode: string) => {
    try {
      isSearching.value = true
      error.value = null
      
      const response = await foodApi.scanBarcode(barcode)
      
      if (response.success) {
        selectedFood.value = response.data
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Barcode not found'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Barcode scan failed'
      return { success: false, message: error.value }
    } finally {
      isSearching.value = false
    }
  }

  const clearSearchResults = () => {
    searchResults.value = []
    searchQuery.value = ''
    pagination.value = {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  }

  const clearSelectedFood = () => {
    selectedFood.value = null
  }

  const clearError = () => {
    error.value = null
  }

  // Fetch today's entries specifically
  const fetchTodayEntries = async () => {
    const today = new Date().toISOString().split('T')[0]
    return await getFoodEntries(today)
  }

  // Alias methods for compatibility
  const fetchFoodEntries = getFoodEntries

  return {
    // State
    foods,
    foodEntries,
    searchResults,
    selectedFood,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    isSearching,
    error,
    searchQuery,
    pagination,
    // Getters
    todayEntries,
    entriesByMeal,
    totalCaloriesToday,
    totalNutritionToday,
    // Actions
    searchFoods,
    getFoodById,
    createFood,
    addFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
    getFoodEntries,
    scanBarcode,
    searchByBarcode,
    clearSearchResults,
    clearSelectedFood,
    clearError,
    // Aliases
    fetchFoodEntries,
    fetchTodayEntries
  }
})