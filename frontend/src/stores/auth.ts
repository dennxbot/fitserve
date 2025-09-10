import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthState, LoginForm, RegisterForm } from '@/types'
import { authApi } from '@/services/api'
import { tokenUtils } from '@/lib/utils'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(tokenUtils.getToken())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const currentUser = computed(() => user.value)

  // Actions
  const login = async (credentials: LoginForm) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.login(credentials)
      
      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user
        tokenUtils.setToken(response.data.token)
        return { success: true }
      } else {
        error.value = response.message || 'Login failed'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterForm) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.register(userData)
      
      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user
        tokenUtils.setToken(response.data.token)
        return { success: true }
      } else {
        error.value = response.message || 'Registration failed'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      tokenUtils.removeToken()
    }
  }

  const fetchProfile = async () => {
    try {
      isLoading.value = true
      const response = await authApi.getProfile()
      
      if (response.success) {
        user.value = response.data.user
        return { success: true }
      } else {
        error.value = response.message || 'Failed to fetch profile'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch profile'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.updateProfile(profileData)
      
      if (response.success) {
        user.value = response.data.user
        return { success: true }
      } else {
        error.value = response.message || 'Failed to update profile'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update profile'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.forgotPassword(email)
      
      if (response.success) {
        return { success: true, message: 'Password reset email sent' }
      } else {
        error.value = response.message || 'Failed to send reset email'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to send reset email'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (token: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.resetPassword(token, password)
      
      if (response.success) {
        return { success: true, message: 'Password reset successfully' }
      } else {
        error.value = response.message || 'Failed to reset password'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to reset password'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.changePassword(currentPassword, newPassword)
      
      if (response.success) {
        return { success: true, message: 'Password changed successfully' }
      } else {
        error.value = response.message || 'Failed to change password'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to change password'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize auth state on store creation
  const initializeAuth = async () => {
    if (token.value) {
      try {
        const result = await fetchProfile()
        if (!result.success) {
          // If profile fetch fails, clear auth state
          console.warn('Failed to fetch profile on init, clearing auth state')
          user.value = null
          token.value = null
          tokenUtils.removeToken()
        }
      } catch (err) {
        console.error('Error during auth initialization:', err)
        // Clear auth state on error
        user.value = null
        token.value = null
        tokenUtils.removeToken()
      }
    }
  }

  // Validate token without making API calls
  const validateTokenFormat = (tokenString: string): boolean => {
    return tokenUtils.isValidToken(tokenString)
  }

  // Check if user should remain authenticated
  const checkAuthStatus = () => {
    const storedToken = tokenUtils.getToken()
    
    if (!storedToken || !validateTokenFormat(storedToken)) {
      // Clear invalid token
      user.value = null
      token.value = null
      tokenUtils.removeToken()
      return false
    }
    
    // Token format is valid, set it
    token.value = storedToken
    return true
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    clearError,
    initializeAuth,
    validateTokenFormat,
    checkAuthStatus
  }
})