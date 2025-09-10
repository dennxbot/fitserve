import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeightEntry } from '@/types'
import { progressApi } from '@/services/api'

export const useProgressStore = defineStore('progress', () => {
  // State
  const weightEntries = ref<WeightEntry[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const latestWeight = computed(() => {
    if (weightEntries.value.length === 0) return null
    return weightEntries.value
      .filter(entry => entry.recordedAt) // Filter out entries without recordedAt
      .sort((a, b) => 
        new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      )[0] || null
  })

  const weightTrend = computed(() => {
    const validEntries = weightEntries.value.filter(entry => entry.recordedAt && entry.weight)
    if (validEntries.length < 2) return 0 // Return 0 instead of null for the UI
    
    const sorted = validEntries.sort((a, b) => 
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    )
    
    const latest = sorted[sorted.length - 1]
    const previous = sorted[sorted.length - 2]
    
    const change = latest.weight - previous.weight
    
    return Math.round(change * 10) / 10 // Return the actual weight change rounded to 1 decimal
  })

  const weightProgress = computed(() => {
    const validEntries = weightEntries.value.filter(entry => entry.recordedAt && entry.weight)
    if (validEntries.length < 2) return null
    
    const sorted = validEntries.sort((a, b) => 
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    )
    
    const startWeight = sorted[0].weight
    const currentWeight = sorted[sorted.length - 1].weight
    const totalChange = currentWeight - startWeight
    
    return {
      startWeight,
      currentWeight,
      totalChange,
      totalChangePercentage: (totalChange / startWeight) * 100
    }
  })

  const weeklyAverage = computed(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const recentEntries = weightEntries.value.filter(entry => 
      entry.recordedAt && entry.weight && new Date(entry.recordedAt) >= oneWeekAgo
    )
    
    if (recentEntries.length === 0) return null
    
    const total = recentEntries.reduce((sum, entry) => sum + entry.weight, 0)
    return Math.round((total / recentEntries.length) * 10) / 10
  })

  const monthlyAverage = computed(() => {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    
    const recentEntries = weightEntries.value.filter(entry => 
      entry.recordedAt && entry.weight && new Date(entry.recordedAt) >= oneMonthAgo
    )
    
    if (recentEntries.length === 0) return null
    
    const total = recentEntries.reduce((sum, entry) => sum + entry.weight, 0)
    return Math.round((total / recentEntries.length) * 10) / 10
  })

  const chartData = computed(() => {
    return weightEntries.value
      .filter(entry => entry.recordedAt) // Filter out entries without recordedAt
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
      .map(entry => ({
        date: entry.recordedAt ? entry.recordedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        weight: entry.weight || 0,
        timestamp: new Date(entry.recordedAt || new Date()).getTime()
      }))
  })

  const recentEntries = computed(() => {
    return weightEntries.value
      .filter(entry => entry.recordedAt) // Filter out entries without recordedAt
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
      .slice(0, 10)
      .map(entry => ({
        ...entry,
        date: entry.recordedAt // Add date field for easier template access
      }))
  })

  // Actions
  const getWeightEntries = async (startDate?: string, endDate?: string) => {
    try {
      isLoading.value = true
      const response = await progressApi.getWeightEntries(startDate, endDate)
      
      if (response.success) {
        weightEntries.value = response.data
        return { success: true }
      } else {
        error.value = response.message || 'Failed to fetch weight entries'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch weight entries'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const addWeightEntry = async (weightData: { weight: number; date?: string; notes?: string } | number, recordedAt?: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      let entryData: { weight: number; recordedAt: string; notes?: string }
      
      if (typeof weightData === 'object') {
        // Handle object parameter from Progress.vue
        entryData = {
          weight: weightData.weight,
          recordedAt: weightData.date ? new Date(weightData.date).toISOString() : new Date().toISOString(),
          notes: weightData.notes
        }
      } else {
        // Handle legacy number parameter
        entryData = {
          weight: weightData,
          recordedAt: recordedAt || new Date().toISOString()
        }
      }
      
      const response = await progressApi.addWeightEntry(entryData)
      
      if (response.success) {
        weightEntries.value.push(response.data)
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Failed to add weight entry'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add weight entry'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateWeightEntry = async (id: string, weightData: { weight: number; date?: string; notes?: string } | number, recordedAt?: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      let updateData: { weight: number; recordedAt?: string; notes?: string }
      
      if (typeof weightData === 'object') {
        // Handle object parameter from ProgressWeight.vue
        updateData = {
          weight: weightData.weight,
          notes: weightData.notes
        }
        if (weightData.date) {
          updateData.recordedAt = new Date(weightData.date).toISOString()
        }
      } else {
        // Handle legacy number parameter
        updateData = { weight: weightData }
        if (recordedAt) {
          updateData.recordedAt = recordedAt
        }
      }
      
      const response = await progressApi.updateWeightEntry(id, updateData)
      
      if (response.success) {
        const index = weightEntries.value.findIndex(entry => entry.id === id)
        if (index !== -1) {
          weightEntries.value[index] = response.data
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Failed to update weight entry'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update weight entry'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteWeightEntry = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await progressApi.deleteWeightEntry(id)
      
      if (response.success) {
        weightEntries.value = weightEntries.value.filter(entry => entry.id !== id)
        return { success: true }
      } else {
        error.value = response.message || 'Failed to delete weight entry'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete weight entry'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const getProgressStats = async (period: 'week' | 'month' | 'year' = 'month') => {
    try {
      isLoading.value = true
      const response = await progressApi.getProgressStats(period)
      
      if (response.success) {
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Failed to fetch progress stats'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch progress stats'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const getUserStats = async () => {
    try {
      isLoading.value = true
      const response = await progressApi.getUserStats()
      
      if (response.success) {
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Failed to fetch user stats'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user stats'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return null
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    
    let category = ''
    if (bmi < 18.5) category = 'Underweight'
    else if (bmi < 25) category = 'Normal weight'
    else if (bmi < 30) category = 'Overweight'
    else category = 'Obese'
    
    return {
      value: Math.round(bmi * 10) / 10,
      category
    }
  }

  const getWeightGoalProgress = (currentWeight: number, targetWeight: number, startWeight: number) => {
    if (!currentWeight || !targetWeight || !startWeight) return null
    
    const totalChange = targetWeight - startWeight
    const currentChange = currentWeight - startWeight
    const progress = (currentChange / totalChange) * 100
    
    return {
      progress: Math.min(100, Math.max(0, progress)),
      remaining: targetWeight - currentWeight,
      achieved: currentChange,
      total: totalChange
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Aliases for compatibility
  const fetchWeightEntries = getWeightEntries
  const loading = computed(() => isLoading.value) // Alias for template compatibility

  return {
    // State
    weightEntries,
    isLoading,
    loading,
    error,
    // Getters
    latestWeight,
    weightTrend,
    weightProgress,
    weeklyAverage,
    monthlyAverage,
    chartData,
    recentEntries,
    // Actions
    getWeightEntries,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    getProgressStats,
    getUserStats,
    calculateBMI,
    getWeightGoalProgress,
    clearError,
    // Aliases
    fetchWeightEntries
  }
})