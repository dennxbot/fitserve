const { supabase, supabaseAdmin } = require('../config/supabaseClient');
const { FoodModel, FoodEntryModel } = require('../models/foodModel');
const usdaService = require('./usdaService');

class FoodService {
  /**
   * Create a new food item
   * @param {Object} foodData - Food data
   * @param {string} userId - User ID creating the food (optional for admin)
   * @returns {Promise<Object>} Created food item
   */
  async createFood(foodData, userId = null) {
    try {
      const food = new FoodModel({ ...foodData, userId });
      
      // Validate food data
      const validation = food.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const { data, error } = await supabaseAdmin
        .from('foods')
        .insert(food.toDatabaseFormat())
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create food: ${error.message}`);
      }

      return new FoodModel(data).toApiFormat();
    } catch (error) {
      throw new Error(`Food creation failed: ${error.message}`);
    }
  }

  /**
   * Get food by ID
   * @param {string} foodId - Food ID
   * @returns {Promise<Object>} Food item
   */
  async getFoodById(foodId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('foods')
        .select('*')
        .eq('id', foodId);

      if (error) {
        throw new Error(`Failed to fetch food: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Food not found');
      }

      // Handle both single and array responses
      const foodData = Array.isArray(data) ? data[0] : data;
      return new FoodModel(foodData).toApiFormat();
    } catch (error) {
      throw new Error(`Failed to get food: ${error.message}`);
    }
  }

  /**
   * Search foods by name, brand, or barcode
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of food items
   */
  async searchFoods(query, options = {}) {
    try {
      const { 
        limit = 20, 
        offset = 0, 
        category = null,
        verified = null,
        userId = null,
        source = 'all' // 'local', 'usda', 'all'
      } = options;

      let localResults = [];
      let usdaResults = [];

      // Search local database if requested
      if (source === 'local' || source === 'all') {
        try {
          localResults = await this.searchLocalFoods(query, {
            limit: source === 'local' ? limit : Math.ceil(limit / 2),
            offset,
            category,
            verified,
            userId
          });
        } catch (error) {
          console.error('Local food search error:', error.message);
        }
      }

      // Search USDA database if requested and query is provided
      if ((source === 'usda' || source === 'all') && query && query.trim().length > 0) {
        try {
          usdaResults = await usdaService.searchFoods(query, {
            pageSize: source === 'usda' ? limit : Math.ceil(limit / 2),
            pageNumber: Math.ceil(offset / limit) + 1
          });

          // Filter USDA results by category if specified
          if (category) {
            usdaResults = usdaResults.filter(food => 
              food.category && food.category.toLowerCase().includes(category.toLowerCase())
            );
          }
        } catch (error) {
          console.error('USDA food search error:', error.message);
          // Continue with local results even if USDA fails
        }
      }

      // Combine and deduplicate results
      let combinedResults = [];
      
      if (source === 'local') {
        combinedResults = localResults;
      } else if (source === 'usda') {
        combinedResults = usdaResults;
      } else {
        // Merge results, prioritizing local foods
        combinedResults = [...localResults];
        
        // Add USDA results that don't duplicate local ones
        usdaResults.forEach(usdaFood => {
          const isDuplicate = localResults.some(localFood => 
            this.isDuplicateFood(localFood, usdaFood)
          );
          if (!isDuplicate) {
            combinedResults.push({
              ...usdaFood,
              source: 'usda',
              fdcId: usdaFood.fdcId
            });
          }
        });
      }

      // Apply final limit and return
      return combinedResults.slice(0, limit);
    } catch (error) {
      throw new Error(`Food search failed: ${error.message}`);
    }
  }

  /**
   * Search local foods database
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of local food items
   */
  async searchLocalFoods(query, options = {}) {
    try {
      const { 
        limit = 20, 
        offset = 0, 
        category = null,
        verified = null,
        userId = null 
      } = options;

      let queryBuilder = supabaseAdmin
        .from('foods')
        .select('*');

      // Search by name, brand, or barcode
      if (query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%,brand.ilike.%${query}%,barcode.eq.${query}`
        );
      }

      // Filter by category
      if (category) {
        queryBuilder = queryBuilder.eq('category', category);
      }

      // Filter by verified status
      if (verified !== null) {
        queryBuilder = queryBuilder.eq('verified', verified);
      }

      // Filter by user (for user-created foods)
      if (userId) {
        queryBuilder = queryBuilder.eq('user_id', userId);
      }

      // Add pagination
      queryBuilder = queryBuilder
        .range(offset, offset + limit - 1)
        .order('name', { ascending: true });

      const { data, error } = await queryBuilder;

      if (error) {
        throw new Error(`Search failed: ${error.message}`);
      }

      return data.map(food => ({
        ...new FoodModel(food).toApiFormat(),
        source: 'local'
      }));
    } catch (error) {
      throw new Error(`Local food search failed: ${error.message}`);
    }
  }

  /**
   * Update food item
   * @param {string} foodId - Food ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User ID (for permission check)
   * @returns {Promise<Object>} Updated food item
   */
  async updateFood(foodId, updateData, userId = null) {
    try {
      // First check if food exists and user has permission
      const { data: existingFood, error: fetchError } = await supabase
        .from('foods')
        .select('user_id')
        .eq('id', foodId)
        .single();

      if (fetchError) {
        throw new Error(`Food not found: ${fetchError.message}`);
      }

      // Check permission (user can only update their own foods, unless admin)
      if (userId && existingFood.user_id && existingFood.user_id !== userId) {
        throw new Error('Permission denied: You can only update your own food items');
      }

      // Create updated food model for validation
      const updatedFood = new FoodModel({ 
        ...existingFood, 
        ...updateData, 
        updatedAt: new Date() 
      });

      const validation = updatedFood.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const { data, error } = await supabaseAdmin
        .from('foods')
        .update(updatedFood.toDatabaseFormat())
        .eq('id', foodId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update food: ${error.message}`);
      }

      return new FoodModel(data).toApiFormat();
    } catch (error) {
      throw new Error(`Food update failed: ${error.message}`);
    }
  }

  /**
   * Delete food item
   * @param {string} foodId - Food ID
   * @param {string} userId - User ID (for permission check)
   * @returns {Promise<boolean>} Success status
   */
  async deleteFood(foodId, userId = null) {
    try {
      // Check if food exists and user has permission
      const { data: existingFood, error: fetchError } = await supabaseAdmin
        .from('foods')
        .select('user_id')
        .eq('id', foodId);

      if (fetchError) {
        throw new Error(`Food not found: ${fetchError.message}`);
      }

      if (!existingFood || (Array.isArray(existingFood) && existingFood.length === 0)) {
        throw new Error('Food not found');
      }

      const food = Array.isArray(existingFood) ? existingFood[0] : existingFood;

      // Check permission
      if (userId && food.user_id && food.user_id !== userId) {
        throw new Error('Permission denied: You can only delete your own food items');
      }

      const { error } = await supabaseAdmin
        .from('foods')
        .delete()
        .eq('id', foodId);

      if (error) {
        throw new Error(`Failed to delete food: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Food deletion failed: ${error.message}`);
    }
  }

  /**
   * Log food consumption
   * @param {Object} entryData - Food entry data
   * @returns {Promise<Object>} Created food entry
   */
  async logFoodConsumption(entryData) {
    try {
      const foodEntry = new FoodEntryModel(entryData);
      
      // Validate entry data
      const validation = foodEntry.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Verify food exists
      const food = await this.getFoodById(foodEntry.foodId);
      if (!food) {
        throw new Error('Food not found');
      }

      const { data, error } = await supabaseAdmin
        .from('food_entries')
        .insert(foodEntry.toDatabaseFormat())
        .select(`
          *,
          foods (
            name,
            brand,
            calories,
            protein,
            carbs,
            fat,
            serving_size,
            serving_unit
          )
        `)
        .single();

      if (error) {
        throw new Error(`Failed to log food consumption: ${error.message}`);
      }

      return {
        ...new FoodEntryModel(data).toApiFormat(),
        food: data.foods
      };
    } catch (error) {
      throw new Error(`Food logging failed: ${error.message}`);
    }
  }

  /**
   * Get user's food entries for a specific date range
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of food entries
   */
  async getUserFoodEntries(userId, options = {}) {
    try {
      const { 
        date = null,  // Add support for single date parameter
        startDate = null,
        endDate = null,
        mealType = null,
        limit = 50,
        offset = 0
      } = options;

      let queryBuilder = supabaseAdmin
        .from('food_entries')
        .select(`
          *,
          foods (
            name,
            brand,
            calories,
            protein,
            carbs,
            fat,
            serving_size,
            serving_unit,
            image_url
          )
        `)
        .eq('user_id', userId);

      // Support single date parameter for exact date match
      if (date) {
        // For a single date, query for entries from start of day to end of day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        queryBuilder = queryBuilder
          .gte('consumed_at', startOfDay.toISOString())
          .lte('consumed_at', endOfDay.toISOString());
      } else {
        // Support date range
        if (startDate) {
          queryBuilder = queryBuilder.gte('consumed_at', startDate);
        }

        if (endDate) {
          queryBuilder = queryBuilder.lte('consumed_at', endDate);
        }
      }

      if (mealType) {
        queryBuilder = queryBuilder.eq('meal_type', mealType);
      }

      queryBuilder = queryBuilder
        .order('consumed_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error } = await queryBuilder;

      if (error) {
        throw new Error(`Failed to fetch food entries: ${error.message}`);
      }

      return data.map(entry => ({
        ...new FoodEntryModel(entry).toApiFormat(),
        food: entry.foods
      }));
    } catch (error) {
      throw new Error(`Failed to get user food entries: ${error.message}`);
    }
  }

  /**
   * Delete food entry
   * @param {string} entryId - Food entry ID
   * @param {string} userId - User ID (for permission check)
   * @returns {Promise<boolean>} Success status
   */
  async deleteFoodEntry(entryId, userId) {
    try {
      // Check if entry exists and user has permission
      const { data: existingEntry, error: fetchError } = await supabaseAdmin
        .from('food_entries')
        .select('user_id')
        .eq('id', entryId);

      if (fetchError) {
        throw new Error(`Food entry not found: ${fetchError.message}`);
      }

      if (!existingEntry || existingEntry.length === 0) {
        throw new Error('Food entry not found');
      }

      const entry = Array.isArray(existingEntry) ? existingEntry[0] : existingEntry;

      // Check permission
      if (entry.user_id !== userId) {
        throw new Error('Permission denied: You can only delete your own food entries');
      }

      const { error } = await supabaseAdmin
        .from('food_entries')
        .delete()
        .eq('id', entryId);

      if (error) {
        throw new Error(`Failed to delete food entry: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Food entry deletion failed: ${error.message}`);
    }
  }

  /**
   * Get nutrition summary for a user on a specific date
   * @param {string} userId - User ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object>} Nutrition summary
   */
  async getDailyNutritionSummary(userId, date) {
    try {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      const entries = await this.getUserFoodEntries(userId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      let totalNutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      };

      let mealBreakdown = {
        breakfast: { ...totalNutrition },
        lunch: { ...totalNutrition },
        dinner: { ...totalNutrition },
        snack: { ...totalNutrition }
      };

      entries.forEach(entry => {
        const food = entry.food;
        const multiplier = entry.quantity / food.serving_size;

        // Calculate nutrition for this entry
        const entryNutrition = {
          calories: (food.calories || 0) * multiplier,
          protein: (food.protein || 0) * multiplier,
          carbs: (food.carbs || 0) * multiplier,
          fat: (food.fat || 0) * multiplier,
          fiber: (food.fiber || 0) * multiplier,
          sugar: (food.sugar || 0) * multiplier,
          sodium: (food.sodium || 0) * multiplier
        };

        // Add to total
        Object.keys(totalNutrition).forEach(key => {
          totalNutrition[key] += entryNutrition[key];
          mealBreakdown[entry.mealType][key] += entryNutrition[key];
        });
      });

      // Round values
      Object.keys(totalNutrition).forEach(key => {
        totalNutrition[key] = Math.round(totalNutrition[key] * 10) / 10;
      });

      Object.keys(mealBreakdown).forEach(meal => {
        Object.keys(mealBreakdown[meal]).forEach(key => {
          mealBreakdown[meal][key] = Math.round(mealBreakdown[meal][key] * 10) / 10;
        });
      });

      return {
        date,
        totalNutrition,
        mealBreakdown,
        entriesCount: entries.length
      };
    } catch (error) {
      throw new Error(`Failed to get daily nutrition summary: ${error.message}`);
    }
  }

  /**
   * Get weekly nutrition summary for a user
   * @param {string} userId - User ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Weekly nutrition summary
   */
  async getWeeklyNutritionSummary(userId, startDateStr, endDateStr) {
    try {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      // Set endDate to end of day
      endDate.setHours(23, 59, 59, 999);

      // Fetch entries between startDate and endDate inclusive
      const entries = await this.getUserFoodEntries(userId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      // Initialize nutrition template
      const createNutritionObject = () => ({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      });

      let totalNutrition = createNutritionObject();
      let dailyBreakdown = {};
      let mealBreakdown = {
        breakfast: createNutritionObject(),
        lunch: createNutritionObject(),
        dinner: createNutritionObject(),
        snack: createNutritionObject()
      };

      entries.forEach(entry => {
        const food = entry.food;
        if (!food || !food.serving_size) {
          console.warn(`Invalid food data for entry ${entry.id}`);
          return;
        }

        const multiplier = entry.quantity / (food.serving_size || 100);
        const entryDate = new Date(entry.consumed_at || entry.consumedAt).toISOString().split('T')[0];

        // Initialize daily breakdown if not exists
        if (!dailyBreakdown[entryDate]) {
          dailyBreakdown[entryDate] = createNutritionObject();
        }

        // Calculate nutrition for this entry
        const entryNutrition = {
          calories: (food.calories || 0) * multiplier,
          protein: (food.protein || 0) * multiplier,
          carbs: (food.carbs || 0) * multiplier,
          fat: (food.fat || 0) * multiplier,
          fiber: (food.fiber || 0) * multiplier,
          sugar: (food.sugar || 0) * multiplier,
          sodium: (food.sodium || 0) * multiplier
        };

        // Add to totals
        Object.keys(totalNutrition).forEach(key => {
          totalNutrition[key] += entryNutrition[key];
          dailyBreakdown[entryDate][key] += entryNutrition[key];
          if (mealBreakdown[entry.mealType]) {
            mealBreakdown[entry.mealType][key] += entryNutrition[key];
          }
        });
      });

      // Round values
      Object.keys(totalNutrition).forEach(key => {
        totalNutrition[key] = Math.round(totalNutrition[key] * 10) / 10;
      });

      Object.keys(dailyBreakdown).forEach(date => {
        Object.keys(dailyBreakdown[date]).forEach(key => {
          dailyBreakdown[date][key] = Math.round(dailyBreakdown[date][key] * 10) / 10;
        });
      });

      Object.keys(mealBreakdown).forEach(meal => {
        Object.keys(mealBreakdown[meal]).forEach(key => {
          mealBreakdown[meal][key] = Math.round(mealBreakdown[meal][key] * 10) / 10;
        });
      });

      return {
        startDate: startDateStr,
        endDate: endDateStr,
        totalNutrition,
        dailyBreakdown,
        mealBreakdown,
        entriesCount: entries.length
      };
    } catch (error) {
      throw new Error(`Failed to get weekly nutrition summary: ${error.message}`);
    }
  }

  /**
   * Search USDA foods and optionally import to local database
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of USDA food items
   */
  async searchUSDAFoods(query, options = {}) {
    try {
      const {
        pageSize = 25,
        pageNumber = 1,
        dataType = ['Foundation', 'SR Legacy', 'Branded'],
        autoImport = false,
        userId = null
      } = options;

      const foods = await usdaService.searchFoods(query, {
        pageSize,
        pageNumber,
        dataType
      });

      // Auto-import to local database if requested
      if (autoImport && foods.length > 0) {
        const importedFoods = [];
        for (const food of foods.slice(0, 5)) { // Limit auto-import to 5 items
          try {
            const imported = await this.importUSDAFood(food.fdcId, userId);
            importedFoods.push(imported);
          } catch (error) {
            console.error(`Failed to import food ${food.fdcId}:`, error.message);
          }
        }
        return importedFoods;
      }

      return foods;
    } catch (error) {
      throw new Error(`USDA food search failed: ${error.message}`);
    }
  }

  /**
   * Search food by barcode
   * @param {string} barcode - Barcode to search for
   * @returns {Promise<Object|null>} Food item or null if not found
   */
  async searchFoodByBarcode(barcode) {
    try {
      console.log(`Searching for barcode: ${barcode}`);
      
      // First, search in local database
      const { data: localFood, error: localError } = await supabaseAdmin
        .from('foods')
        .select('*')
        .eq('barcode', barcode);

      if (localError) {
        console.error('Local database search error:', localError);
      }

      if (localFood && !localError) {
        const foodData = Array.isArray(localFood) && localFood.length > 0 ? localFood[0] : localFood;
        if (foodData) {
          console.log('Found in local database:', foodData.name);
          return new FoodModel(foodData).toApiFormat();
        }
      }

      console.log('Not found in local database, searching USDA...');
      
      // If not found locally, search USDA database
      try {
        const usdaFood = await usdaService.searchFoodByBarcode(barcode);
        if (usdaFood) {
          console.log('Found in USDA database:', usdaFood.name);
          // Make sure all nutrition data is included
          return {
            ...usdaFood,
            source: 'usda',
            barcode: barcode
          };
        } else {
          console.log('Not found in USDA database');
        }
      } catch (usdaError) {
        console.error('USDA barcode search error:', usdaError.message);
        console.error('Full error:', usdaError);
        // Return a more informative error to help debug
        throw new Error(`USDA search failed: ${usdaError.message}`);
      }

      console.log('Barcode not found in any database');
      return null;
    } catch (error) {
      console.error('Barcode search failed:', error);
      throw new Error(`Barcode search failed: ${error.message}`);
    }
  }

  /**
   * Get detailed USDA food by FDC ID
   * @param {string} fdcId - USDA FDC ID
   * @returns {Promise<Object>} Detailed food item
   */
  async getUSDAFood(fdcId) {
    try {
      return await usdaService.getFoodById(fdcId);
    } catch (error) {
      throw new Error(`Failed to get USDA food: ${error.message}`);
    }
  }

  /**
   * Import USDA food to local database
   * @param {string} fdcId - USDA FDC ID
   * @param {string} userId - User ID importing the food
   * @returns {Promise<Object>} Imported food item
   */
  async importUSDAFood(fdcId, userId = null) {
    try {
      // Get detailed food data from USDA
      const usdaFood = await usdaService.getFoodById(fdcId);

      // Check if already exists in local database
      const { data: existingFood } = await supabaseAdmin
        .from('foods')
        .select('id')
        .eq('fdc_id', fdcId);

      if (existingFood && existingFood.length > 0) {
        const food = Array.isArray(existingFood) ? existingFood[0] : existingFood;
        return await this.getFoodById(food.id);
      }

      // Prepare food data for local database
      const foodData = {
        ...usdaFood,
        userId,
        fdcId: fdcId,
        verified: true, // USDA data is considered verified
        source: 'usda'
      };

      // Create food in local database
      return await this.createFood(foodData, userId);
    } catch (error) {
      throw new Error(`Failed to import USDA food: ${error.message}`);
    }
  }

  /**
   * Check if two foods are duplicates
   * @param {Object} food1 - First food object
   * @param {Object} food2 - Second food object
   * @returns {boolean} True if foods are duplicates
   */
  isDuplicateFood(food1, food2) {
    // Check for exact name match
    if (food1.name.toLowerCase() === food2.name.toLowerCase()) {
      return true;
    }

    // Check for barcode match
    if (food1.barcode && food2.barcode && food1.barcode === food2.barcode) {
      return true;
    }

    // Check for similar names with same brand
    if (food1.brand && food2.brand && 
        food1.brand.toLowerCase() === food2.brand.toLowerCase()) {
      const similarity = this.calculateStringSimilarity(
        food1.name.toLowerCase(), 
        food2.name.toLowerCase()
      );
      if (similarity > 0.8) {
        return true;
      }
    }

    return false;
  }

  /**
   * Calculate string similarity using Levenshtein distance
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} Similarity score (0-1)
   */
  calculateStringSimilarity(str1, str2) {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : 1 - matrix[len2][len1] / maxLen;
  }

  /**
   * Get food categories
   * @returns {Promise<Array>} Array of food categories
   */
  async getFoodCategories() {
    try {
      const { data, error } = await supabaseAdmin
        .from('foods')
        .select('category')
        .not('category', 'is', null)
        .order('category');

      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      // Get unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))]
        .filter(category => category && category.trim() !== '')
        .sort();

      return uniqueCategories;
    } catch (error) {
      throw new Error(`Failed to get food categories: ${error.message}`);
    }
  }

  /**
   * Get USDA API status
   * @returns {Promise<Object>} API status information
   */
  async getUSDAAPIStatus() {
    try {
      const isAvailable = await usdaService.checkAPIStatus();
      return {
        available: isAvailable,
        message: isAvailable ? 'USDA API is available' : 'USDA API is not available'
      };
    } catch (error) {
      return {
        available: false,
        message: `USDA API check failed: ${error.message}`
      };
    }
  }
}

module.exports = new FoodService();