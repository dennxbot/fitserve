const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { supabase, supabaseAdmin } = require('../config/supabaseClient');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const userService = require('./userService');

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User and authentication data
   */
  async register(userData) {
    try {
      const { email, password, firstName, lastName, ...profileData } = userData;

      if (!email || !password || !firstName || !lastName) {
        throw new Error('Email, password, first name, and last name are required');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      // Validate additional required fields if provided
      if (profileData.height && (profileData.height < 100 || profileData.height > 250)) {
        throw new Error('Height must be between 100 and 250 cm');
      }
      
      if (profileData.weight && (profileData.weight < 30 || profileData.weight > 300)) {
        throw new Error('Weight must be between 30 and 300 kg');
      }
      
      if (profileData.dateOfBirth) {
        const birthDate = new Date(profileData.dateOfBirth)
        const age = new Date().getFullYear() - birthDate.getFullYear()
        if (age < 13) {
          throw new Error('You must be at least 13 years old to register');
        }
      }
      
      // Validate fitness goal
      const validGoals = ['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle'];
      if (profileData.goal && !validGoals.includes(profileData.goal)) {
        throw new Error('Invalid fitness goal selected');
      }
      
      // Validate target weight for goals that require it
      const goalsThatRequireTargetWeight = ['lose_weight', 'gain_weight', 'build_muscle'];
      if (profileData.goal && goalsThatRequireTargetWeight.includes(profileData.goal)) {
        if (!profileData.targetWeight || profileData.targetWeight <= 0) {
          throw new Error('Target weight is required for your selected fitness goal');
        }
        if (profileData.targetWeight < 30 || profileData.targetWeight > 300) {
          throw new Error('Target weight must be between 30 and 300 kg');
        }
      }

      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (authError) {
        throw new Error(`Registration failed: ${authError.message}`);
      }

      // Auto-confirm email using admin client to bypass email verification
      if (authData.user && !authData.user.email_confirmed_at) {
        const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
          authData.user.id,
          { email_confirm: true }
        );
        
        if (confirmError) {
          console.warn('Failed to auto-confirm email:', confirmError.message);
        }
      }

      // Create user profile
      const userProfile = await userService.createUser({
        id: authData.user.id,
        email,
        firstName,
        lastName,
        ...profileData
      });

      // Generate JWT token
      const token = this.generateToken(authData.user.id, email);

      return {
        user: userProfile,
        token,
        refreshToken: authData.session?.refresh_token,
        message: 'Registration successful. You can now log in.'
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User and authentication data
   */
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw new Error(`Login failed: ${authError.message}`);
      }

      // Get user profile, handle missing profiles gracefully
      let userProfile;
      try {
        userProfile = await userService.getUserById(authData.user.id);
      } catch (error) {
        if (error.message.includes('User not found')) {
          console.log(`User profile not found by ID for ${email}, trying by email...`);
          // Try to find user by email - if exists, use that profile
          try {
            userProfile = await userService.getUserByEmail(authData.user.email);
            console.log(`Found existing user by email: ${userProfile.email}`);
            // Use existing profile even if ID doesn't match
          } catch (emailError) {
            if (emailError.message.includes('User not found')) {
              console.log(`Creating new user profile for ${email}`);
              // Create user profile from Supabase Auth data
              const userData = {
                id: authData.user.id,
                email: authData.user.email,
                firstName: authData.user.user_metadata?.first_name || authData.user.email.split('@')[0],
                lastName: 'User'
              };
              userProfile = await userService.createUserForAuth(userData);
            } else {
              throw emailError;
            }
          }
        } else {
          throw error;
        }
      }

      if (!userProfile.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Generate JWT token using the actual user profile ID
      const token = this.generateToken(userProfile.id, email);

      return {
        user: userProfile,
        token,
        refreshToken: authData.session?.refresh_token,
        message: 'Login successful'
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Logout user
   * @param {string} token - JWT token
   * @returns {Promise<boolean>} Success status
   */
  async logout(token) {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(`Logout failed: ${error.message}`);
      }

      // In a production app, you might want to blacklist the JWT token
      // For now, we'll just return success
      return true;
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New authentication data
   */
  async refreshToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }

      const { data: authData, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) {
        throw new Error(`Token refresh failed: ${error.message}`);
      }

      // Generate new JWT token
      const token = this.generateToken(authData.user.id, authData.user.email);

      return {
        token,
        refreshToken: authData.session?.refresh_token,
        expiresAt: authData.session?.expires_at
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Forgot password - send reset email
   * @param {string} email - User email
   * @returns {Promise<boolean>} Success status
   */
  async forgotPassword(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw new Error(`Password reset failed: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async resetPassword(token, newPassword) {
    try {
      if (!token || !newPassword) {
        throw new Error('Reset token and new password are required');
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // This would typically be handled by Supabase's password reset flow
      // The actual implementation depends on how you handle the reset tokens
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(`Password reset failed: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  /**
   * Change password for logged-in user
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error('Current password and new password are required');
      }

      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      if (currentPassword === newPassword) {
        throw new Error('New password must be different from current password');
      }

      // Get user email for re-authentication
      const user = await userService.getUserById(userId);
      
      // Re-authenticate with current password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (authError) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw new Error(`Password change failed: ${updateError.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  /**
   * Verify email
   * @param {string} token - Verification token
   * @returns {Promise<boolean>} Success status
   */
  async verifyEmail(token) {
    try {
      if (!token) {
        throw new Error('Verification token is required');
      }

      // This would be handled by Supabase's email verification flow
      // The implementation depends on how verification tokens are processed
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) {
        throw new Error(`Email verification failed: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }

  /**
   * Resend email verification
   * @param {string} email - User email
   * @returns {Promise<boolean>} Success status
   */
  async resendVerification(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });

      if (error) {
        throw new Error(`Resend verification failed: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Resend verification failed: ${error.message}`);
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Decoded token data
   */
  async verifyToken(token) {
    try {
      if (!token) {
        throw new Error('Token is required');
      }

      // Remove 'Bearer ' prefix if present
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

      const decoded = jwt.verify(cleanToken, JWT_SECRET);
      
      // Check if user still exists and is active
      const user = await userService.getUserById(decoded.userId);
      if (!user.isActive) {
        throw new Error('User account is deactivated');
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        iat: decoded.iat,
        exp: decoded.exp
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else {
        throw new Error(`Token verification failed: ${error.message}`);
      }
    }
  }

  /**
   * Generate JWT token
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @returns {string} JWT token
   */
  generateToken(userId, email) {
    const payload = {
      userId,
      email,
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Generate secure random token
   * @param {number} length - Token length
   * @returns {string} Random token
   */
  generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Hash password
   * @param {string} password - Plain password
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} Match result
   */
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = new AuthService();