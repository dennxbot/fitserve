const { supabase } = require('../config/supabaseClient');

class UserModel {
  static tableName = 'users';

  constructor(data = {}) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.first_name || data.firstName;
    this.lastName = data.last_name || data.lastName;
    this.dateOfBirth = data.date_of_birth || data.dateOfBirth;
    this.gender = data.gender;
    this.height = data.height;
    this.weight = data.weight;
    this.activityLevel = data.activity_level || data.activityLevel;
    this.goal = data.goal;
    this.targetWeight = data.target_weight || data.targetWeight;
    this.avatarUrl = data.avatar_url || data.avatarUrl;
    this.timezone = data.timezone || 'UTC';
    this.units = data.units || 'metric';
    this.isActive = data.is_active !== undefined ? data.is_active : data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.created_at || data.createdAt;
    this.updatedAt = data.updated_at || data.updatedAt;
  }

  validate() {
    const errors = [];

    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push('Valid email is required');
    }

    if (!this.firstName || this.firstName.trim().length < 1) {
      errors.push('First name is required');
    }

    if (!this.lastName || this.lastName.trim().length < 1) {
      errors.push('Last name is required');
    }

    if (this.height && (this.height < 50 || this.height > 300)) {
      errors.push('Height must be between 50 and 300 cm');
    }

    if (this.weight && (this.weight < 20 || this.weight > 500)) {
      errors.push('Weight must be between 20 and 500 kg');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toApiFormat() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      height: this.height,
      weight: this.weight,
      activityLevel: this.activityLevel,
      goal: this.goal,
      targetWeight: this.targetWeight,
      avatarUrl: this.avatarUrl,
      timezone: this.timezone,
      units: this.units,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
      date_of_birth: this.dateOfBirth,
      gender: this.gender,
      height: this.height,
      weight: this.weight,
      activity_level: this.activityLevel,
      goal: this.goal,
      target_weight: this.targetWeight,
      avatar_url: this.avatarUrl,
      timezone: this.timezone,
      units: this.units,
      is_active: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  calculateBMI() {
    if (!this.height || !this.weight) return null;
    const heightInMeters = this.height / 100;
    return parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  calculateBMR() {
    if (!this.height || !this.weight || !this.dateOfBirth || !this.gender) return null;
    
    const age = new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
    
    if (this.gender === 'male') {
      return Math.round(88.362 + (13.397 * this.weight) + (4.799 * this.height) - (5.677 * age));
    } else {
      return Math.round(447.593 + (9.247 * this.weight) + (3.098 * this.height) - (4.330 * age));
    }
  }

  calculateTDEE() {
    const bmr = this.calculateBMR();
    if (!bmr || !this.activityLevel) return null;
    
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };
    
    return Math.round(bmr * (activityMultipliers[this.activityLevel] || 1.2));
  }

  static async create(userData) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(userData)
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

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
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
}

module.exports = {
  UserModel
};
