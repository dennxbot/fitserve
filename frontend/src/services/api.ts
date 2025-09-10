import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { tokenUtils } from '@/lib/utils'
import type {
  User,
  LoginForm,
  RegisterForm,
  Food,
  FoodEntry,
  FoodSearchForm,
  FoodEntryForm,
  WeightEntry,
  NutritionGoals,
  DailyNutritionSummary,
  WeeklyNutritionSummary,
  ApiResponse,
  PaginatedResponse
} from '@/types'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken()
    // Always attach token if present; let the server validate it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if this is an auth-related endpoint
      // or if we get a specific "token expired" message
      const isAuthEndpoint = error.config?.url?.includes('/auth/') || error.config?.url?.includes('/users/me')
      const tokenExpiredMessage = error.response?.data?.message?.toLowerCase()
      
      if (isAuthEndpoint || 
          tokenExpiredMessage?.includes('token') || 
          tokenExpiredMessage?.includes('expired') || 
          tokenExpiredMessage?.includes('unauthorized')) {
        console.log('Auth token invalid/expired, clearing session')
        tokenUtils.removeToken()
        
        // Use router push instead of window.location to avoid full page reload
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (userData: RegisterForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/me')
    return response.data
  },

  updateProfile: async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/users/me', profileData)
    return response.data
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword })
    return response.data
  }
}

// Food API
export const foodApi = {
  searchFoods: async (searchForm: FoodSearchForm): Promise<ApiResponse<PaginatedResponse<Food>>> => {
    const params = new URLSearchParams()
    if (searchForm.query) params.append('q', searchForm.query)
    if (searchForm.barcode) params.append('barcode', searchForm.barcode)
    
    const response = await api.get(`/foods/search?${params.toString()}`)
    return response.data
  },

  getFoodById: async (id: string): Promise<ApiResponse<Food>> => {
    const response = await api.get(`/foods/${id}`)
    return response.data
  },

  createFood: async (foodData: Omit<Food, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Food>> => {
    const response = await api.post('/foods', foodData)
    return response.data
  },

  scanBarcode: async (barcode: string): Promise<ApiResponse<Food>> => {
    const response = await api.get(`/foods/barcode/${barcode}`)
    return response.data
  },

  searchByBarcode: async (barcode: string): Promise<ApiResponse<{ food: Food }>> => {
    const response = await api.get(`/foods/barcode/${barcode}`)
    return response.data
  },

  getFoodEntries: async (date?: string): Promise<ApiResponse<FoodEntry[]>> => {
    const params = date ? `?date=${date}` : ''
    const response = await api.get(`/foods/entries${params}`)
    return response.data
  },

  addFoodEntry: async (entryData: FoodEntryForm): Promise<ApiResponse<FoodEntry>> => {
    // Convert camelCase to snake_case for backend compatibility
    const backendData = {
      food_id: entryData.foodId,
      meal_type: entryData.mealType,
      quantity: entryData.quantity,
      unit: 'g', // Default unit as backend requires it
      date: entryData.consumedAt
    }
    
    const response = await api.post('/foods/log', backendData)
    return response.data
  },

  updateFoodEntry: async (id: string, entryData: Partial<FoodEntryForm>): Promise<ApiResponse<FoodEntry>> => {
    const response = await api.put(`/foods/entries/${id}`, entryData)
    return response.data
  },

  deleteFoodEntry: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/foods/entries/${id}`)
    return response.data
  }
}

// Progress API
export const progressApi = {
  getWeightEntries: async (startDate?: string, endDate?: string): Promise<ApiResponse<WeightEntry[]>> => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    const queryString = params.toString()
    const response = await api.get(`/users/me/weight${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  addWeightEntry: async (entryData: { weight: number; recordedAt: string }): Promise<ApiResponse<WeightEntry>> => {
    const response = await api.post('/users/me/weight', entryData)
    return response.data
  },

  updateWeightEntry: async (id: string, entryData: { weight: number; recordedAt?: string; notes?: string }): Promise<ApiResponse<WeightEntry>> => {
    const response = await api.put(`/users/me/weight/${id}`, entryData)
    return response.data
  },

  deleteWeightEntry: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/me/weight/${id}`)
    return response.data
  },

  getProgressStats: async (period: 'week' | 'month' | 'year'): Promise<ApiResponse<any>> => {
    // Use progress endpoint for progress-specific data
    const response = await api.get(`/users/me/progress?days=${period === 'week' ? 7 : period === 'month' ? 30 : 365}`)
    return response.data
  },

  getUserStats: async (): Promise<ApiResponse<any>> => {
    // Separate endpoint for comprehensive user statistics
    const response = await api.get('/users/me/stats')
    return response.data
  }
}

// Nutrition API
export const nutritionApi = {
  getNutritionGoals: async (): Promise<ApiResponse<NutritionGoals>> => {
    const response = await api.get('/users/me/goals')
    return response.data
  },

  updateNutritionGoals: async (goals: Partial<NutritionGoals>): Promise<ApiResponse<NutritionGoals>> => {
    const response = await api.put('/users/me/goals', goals)
    return response.data
  },

  getDailySummary: async (date: string): Promise<ApiResponse<DailyNutritionSummary>> => {
    const response = await api.get(`/foods/nutrition/daily/${date}`)
    return response.data
  },

  getWeeklySummary: async (startDate: string, endDate: string): Promise<ApiResponse<WeeklyNutritionSummary>> => {
    const response = await api.get(`/foods/nutrition/weekly?startDate=${startDate}&endDate=${endDate}`)
    return response.data
  },

  generateRecommendedGoals: async (): Promise<ApiResponse<NutritionGoals>> => {
    const response = await api.post('/users/me/goals/recommended')
    return response.data
  }
}

export default api