// User types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  height?: number // in cm
  weight?: number // in kg
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle'
  targetWeight?: number // in kg
  avatarUrl?: string
  timezone?: string
  units?: 'metric' | 'imperial'
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  metrics?: {
    bmi?: number
    bmr?: number  
    tdee?: number
  }
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Food types
export interface Food {
  id: string
  name: string
  brand?: string
  barcode?: string
  servingSize: number
  servingUnit: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
  cholesterol?: number
  saturatedFat?: number
  transFat?: number
  potassium?: number
  calcium?: number
  iron?: number
  vitaminA?: number
  vitaminC?: number
  createdAt: string
  updatedAt: string
}

export interface FoodEntry {
  id: string
  userId: string
  foodId: string
  food: Food
  quantity: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  consumedAt: string
  createdAt: string
  updatedAt: string
}

export interface MealPlan {
  id: string
  userId: string
  name: string
  description?: string
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
  meals: MealPlanMeal[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MealPlanMeal {
  id: string
  mealPlanId: string
  foodId: string
  food: Food
  quantity: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  order: number
}

// Progress types
export interface WeightEntry {
  id: string
  userId: string
  weight: number
  recordedAt: string
  notes?: string
  createdAt: string
}

export interface NutritionGoals {
  id: string
  userId: string
  dailyCalories: number
  dailyProtein: number
  dailyCarbs: number
  dailyFat: number
  dailyFiber?: number
  dailySodium?: number
  createdAt: string
  updatedAt: string
}

export interface DailyNutritionSummary {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  totalFiber: number
  totalSodium: number
  goalCalories: number
  goalProtein: number
  goalCarbs: number
  goalFat: number
  entries: FoodEntry[]
}

export interface WeeklyNutritionSummary {
  startDate: string
  endDate: string
  totalNutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sugar: number
    sodium: number
  }
  dailyBreakdown: Record<string, {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sugar: number
    sodium: number
  }>
  mealBreakdown: {
    breakfast: {
      calories: number
      protein: number
      carbs: number
      fat: number
      fiber: number
      sugar: number
      sodium: number
    }
    lunch: {
      calories: number
      protein: number
      carbs: number
      fat: number
      fiber: number
      sugar: number
      sodium: number
    }
    dinner: {
      calories: number
      protein: number
      carbs: number
      fat: number
      fiber: number
      sugar: number
      sodium: number
    }
    snack: {
      calories: number
      protein: number
      carbs: number
      fat: number
      fiber: number
      sugar: number
      sodium: number
    }
  }
  entriesCount: number
}

// API types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | ''
  height: number | null
  weight: number | null
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | ''
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle' | ''
  targetWeight: number | null
}

export interface ProfileForm {
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  height?: number
  weight?: number
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active'
  fitnessGoal?: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle'
  targetWeight?: number
}

export interface FoodSearchForm {
  query: string
  barcode?: string
}

export interface FoodEntryForm {
  foodId: string
  quantity: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  consumedAt: string
}