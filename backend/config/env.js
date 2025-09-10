require('dotenv').config();

const config = {
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-fallback-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // API Configuration
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  
  // USDA FoodData Central API Configuration
  USDA_API_KEY: process.env.USDA_API_KEY,
  USDA_API_BASE_URL: process.env.USDA_API_BASE_URL || 'https://api.nal.usda.gov/fdc/v1'
};

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'USDA_API_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !config[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

module.exports = config;