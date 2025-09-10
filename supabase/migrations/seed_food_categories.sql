-- Seed basic food categories for testing
-- This adds sample foods with common categories

INSERT INTO foods (
  name, 
  category, 
  serving_size, 
  serving_unit, 
  calories, 
  protein, 
  carbs, 
  fat, 
  verified
) VALUES 
  ('Apple', 'Fruits', 100, 'g', 52, 0.3, 14, 0.2, true),
  ('Banana', 'Fruits', 100, 'g', 89, 1.1, 23, 0.3, true),
  ('Orange', 'Fruits', 100, 'g', 47, 0.9, 12, 0.1, true),
  ('Broccoli', 'Vegetables', 100, 'g', 34, 2.8, 7, 0.4, true),
  ('Spinach', 'Vegetables', 100, 'g', 23, 2.9, 3.6, 0.4, true),
  ('Carrots', 'Vegetables', 100, 'g', 41, 0.9, 10, 0.2, true),
  ('Chicken Breast', 'Protein', 100, 'g', 165, 31, 0, 3.6, true),
  ('Salmon', 'Protein', 100, 'g', 208, 20, 0, 13, true),
  ('Eggs', 'Protein', 100, 'g', 155, 13, 1.1, 11, true),
  ('Brown Rice', 'Grains', 100, 'g', 111, 2.6, 23, 0.9, true),
  ('Quinoa', 'Grains', 100, 'g', 120, 4.4, 22, 1.9, true),
  ('Oats', 'Grains', 100, 'g', 389, 16.9, 66, 6.9, true),
  ('Almonds', 'Nuts', 100, 'g', 579, 21, 22, 50, true),
  ('Greek Yogurt', 'Dairy', 100, 'g', 59, 10, 3.6, 0.4, true),
  ('Milk', 'Dairy', 100, 'ml', 42, 3.4, 5, 1, true)
ON CONFLICT DO NOTHING;