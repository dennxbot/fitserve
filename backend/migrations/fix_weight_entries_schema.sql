-- Migration: Add missing columns to weight_entries table
-- Created: 2025-09-05
-- Purpose: Fix schema issue with notes and updated_at columns

-- Add notes column if it doesn't exist
ALTER TABLE weight_entries 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add updated_at column if it doesn't exist
ALTER TABLE weight_entries 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create or replace function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_weight_entries_updated_at ON weight_entries;
CREATE TRIGGER update_weight_entries_updated_at
    BEFORE UPDATE ON weight_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing rows to have updated_at equal to created_at if it's null
UPDATE weight_entries 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Verify the schema changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'weight_entries' 
ORDER BY ordinal_position;
