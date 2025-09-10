const axios = require('axios');
const { USDA_API_KEY, USDA_API_BASE_URL } = require('../config/env');
const { FoodModel } = require('../models/foodModel');

class USDAService {
  constructor() {
    this.apiKey = USDA_API_KEY;
    this.baseURL = USDA_API_BASE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Search foods using USDA FoodData Central API
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of food items
   */
  async searchFoods(query, options = {}) {
    try {
      const {
        pageSize = 25,
        pageNumber = 1,
        dataType = ['Foundation', 'SR Legacy', 'Branded'],
        sortBy = 'dataType.keyword',
        sortOrder = 'asc'
      } = options;

      if (!query || query.trim().length === 0) {
        throw new Error('Search query is required');
      }

      const params = {
        api_key: this.apiKey,
        query: query.trim()
      };

      // Only add optional parameters if they're different from defaults
      if (pageSize !== 50) {
        params.pageSize = Math.min(pageSize, 200);
      }
      
      if (pageNumber !== 1) {
        params.pageNumber = Math.max(pageNumber, 1);
      }

      console.log('USDA API Request:', {
        url: `${this.baseURL}/foods/search`,
        params
      });

      const response = await this.client.get('/foods/search', { params });

      if (!response.data || !response.data.foods) {
        return [];
      }

      // Transform USDA data to our food model format
      return response.data.foods.map(usdaFood => this.transformUSDAFood(usdaFood));
    } catch (error) {
      if (error.response) {
        throw new Error(`USDA API error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('USDA API request failed: No response received');
      } else {
        throw new Error(`USDA API error: ${error.message}`);
      }
    }
  }

  /**
   * Get detailed food information by FDC ID
   * @param {string} fdcId - FDC ID from USDA
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Detailed food item
   */
  async getFoodById(fdcId, options = {}) {
    try {
      const {
        nutrients = 'all',
        format = 'abridged'
      } = options;

      const params = {
        api_key: this.apiKey,
        nutrients,
        format
      };

      const response = await this.client.get(`/food/${fdcId}`, { params });

      if (!response.data) {
        throw new Error('Food not found');
      }

      return this.transformUSDAFood(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Food not found in USDA database');
      }
      if (error.response) {
        throw new Error(`USDA API error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('USDA API request failed: No response received');
      } else {
        throw new Error(`USDA API error: ${error.message}`);
      }
    }
  }

  /**
   * Get foods by multiple FDC IDs
   * @param {Array} fdcIds - Array of FDC IDs
   * @param {Object} options - Request options
   * @returns {Promise<Array>} Array of food items
   */
  async getFoodsByIds(fdcIds, options = {}) {
    try {
      if (!Array.isArray(fdcIds) || fdcIds.length === 0) {
        throw new Error('FDC IDs array is required');
      }

      if (fdcIds.length > 20) {
        throw new Error('Maximum 20 FDC IDs allowed per request');
      }

      const {
        nutrients = 'all',
        format = 'abridged'
      } = options;

      const requestBody = {
        fdcIds: fdcIds.map(id => parseInt(id)),
        nutrients,
        format
      };

      const response = await this.client.post('/foods', requestBody, {
        params: { api_key: this.apiKey }
      });

      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      return response.data.map(usdaFood => this.transformUSDAFood(usdaFood));
    } catch (error) {
      if (error.response) {
        throw new Error(`USDA API error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('USDA API request failed: No response received');
      } else {
        throw new Error(`USDA API error: ${error.message}`);
      }
    }
  }

  /**
   * Search food by barcode using USDA API
   * @param {string} barcode - Barcode to search for
   * @returns {Promise<Object|null>} Food item or null if not found
   */
  async searchFoodByBarcode(barcode) {
    try {
      if (!barcode || barcode.trim().length === 0) {
        throw new Error('Barcode is required');
      }

      // Search for foods with the specific GTIN/UPC (barcode)
      const params = {
        api_key: this.apiKey,
        query: barcode.trim(),
        dataType: ['Branded'], // Barcodes are typically on branded foods
        pageSize: 25
      };

      const response = await this.client.get('/foods/search', { params });

      if (!response.data || !response.data.foods || response.data.foods.length === 0) {
        return null;
      }

      // Find exact barcode match
      const exactMatch = response.data.foods.find(food => 
        food.gtinUpc === barcode || 
        (food.gtinUpc && food.gtinUpc.replace(/^0+/, '') === barcode.replace(/^0+/, ''))
      );

      if (exactMatch) {
        return this.transformUSDAFood(exactMatch);
      }

      // If no exact match, return the first result as it might be a partial match
      return this.transformUSDAFood(response.data.foods[0]);
    } catch (error) {
      if (error.response) {
        throw new Error(`USDA barcode search error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('USDA barcode search failed: No response received');
      } else {
        throw new Error(`USDA barcode search error: ${error.message}`);
      }
    }
  }

  /**
   * Get list of available data types
   * @returns {Promise<Array>} Array of data types
   */
  async getDataTypes() {
    try {
      const response = await this.client.get('/food/dataTypes', {
        params: { api_key: this.apiKey }
      });

      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to get data types: ${error.message}`);
    }
  }

  /**
   * Transform USDA food data to our food model format
   * @param {Object} usdaFood - USDA food object
   * @returns {Object} Transformed food object
   */
  transformUSDAFood(usdaFood) {
    try {
      // Extract basic information
      const foodData = {
        name: usdaFood.description || usdaFood.lowercaseDescription?.foodDescription || 'Unknown Food',
        brand: this.extractBrand(usdaFood),
        category: this.mapUSDACategory(usdaFood.foodCategory || usdaFood.brandedFoodCategory),
        servingSize: 100, // Default to 100g
        servingUnit: 'grams',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        cholesterol: 0,
        saturatedFat: 0,
        transFat: 0,
        potassium: 0,
        calcium: 0,
        iron: 0,
        vitaminA: 0,
        vitaminC: 0,
        verified: true, // USDA data is considered verified
        // Store USDA specific data
        fdcId: usdaFood.fdcId,
        dataType: usdaFood.dataType,
        gtinUpc: usdaFood.gtinUpc || null,
        publishedDate: usdaFood.publishedDate || null
      };

      // Extract serving size information for branded foods
      if (usdaFood.servingSize && usdaFood.servingSizeUnit) {
        foodData.servingSize = usdaFood.servingSize;
        foodData.servingUnit = usdaFood.servingSizeUnit.toLowerCase();
      } else if (usdaFood.householdServingFullText) {
        const servingInfo = this.parseServingSize(usdaFood.householdServingFullText);
        if (servingInfo.size) {
          foodData.servingSize = servingInfo.size;
          foodData.servingUnit = servingInfo.unit;
        }
      }

      // Extract nutrition information
      if (usdaFood.foodNutrients && Array.isArray(usdaFood.foodNutrients)) {
        this.extractNutrients(usdaFood.foodNutrients, foodData);
      }

      // Set barcode for branded foods
      if (usdaFood.gtinUpc) {
        foodData.barcode = usdaFood.gtinUpc;
      }

      return new FoodModel(foodData).toApiFormat();
    } catch (error) {
      console.error('Error transforming USDA food data:', error);
      // Return basic food object even if transformation fails
      return new FoodModel({
        name: usdaFood.description || 'Unknown Food',
        category: 'Other',
        servingSize: 100,
        servingUnit: 'grams',
        calories: 0,
        verified: true,
        fdcId: usdaFood.fdcId
      }).toApiFormat();
    }
  }

  /**
   * Extract brand information from USDA food data
   * @param {Object} usdaFood - USDA food object
   * @returns {string|null} Brand name
   */
  extractBrand(usdaFood) {
    if (usdaFood.brandOwner) {
      return usdaFood.brandOwner;
    }
    if (usdaFood.brandName) {
      return usdaFood.brandName;
    }
    if (usdaFood.brandedFoodCategory && usdaFood.description) {
      // Try to extract brand from description for branded foods
      const parts = usdaFood.description.split(',');
      if (parts.length > 1) {
        return parts[1].trim();
      }
    }
    return null;
  }

  /**
   * Map USDA category to our category system
   * @param {string} usdaCategory - USDA category
   * @returns {string} Mapped category
   */
  mapUSDACategory(usdaCategory) {
    if (!usdaCategory) return 'Other';

    const categoryMap = {
      'Dairy and Egg Products': 'Dairy',
      'Spices and Herbs': 'Seasonings',
      'Baby Foods': 'Baby Food',
      'Fats and Oils': 'Fats & Oils',
      'Poultry Products': 'Protein',
      'Soups, Sauces, and Gravies': 'Sauces',
      'Sausages and Luncheon Meats': 'Protein',
      'Breakfast Cereals': 'Grains',
      'Fruits and Fruit Juices': 'Fruits',
      'Pork Products': 'Protein',
      'Vegetables and Vegetable Products': 'Vegetables',
      'Nut and Seed Products': 'Nuts & Seeds',
      'Beef Products': 'Protein',
      'Beverages': 'Beverages',
      'Finfish and Shellfish Products': 'Seafood',
      'Legumes and Legume Products': 'Legumes',
      'Lamb, Veal, and Game Products': 'Protein',
      'Baked Products': 'Baked Goods',
      'Sweets': 'Desserts',
      'Cereal Grains and Pasta': 'Grains',
      'Fast Foods': 'Fast Food',
      'Meals, Entrees, and Side Dishes': 'Prepared Foods',
      'Snacks': 'Snacks'
    };

    return categoryMap[usdaCategory] || 'Other';
  }

  /**
   * Extract nutrient information from USDA food nutrients array
   * @param {Array} nutrients - Array of nutrient objects
   * @param {Object} foodData - Food data object to update
   */
  extractNutrients(nutrients, foodData) {
    const nutrientMap = {
      '208': 'calories', // Energy (kcal)
      '203': 'protein', // Protein
      '205': 'carbs', // Carbohydrate, by difference
      '204': 'fat', // Total lipid (fat)
      '291': 'fiber', // Fiber, total dietary
      '269': 'sugar', // Sugars, total including NLEA
      '307': 'sodium', // Sodium, Na
      '601': 'cholesterol', // Cholesterol
      '606': 'saturatedFat', // Fatty acids, total saturated
      '605': 'transFat', // Fatty acids, total trans
      '306': 'potassium', // Potassium, K
      '301': 'calcium', // Calcium, Ca
      '303': 'iron', // Iron, Fe
      '320': 'vitaminA', // Vitamin A, RAE
      '401': 'vitaminC' // Vitamin C, total ascorbic acid
    };

    nutrients.forEach(nutrient => {
      const nutrientNumber = nutrient.nutrientNumber;
      const amount = nutrient.value || nutrient.amount || 0;
      
      if (nutrientMap[nutrientNumber] && amount !== null && amount !== undefined && amount > 0) {
        foodData[nutrientMap[nutrientNumber]] = Math.round(amount * 100) / 100; // Round to 2 decimal places
      }
    });
  }

  /**
   * Parse serving size from text description
   * @param {string} servingText - Serving size text
   * @returns {Object} Parsed serving size
   */
  parseServingSize(servingText) {
    const result = { size: 100, unit: 'grams' };
    
    if (!servingText) return result;

    // Common patterns for serving sizes
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(g|grams?|gram)/i,
      /(\d+(?:\.\d+)?)\s*(oz|ounces?|ounce)/i,
      /(\d+(?:\.\d+)?)\s*(ml|milliliters?|milliliter)/i,
      /(\d+(?:\.\d+)?)\s*(cup|cups)/i,
      /(\d+(?:\.\d+)?)\s*(piece|pieces|item|items)/i,
      /(\d+(?:\.\d+)?)\s*(slice|slices)/i,
      /(\d+(?:\.\d+)?)\s*(tbsp|tablespoons?|tablespoon)/i,
      /(\d+(?:\.\d+)?)\s*(tsp|teaspoons?|teaspoon)/i
    ];

    for (const pattern of patterns) {
      const match = servingText.match(pattern);
      if (match) {
        result.size = parseFloat(match[1]);
        result.unit = match[2].toLowerCase();
        
        // Normalize units
        if (result.unit.includes('gram')) result.unit = 'grams';
        if (result.unit.includes('ounce')) result.unit = 'ounces';
        if (result.unit.includes('milliliter')) result.unit = 'ml';
        if (result.unit.includes('tablespoon')) result.unit = 'tbsp';
        if (result.unit.includes('teaspoon')) result.unit = 'tsp';
        
        break;
      }
    }

    return result;
  }

  /**
   * Check if USDA API is available
   * @returns {Promise<boolean>} API availability status
   */
  async checkAPIStatus() {
    try {
      await this.client.get('/food/dataTypes', {
        params: { api_key: this.apiKey },
        timeout: 5000
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new USDAService();