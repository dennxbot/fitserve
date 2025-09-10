// Temporarily simplified cn function without clsx dependency
export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ')
}

// Token management utilities
export const tokenUtils = {
  // Store token securely in localStorage
  setToken: (token: string): void => {
    try {
      localStorage.setItem('token', token)
    } catch (error) {
      console.error('Failed to store token:', error)
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    try {
      return localStorage.getItem('token')
    } catch (error) {
      console.error('Failed to retrieve token:', error)
      return null
    }
  },

  // Remove token from localStorage
  removeToken: (): void => {
    try {
      localStorage.removeItem('token')
    } catch (error) {
      console.error('Failed to remove token:', error)
    }
  },

  // Validate JWT token format and expiration
  isValidToken: (token: string): boolean => {
    if (!token) return false
    
    try {
      // Basic JWT format validation (3 parts separated by dots)
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      // Try to decode the payload to check if it's not expired
      const payload = JSON.parse(atob(parts[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      // Check if token has expiration and is not expired (with 30 second buffer)
      return payload.exp && payload.exp > (currentTime + 30)
    } catch (err) {
      console.error('Invalid token format:', err)
      return false
    }
  },

  // Get token expiration date
  getTokenExpiration: (token: string): Date | null => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      const payload = JSON.parse(atob(parts[1]))
      if (!payload.exp) return null
      
      return new Date(payload.exp * 1000)
    } catch (err) {
      console.error('Failed to get token expiration:', err)
      return null
    }
  },

  // Check if token will expire soon (within 5 minutes)
  isTokenExpiringSoon: (token: string): boolean => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return true
      
      const payload = JSON.parse(atob(parts[1]))
      if (!payload.exp) return true
      
      const currentTime = Math.floor(Date.now() / 1000)
      const expirationTime = payload.exp
      const fiveMinutesInSeconds = 5 * 60
      
      return (expirationTime - currentTime) < fiveMinutesInSeconds
    } catch (err) {
      console.error('Failed to check token expiration:', err)
      return true
    }
  }
}
