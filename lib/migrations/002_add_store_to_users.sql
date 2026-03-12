-- Add store relationship to user profiles for easier queries
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id) ON DELETE SET NULL;

-- Create index for store_id in user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_store_id ON user_profiles(store_id);

-- Update existing users to include store information (optional)
-- This would be handled by application logic when users create stores
