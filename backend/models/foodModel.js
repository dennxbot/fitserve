const { supabase } = require('../config/supabaseClient');

class FoodModel {
  static tableName = 'foods';

  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.brand = data.brand;
    this.barcode = data.barcode;
    this.category = data.category;
    this.servingSize = data.serving_size || data.servingSize;
    this.servingUnit = data.serving_unit || data.servingUnit;
    this.calories = data.calories;
    this.protein = data.protein;
    this.carbs = data.carbs;
    this.fat = data.fat;
    this.fiber = data.fiber;
    this.sugar = data.sugar;
    this.sodium = data.sodium;
    this.cholesterol = data.cholesterol;
    this.saturatedFat = data.saturated_fat || data.saturatedFat;
    this.transFat = data.trans_fat || data.transFat;
    this.potassium = data.potassium;
    this.calcium = data.calcium;
    this.iron = data.iron;
    this.vitaminA = data.vitamin_a || data.vitaminA;
    this.vitaminC = data.vitamin_c || data.vitaminC;
    this.imageUrl = data.image_url || data.imageUrl;
    this.verified = data.verified || false;
    this.fdcId = data.fdc_id || data.fdcId;
    this.userId = data.user_id || data.userId;
    this.createdAt = data.created_at || data.createdAt;
    this.updatedAt = data.updated_at || data.updatedAt;
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 1) {
      errors.push('Food name is required');
    }

    if (!this.category || this.category.trim().length < 1) {
      errors.push('Food category is required');
    }

    if (!this.servingSize || this.servingSize <= 0) {
      errors.push('Valid serving size is required');
    }

    if (!this.servingUnit || this.servingUnit.trim().length < 1) {
      errors.push('Serving unit is required');
    }

    if (this.calories === undefined || this.calories < 0) {
      errors.push('Valid calories value is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toApiFormat() {
    return {
      id: this.id,
      name: this.name,
      brand: this.brand,
      barcode: this.barcode,
      category: this.category,
      servingSize: this.servingSize,
      servingUnit: this.servingUnit,
      calories: this.calories,
      protein: this.protein,
      carbs: this.carbs,
      fat: this.fat,
      fiber: this.fiber,
      sugar: this.sugar,
      sodium: this.sodium,
      cholesterol: this.cholesterol,
      saturatedFat: this.saturatedFat,
      transFat: this.transFat,
      potassium: this.potassium,
      calcium: this.calcium,
      iron: this.iron,
      vitaminA: this.vitaminA,
      vitaminC: this.vitaminC,
      imageUrl: this.imageUrl,
      verified: this.verified,
      fdcId: this.fdcId,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      name: this.name,
      brand: this.brand,
      barcode: this.barcode,
      category: this.category,
      serving_size: this.servingSize,
      serving_unit: this.servingUnit,
      calories: this.calories,
      protein: this.protein,
      carbs: this.carbs,
      fat: this.fat,
      fiber: this.fiber,
      sugar: this.sugar,
      sodium: this.sodium,
      cholesterol: this.cholesterol,
      saturated_fat: this.saturatedFat,
      trans_fat: this.transFat,
      potassium: this.potassium,
      calcium: this.calcium,
      iron: this.iron,
      vitamin_a: this.vitaminA,
      vitamin_c: this.vitaminC,
      image_url: this.imageUrl,
      verified: this.verified,
      fdc_id: this.fdcId,
      user_id: this.userId,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  static async create(foodData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(foodData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async search(query, options = {}) {
    const { limit = 20, offset = 0, category = null } = options;
    
    let queryBuilder = supabase
      .from(this.tableName)
      .select('*')
      .or(`name.ilike.%${query}%, brand.ilike.%${query}%, barcode.eq.${query}`)
      .range(offset, offset + limit - 1);

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data || [];
  }

  static async findByFdcId(fdcId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('fdc_id', fdcId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async getCategories() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('category')
      .not('category', 'is', null);

    if (error) throw error;
    
    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))].filter(Boolean);
    return categories;
  }
}

class FoodEntryModel {
  static tableName = 'food_entries';

  constructor(data = {}) {
    this.id = data.id;
    this.userId = data.user_id || data.userId;
    this.foodId = data.food_id || data.foodId;
    this.quantity = data.quantity;
    this.unit = data.unit;
    this.mealType = data.meal_type || data.mealType;
    this.consumedAt = data.consumed_at || data.consumedAt;
    this.notes = data.notes;
    this.createdAt = data.created_at || data.createdAt;
    this.food = data.food || data.foods;
  }

  validate() {
    const errors = [];

    if (!this.foodId) {
      errors.push('Food ID is required');
    }

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.quantity || this.quantity <= 0) {
      errors.push('Valid quantity is required');
    }

    if (!this.unit || this.unit.trim().length < 1) {
      errors.push('Unit is required');
    }

    if (!this.mealType || !['breakfast', 'lunch', 'dinner', 'snack'].includes(this.mealType)) {
      errors.push('Valid meal type is required (breakfast, lunch, dinner, snack)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toApiFormat() {
    // Ensure dates are in ISO format for frontend compatibility
    const formatDate = (date) => {
      if (!date) return date;
      if (typeof date === 'string' && date.includes('T')) return date; // Already ISO
      return new Date(date).toISOString();
    };

    return {
      id: this.id,
      userId: this.userId,
      foodId: this.foodId,
      quantity: this.quantity,
      unit: this.unit,
      mealType: this.mealType,
      consumedAt: formatDate(this.consumedAt),
      notes: this.notes,
      createdAt: formatDate(this.createdAt),
      food: this.food
    };
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      user_id: this.userId,
      food_id: this.foodId,
      quantity: this.quantity,
      unit: this.unit,
      meal_type: this.mealType,
      consumed_at: this.consumedAt,
      notes: this.notes,
      created_at: this.createdAt
    };
  }

  calculateNutrition() {
    if (!this.food || !this.quantity) return null;

    const multiplier = this.quantity / (this.food.serving_size || this.food.servingSize || 100);

    return {
      calories: Math.round((this.food.calories || 0) * multiplier),
      protein: Math.round((this.food.protein || 0) * multiplier * 10) / 10,
      carbs: Math.round((this.food.carbs || 0) * multiplier * 10) / 10,
      fat: Math.round((this.food.fat || 0) * multiplier * 10) / 10,
      fiber: Math.round((this.food.fiber || 0) * multiplier * 10) / 10,
      sugar: Math.round((this.food.sugar || 0) * multiplier * 10) / 10,
      sodium: Math.round((this.food.sodium || 0) * multiplier * 10) / 10
    };
  }

  static async create(entryData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(entryData)
      .select(`
        *,
        foods(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        *,
        foods(*)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByUserId(userId, options = {}) {
    const { 
      startDate = null, 
      endDate = null, 
      mealType = null, 
      limit = 50, 
      offset = 0 
    } = options;

    let queryBuilder = supabase
      .from(this.tableName)
      .select(`
        *,
        foods(*)
      `)
      .eq('user_id', userId)
      .order('consumed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (startDate) {
      queryBuilder = queryBuilder.gte('consumed_at', startDate);
    }

    if (endDate) {
      queryBuilder = queryBuilder.lte('consumed_at', endDate);
    }

    if (mealType) {
      queryBuilder = queryBuilder.eq('meal_type', mealType);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data || [];
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        foods(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async getDailyNutrition(userId, date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from(this.tableName)
      .select(`
        quantity,
        foods(
          calories,
          protein,
          carbs,
          fat,
          fiber,
          sugar,
          sodium,
          serving_size
        )
      `)
      .eq('user_id', userId)
      .gte('consumed_at', startDate.toISOString())
      .lte('consumed_at', endDate.toISOString());

    if (error) throw error;
    return data || [];
  }
}

module.exports = {
  FoodModel,
  FoodEntryModel
};