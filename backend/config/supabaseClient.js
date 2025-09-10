const { createClient } = require('@supabase/supabase-js');
const { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  SUPABASE_SERVICE_ROLE_KEY 
} = require('./env');

// Create a Supabase client for general use (with RLS enabled)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

// Create a Supabase client for server-side operations (bypasses RLS)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = {
  supabase,
  supabaseAdmin
};