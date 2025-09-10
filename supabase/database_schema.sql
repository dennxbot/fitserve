-- FitServe Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Users Table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  height DECIMAL(5,2), -- in cm
  weight DECIMAL(5,2), -- in kg
  activity_level VARCHAR(50),
  goal VARCHAR(50),
  target_weight DECIMAL(5,2),
  avatar_url TEXT,
  timezone VARCHAR(100) DEFAULT 'UTC',
  units VARCHAR(20) DEFAULT 'metric',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Preferences Table
CREATE TABLE user_preferences (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  notifications JSONB DEFAULT '{"mealReminders": true, "dailyGoals": true, "weeklyReports": false}',
  privacy JSONB DEFAULT '{"profilePublic": false, "shareProgress": false}',
  daily_goals JSONB DEFAULT '{"calories": null, "protein": null, "carbs": null, "fat": null, "fiber": null, "water": 8}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Foods Table
CREATE TABLE foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  barcode VARCHAR(50),
  category VARCHAR(100) NOT NULL,
  serving_size DECIMAL(10,2) NOT NULL,
  serving_unit VARCHAR(50) NOT NULL,
  calories DECIMAL(10,2) NOT NULL,
  protein DECIMAL(8,2) DEFAULT 0,
  carbs DECIMAL(8,2) DEFAULT 0,
  fat DECIMAL(8,2) DEFAULT 0,
  fiber DECIMAL(8,2) DEFAULT 0,
  sugar DECIMAL(8,2) DEFAULT 0,
  sodium DECIMAL(8,2) DEFAULT 0,
  cholesterol DECIMAL(8,2) DEFAULT 0,
  saturated_fat DECIMAL(8,2) DEFAULT 0,
  trans_fat DECIMAL(8,2) DEFAULT 0,
  potassium DECIMAL(8,2) DEFAULT 0,
  calcium DECIMAL(8,2) DEFAULT 0,
  iron DECIMAL(8,2) DEFAULT 0,
  vitamin_a DECIMAL(8,2) DEFAULT 0,
  vitamin_c DECIMAL(8,2) DEFAULT 0,
  image_url TEXT,
  verified BOOLEAN DEFAULT false,
  fdc_id VARCHAR(20), -- USDA FoodData Central ID
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Food Entries Table
CREATE TABLE food_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  food_id UUID REFERENCES foods(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  consumed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Weight Entries Table
CREATE TABLE weight_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_foods_name ON foods(name);
CREATE INDEX idx_foods_category ON foods(category);
CREATE INDEX idx_foods_barcode ON foods(barcode);
CREATE INDEX idx_foods_fdc_id ON foods(fdc_id);
CREATE INDEX idx_food_entries_user_id ON food_entries(user_id);
CREATE INDEX idx_food_entries_consumed_at ON food_entries(consumed_at);
CREATE INDEX idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX idx_weight_entries_recorded_at ON weight_entries(recorded_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can view and update their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- Foods policies (public read, authenticated users can create)
CREATE POLICY "Anyone can view foods" ON foods FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create foods" ON foods FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own foods" ON foods FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can delete own foods" ON foods FOR DELETE USING (auth.uid() = user_id);

-- Food entries policies (users can only access their own entries)
CREATE POLICY "Users can manage own food entries" ON food_entries FOR ALL USING (auth.uid() = user_id);

-- Weight entries policies (users can only access their own entries)
CREATE POLICY "Users can manage own weight entries" ON weight_entries FOR ALL USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_foods_updated_at BEFORE UPDATE ON foods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();