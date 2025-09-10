const { supabase, supabaseAdmin } = require('../config/supabaseClient');
const { UserModel } = require('../models/userModel');
const { calculateLoggingStreak, calculateWeeklyLoggingStats } = require('./streakCalculator');

class UserService {
  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }

      if (!data) {
        throw new Error('User not found');
      }

      return new UserModel(data).toApiFormat();
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User data
   */
  async getUserByEmail(email) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }

      if (!data) {
        throw new Error('User not found');
      }

      return new UserModel(data).toApiFormat();
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  /**
   * Create a new user profile
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    try {
      const user = new UserModel(userData);
      
      // Validate user data
      const validation = user.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Check if user with ID already exists (for auth-based creation)
      if (userData.id) {
        try {
          const existingUser = await this.getUserById(userData.id);
          console.log(`User with ID ${userData.id} already exists, returning existing user`);
          return existingUser;
        } catch (error) {
          if (!error.message.includes('User not found')) {
            throw error;
          }
          // User with this ID doesn't exist, continue with creation
        }
      }
      
      // For non-auth based creation, check email uniqueness
      if (!userData.id) {
        try {
          await this.getUserByEmail(user.email);
          throw new Error('User with this email already exists');
        } catch (error) {
          if (!error.message.includes('User not found')) {
            throw error;
          }
        }
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .insert(user.toDatabaseFormat())
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }

      // User created successfully

      return new UserModel(data).toApiFormat();
    } catch (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  /**
   * Create user specifically for auth fallback (bypasses some validations)
   * @param {Object} userData - User data from Supabase Auth
   * @returns {Promise<Object>} Created user
   */
  async createUserForAuth(userData) {
    try {
      const user = new UserModel(userData);
      
      // Basic validation
      if (!user.email || !user.firstName) {
        throw new Error('Email and firstName are required for auth user creation');
      }

      // Insert directly without email duplication check (since auth already validates)
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert(user.toDatabaseFormat())
        .select()
        .single();

      if (error) {
        // If it's a duplicate key error, try to get existing user
        if (error.message.includes('duplicate key') || error.code === '23505') {
          console.log(`User already exists in database, fetching by email: ${user.email}`);
          return await this.getUserByEmail(user.email);
        }
        throw new Error(`Failed to create auth user: ${error.message}`);
      }

      // User created successfully

      return new UserModel(data).toApiFormat();
    } catch (error) {
      throw new Error(`Auth user creation failed: ${error.message}`);
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updateData) {
    try {
      // Get existing user
      const existingUser = await this.getUserById(userId);
      
      // Create updated user model for validation
      const updatedUser = new UserModel({ 
        ...existingUser, 
        ...updateData, 
        updatedAt: new Date() 
      });

      const validation = updatedUser.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updatedUser.toDatabaseFormat())
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }

      return new UserModel(data).toApiFormat();
    } catch (error) {
      throw new Error(`User update failed: ${error.message}`);
    }
  }

  /**
   * Delete user account
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(userId) {
    try {
      // Soft delete - mark as inactive
      const { error } = await supabaseAdmin
        .from('users')
        .update({ 
          is_active: false, 
          updated_at: new Date() 
        })
        .eq('id', userId);

      if (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`User deletion failed: ${error.message}`);
    }
  }

  /**
   * Get user profile with calculated metrics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile with metrics
   */
  async getUserProfile(userId) {
    try {
      const user = await this.getUserById(userId);
      const userModel = new UserModel(user);
      
      // Calculate health metrics
      const profile = {
        ...user,
        metrics: {
          bmi: userModel.calculateBMI(),
          bmr: userModel.calculateBMR(),
          tdee: userModel.calculateTDEE()
        }
      };

      return profile;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  /**
   * Get daily nutrition goals for user (custom or calculated)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Nutrition goals in API format
   */
  async calculateNutritionGoals(userId) {
    try {
      // First, check if user has custom saved goals
      const { data: preferences, error: prefError } = await supabase
        .from('user_preferences')
        .select('daily_goals, created_at, updated_at')
        .eq('user_id', userId)
        .single();

      if (!prefError && preferences && preferences.daily_goals) {
        const goals = preferences.daily_goals;
        
        // Return saved custom goals in API format
        if (goals.calories && goals.protein && goals.carbs && goals.fat) {
          return {
            id: userId,
            userId: userId,
            dailyCalories: goals.calories,
            dailyProtein: goals.protein,
            dailyCarbs: goals.carbs,
            dailyFat: goals.fat,
            dailyFiber: goals.fiber || 25,
            dailySodium: goals.sodium || 2300,
            createdAt: preferences.created_at,
            updatedAt: preferences.updated_at
          };
        }
      }

      // If no custom goals, calculate based on user profile
      const user = await this.getUserById(userId);
      const userModel = new UserModel(user);
      
      const tdee = userModel.calculateTDEE();
      
      // If TDEE cannot be calculated due to incomplete profile, return default goals
      if (!tdee) {
        console.warn(`User ${userId} has incomplete profile, returning default nutrition goals`);
        const defaults = this.getDefaultNutritionGoals();
        return {
          id: userId,
          userId: userId,
          dailyCalories: defaults.calories,
          dailyProtein: defaults.protein,
          dailyCarbs: defaults.carbs,
          dailyFat: defaults.fat,
          dailyFiber: defaults.fiber,
          dailySodium: defaults.sodium || 2300,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      let calorieGoal = tdee;
      
      // Adjust calories based on goal
      if (user.goal === 'lose_weight') {
        calorieGoal = tdee - 500; // 1 lb per week loss
      } else if (user.goal === 'gain_weight') {
        calorieGoal = tdee + 500; // 1 lb per week gain
      }

      // Calculate macronutrient goals (general recommendations)
      const proteinGoal = user.weight ? Math.round(user.weight * 1.6) : 120; // Default 120g if no weight
      const fatGoal = Math.round(calorieGoal * 0.25 / 9); // 25% of calories from fat
      const carbsGoal = Math.round((calorieGoal - (proteinGoal * 4) - (fatGoal * 9)) / 4);

      // Return calculated goals in API format
      return {
        id: userId,
        userId: userId,
        dailyCalories: Math.max(calorieGoal, 1200), // Minimum 1200 calories
        dailyProtein: proteinGoal,
        dailyCarbs: Math.max(carbsGoal, 50), // Minimum 50g carbs
        dailyFat: fatGoal,
        dailyFiber: Math.round(calorieGoal / 1000 * 14), // 14g per 1000 calories
        dailySodium: 2300, // WHO recommendation
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Failed to get nutrition goals for user ${userId}:`, error.message);
      // Return default goals as fallback
      const defaults = this.getDefaultNutritionGoals();
      return {
        id: userId,
        userId: userId,
        dailyCalories: defaults.calories,
        dailyProtein: defaults.protein,
        dailyCarbs: defaults.carbs,
        dailyFat: defaults.fat,
        dailyFiber: defaults.fiber,
        dailySodium: 2300,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Get default nutrition goals for users with incomplete profiles
   * @returns {Object} Default nutrition goals
   */
  getDefaultNutritionGoals() {
    return {
      calories: 2000, // Standard daily calorie recommendation
      protein: 120,   // 120g protein (24% of calories)
      carbs: 250,     // 250g carbs (50% of calories)
      fat: 67,        // 67g fat (30% of calories)
      fiber: 25,      // 25g fiber
      water: 8        // 8 glasses of water
    };
  }

  /**
   * Update user's nutrition goals
   * @param {string} userId - User ID
   * @param {Object} goalsData - Nutrition goals data
   * @returns {Promise<Object>} Updated nutrition goals
   */
  async updateNutritionGoals(userId, goalsData) {
    try {
      const { dailyCalories, dailyProtein, dailyCarbs, dailyFat, dailyFiber, dailySodium } = goalsData;
      
      // Validate required fields
      if (!dailyCalories || dailyCalories < 800 || dailyCalories > 5000) {
        throw new Error('Daily calories must be between 800 and 5000');
      }
      if (!dailyProtein || dailyProtein < 10 || dailyProtein > 500) {
        throw new Error('Daily protein must be between 10g and 500g');
      }
      if (!dailyCarbs || dailyCarbs < 20 || dailyCarbs > 800) {
        throw new Error('Daily carbs must be between 20g and 800g');
      }
      if (!dailyFat || dailyFat < 10 || dailyFat > 300) {
        throw new Error('Daily fat must be between 10g and 300g');
      }

      // Prepare goals data
      const goals = {
        calories: dailyCalories,
        protein: dailyProtein,
        carbs: dailyCarbs,
        fat: dailyFat,
        fiber: dailyFiber || 25,
        sodium: dailySodium || 2300,
        water: 8 // Default water goal
      };

      // Update user preferences with new goals
      const { data, error } = await supabaseAdmin
        .from('user_preferences')
        .update({
          daily_goals: goals,
          updated_at: new Date()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        // If no preferences record exists, create one
        if (error.code === 'PGRST116') {
          const { data: newData, error: createError } = await supabaseAdmin
            .from('user_preferences')
            .insert({
              user_id: userId,
              daily_goals: goals,
              created_at: new Date(),
              updated_at: new Date()
            })
            .select()
            .single();

          if (createError) {
            throw new Error(`Failed to create nutrition goals: ${createError.message}`);
          }

          return {
            id: userId,
            userId: userId,
            dailyCalories: goals.calories,
            dailyProtein: goals.protein,
            dailyCarbs: goals.carbs,
            dailyFat: goals.fat,
            dailyFiber: goals.fiber,
            dailySodium: goals.sodium,
            createdAt: newData.created_at,
            updatedAt: newData.updated_at
          };
        }
        throw new Error(`Failed to update nutrition goals: ${error.message}`);
      }

      // Return formatted response
      return {
        id: userId,
        userId: userId,
        dailyCalories: goals.calories,
        dailyProtein: goals.protein,
        dailyCarbs: goals.carbs,
        dailyFat: goals.fat,
        dailyFiber: goals.fiber,
        dailySodium: goals.sodium,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      throw new Error(`Nutrition goals update failed: ${error.message}`);
    }
  }

  /**
   * Get user's progress data
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look back
   * @returns {Promise<Object>} Progress data
   */
  async getUserProgress(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // This would typically fetch weight entries, food logs, etc.
      // For now, we'll return a basic structure
      // Using supabaseAdmin to bypass RLS since we're already authenticated via middleware
      const { data: weightEntries, error } = await supabaseAdmin
        .from('weight_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch progress data: ${error.message}`);
      }

      const user = await this.getUserById(userId);
      
      // Calculate additional metrics to match frontend expectations
      const validEntries = (weightEntries || []).filter(entry => entry.weight && entry.recorded_at);
      
      // Weekly average
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklyEntries = validEntries.filter(entry => 
        new Date(entry.recorded_at) >= oneWeekAgo
      );
      const weeklyAverage = weeklyEntries.length > 0 ? 
        Math.round((weeklyEntries.reduce((sum, entry) => sum + entry.weight, 0) / weeklyEntries.length) * 10) / 10 : null;
      
      // Monthly average
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const monthlyEntries = validEntries.filter(entry => 
        new Date(entry.recorded_at) >= oneMonthAgo
      );
      const monthlyAverage = monthlyEntries.length > 0 ? 
        Math.round((monthlyEntries.reduce((sum, entry) => sum + entry.weight, 0) / monthlyEntries.length) * 10) / 10 : null;
      
      // Weight trend (recent change)
      let weightTrend = 0;
      if (validEntries.length >= 2) {
        const sortedEntries = validEntries.sort((a, b) => 
          new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
        );
        const latest = sortedEntries[sortedEntries.length - 1];
        const previous = sortedEntries[sortedEntries.length - 2];
        weightTrend = Math.round((latest.weight - previous.weight) * 10) / 10;
      }

      // For maintain_weight goal, target should be current weight
      const targetWeight = user.goal === 'maintain_weight' ? user.weight : user.targetWeight;
      
      // Calculate goal progress using computed targetWeight
      let progressPercentage = 0;
      if (targetWeight && weightEntries && weightEntries.length > 0) {
        // Get the earliest weight entry as start weight
        const sortedEntries = weightEntries.sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
        const startWeight = sortedEntries[0]?.weight || user.weight;
        const currentWeight = user.weight;
        
        if (startWeight !== targetWeight) {
          const totalChange = Math.abs(targetWeight - startWeight);
          const currentChange = Math.abs(currentWeight - startWeight);
          progressPercentage = Math.round((currentChange / totalChange) * 100);
        } else {
          progressPercentage = 100; // Already at goal
        }
      }
      
      return {
        currentWeight: user.weight,
        targetWeight: targetWeight,
        goalType: user.goal,
        weightEntries: weightEntries || [],
        progressPercentage: Math.min(progressPercentage, 100), // Cap at 100%
        daysTracked: days,
        // Additional metrics to match frontend
        weeklyAverage,
        monthlyAverage,
        weightTrend,
        totalEntries: validEntries.length
      };
    } catch (error) {
      throw new Error(`Failed to get user progress: ${error.message}`);
    }
  }

  /**
   * Record weight entry
   * @param {string} userId - User ID
   * @param {Object} weightData - Weight data object
   * @returns {Promise<Object>} Weight entry
   */
  async recordWeight(userId, weightData) {
    try {
      const { weight, recordedAt = new Date() } = weightData;
      
      if (!weight || weight <= 0) {
        throw new Error('Valid weight value is required');
      }

      const { data, error } = await supabaseAdmin
        .from('weight_entries')
        .insert({
          user_id: userId,
          weight,
          recorded_at: recordedAt,
          created_at: new Date()
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to record weight: ${error.message}`);
      }

      // Update user's current weight
      await this.updateUser(userId, { weight });

      // Convert to frontend-compatible format
      return {
        id: data.id,
        userId: data.user_id,
        weight: data.weight,
        recordedAt: data.recorded_at,
        createdAt: data.created_at,
        notes: data.notes
      };
    } catch (error) {
      throw new Error(`Weight recording failed: ${error.message}`);
    }
  }

  /**
   * Get weight entries for a user
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look back (default: 30)
   * @returns {Promise<Array>} Weight entries
   */
  async getWeightEntries(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Using supabaseAdmin to bypass RLS since we're already authenticated via middleware
      const { data, error } = await supabaseAdmin
        .from('weight_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch weight entries: ${error.message}`);
      }

      // Convert to frontend-compatible format
      return (data || []).map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        weight: entry.weight,
        recordedAt: entry.recorded_at,
        createdAt: entry.created_at,
        notes: entry.notes
      }));
    } catch (error) {
      throw new Error(`Failed to get weight entries: ${error.message}`);
    }
  }

  /**
   * Get comprehensive user statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats(userId) {
    try {
      const user = await this.getUserById(userId);
      const userModel = new UserModel(user);
      const goals = await this.calculateNutritionGoals(userId);
      const progress = await this.getUserProgress(userId, 30);

      // Get recent activity stats
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: foodLogs, error: foodError } = await supabaseAdmin
        .from('food_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('consumed_at', thirtyDaysAgo.toISOString());

      if (foodError) {
        console.warn('Failed to fetch food logs for stats:', foodError.message);
      }

      // Calculate actual streak
      const currentStreak = await calculateLoggingStreak(userId);
      const weeklyStats = await calculateWeeklyLoggingStats(userId);
      
      const stats = {
        profile: {
          bmi: userModel.calculateBMI(),
          bmr: userModel.calculateBMR(),
          tdee: userModel.calculateTDEE()
        },
        goals,
        progress: {
          ...progress,
          // Ensure we have latest weight data
          latestWeight: progress.weightEntries && progress.weightEntries.length > 0 ? 
            progress.weightEntries.sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0] : null
        },
        activity: {
          totalFoodLogs: foodLogs ? foodLogs.length : 0,
          averageLogsPerDay: foodLogs ? Math.round((foodLogs.length / 30) * 10) / 10 : 0,
          lastLoggedAt: foodLogs && foodLogs.length > 0 ? 
            new Date(Math.max(...foodLogs.map(log => new Date(log.consumed_at).getTime()))).toISOString() : null,
          weeklyStats: weeklyStats
        },
        summary: {
          joinedAt: user.createdAt,
          currentStreak: currentStreak,
          totalDaysTracked: progress.totalEntries || progress.weightEntries.length
        }
      };

      return stats;
    } catch (error) {
      throw new Error(`Failed to get user statistics: ${error.message}`);
    }
  }

  /**
   * Update weight entry
   * @param {string} userId - User ID
   * @param {string} entryId - Weight entry ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated weight entry
   */
  async updateWeightEntry(userId, entryId, updateData) {
    try {
      const { weight, recordedAt, notes } = updateData;
      
      if (!weight || weight <= 0) {
        throw new Error('Valid weight value is required');
      }

      // First, verify the entry belongs to this user
      // Using supabaseAdmin to bypass RLS
      const { data: existingEntry, error: fetchError } = await supabaseAdmin
        .from('weight_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to find weight entry: ${fetchError.message}`);
      }

      if (!existingEntry) {
        throw new Error('Weight entry not found or does not belong to this user');
      }

      // Build update payload with only supported columns
      const updatePayload = {
        weight
      };

      if (recordedAt) {
        updatePayload.recorded_at = recordedAt;
      }

      // Check if schema supports notes and updated_at columns
      try {
        // Test query to check if notes column exists
        await supabaseAdmin
          .from('weight_entries')
          .select('notes')
          .limit(0);
        
        // If no error, notes column exists
        if (notes !== undefined) {
          updatePayload.notes = notes;
        }
        updatePayload.updated_at = new Date();
      } catch (schemaError) {
        console.warn('Schema columns (notes, updated_at) not available:', schemaError.message);
        console.warn('Please run the database migration to enable full functionality.');
      }

      const { data, error } = await supabaseAdmin
        .from('weight_entries')
        .update(updatePayload)
        .eq('id', entryId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update weight entry: ${error.message}`);
      }

      // If this is the most recent entry, update user's current weight
      const { data: latestEntry } = await supabaseAdmin
        .from('weight_entries')
        .select('weight, recorded_at')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (latestEntry && latestEntry.weight === weight) {
        await this.updateUser(userId, { weight });
      }

      // Convert to frontend-compatible format
      return {
        id: data.id,
        userId: data.user_id,
        weight: data.weight,
        recordedAt: data.recorded_at,
        createdAt: data.created_at,
        notes: data.notes || null, // Graceful fallback if column doesn't exist
        updatedAt: data.updated_at || data.created_at // Fallback to created_at if updated_at doesn't exist
      };
    } catch (error) {
      throw new Error(`Weight entry update failed: ${error.message}`);
    }
  }

  /**
   * Delete weight entry
   * @param {string} userId - User ID
   * @param {string} entryId - Weight entry ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteWeightEntry(userId, entryId) {
    try {
      // First, verify the entry belongs to this user
      const { data: existingEntry, error: fetchError } = await supabaseAdmin
        .from('weight_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to find weight entry: ${fetchError.message}`);
      }

      if (!existingEntry) {
        throw new Error('Weight entry not found or does not belong to this user');
      }

      // Delete the entry
      const { error } = await supabaseAdmin
        .from('weight_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to delete weight entry: ${error.message}`);
      }

      // Update user's current weight to the most recent remaining entry
      const { data: latestEntry } = await supabaseAdmin
        .from('weight_entries')
        .select('weight')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestEntry) {
        await this.updateUser(userId, { weight: latestEntry.weight });
      }

      return true;
    } catch (error) {
      throw new Error(`Weight entry deletion failed: ${error.message}`);
    }
  }

  /**
   * Generate recommended nutrition goals based on user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Recommended nutrition goals
   */
  async generateRecommendedGoals(userId) {
    try {
      const user = await this.getUserById(userId);
      
      // Check if user has sufficient profile data
      if (!user.weight || !user.height || !user.gender || !user.dateOfBirth) {
        throw new Error('Profile incomplete. Please update your profile with weight, height, gender, and date of birth to generate recommendations.');
      }
      
      const userModel = new UserModel(user);
      
      // Calculate age
      const age = Math.floor((new Date() - new Date(user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
      
      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr;
      if (user.gender === 'male') {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * age + 5;
      } else {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * age - 161;
      }
      
      // Activity level multipliers
      const activityMultipliers = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        extra_active: 1.9
      };
      
      const activityLevel = user.activityLevel || 'moderately_active';
      let tdee = bmr * activityMultipliers[activityLevel];
      
      // Adjust for fitness goals
      const fitnessGoal = user.goal || user.fitnessGoal || 'maintain_weight';
      switch (fitnessGoal) {
        case 'lose_weight':
          tdee -= 500; // 500 calorie deficit for 1 lb/week loss
          break;
        case 'gain_weight':
        case 'build_muscle':
          tdee += 300; // 300 calorie surplus for gradual weight gain
          break;
        case 'maintain_weight':
        default:
          // Keep TDEE as calculated
          break;
      }
      
      // Ensure minimum calorie intake
      tdee = Math.max(tdee, 1200);
      
      // Calculate macronutrient distribution
      // Using evidence-based recommendations:
      // - Protein: 1.6-2.2g per kg body weight (we'll use 1.8g/kg)
      // - Fat: 20-35% of total calories (we'll use 25%)
      // - Carbs: Fill the remaining calories
      
      const proteinGoal = Math.round(user.weight * 1.8); // 1.8g per kg bodyweight
      const fatGoal = Math.round((tdee * 0.25) / 9); // 25% of calories from fat
      const carbsGoal = Math.round((tdee - (proteinGoal * 4) - (fatGoal * 9)) / 4);
      
      // Calculate fiber goal (14g per 1000 calories)
      const fiberGoal = Math.round((tdee / 1000) * 14);
      
      const recommendedGoals = {
        dailyCalories: Math.round(tdee),
        dailyProtein: proteinGoal,
        dailyCarbs: Math.max(carbsGoal, 50), // Minimum 50g carbs
        dailyFat: fatGoal,
        dailyFiber: Math.max(fiberGoal, 25), // Minimum 25g fiber
        dailySodium: 2300, // WHO recommendation
        metadata: {
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
          activityLevel: activityLevel,
          fitnessGoal: fitnessGoal,
          proteinPerKg: 1.8,
          fatPercentage: 25,
          calculatedAt: new Date().toISOString()
        }
      };
      
      return recommendedGoals;
    } catch (error) {
      throw new Error(`Failed to generate recommended goals: ${error.message}`);
    }
  }
}

module.exports = new UserService();
