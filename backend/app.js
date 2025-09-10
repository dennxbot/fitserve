const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { 
  NODE_ENV, 
  CORS_ORIGIN, 
  API_PREFIX,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS
} = require('./config/env');

const { 
  globalErrorHandler,
  notFoundHandler,
  timeoutHandler,
  corsErrorHandler,
  bodyParserErrorHandler,
  securityErrorHandler,
  logError
} = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');

// Create Express app
const app = express();

// Trust proxy (important for rate limiting when behind a proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://fitserve-frontend.onrender.com'
];

// Add any additional origins from environment variable
if (CORS_ORIGIN && CORS_ORIGIN !== 'http://localhost:3000') {
  const additionalOrigins = CORS_ORIGIN.split(',').map(origin => origin.trim());
  allowedOrigins.push(...additionalOrigins);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow any origin
    if (NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Check against allowed origins
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    console.log(`CORS blocked origin: ${origin}`);
    return callback(new Error('CORS policy violation'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page'
  ]
}));

// Request timeout middleware (30 seconds)
app.use(timeoutHandler(30000));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  strict: true 
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting - DISABLED
// const limiter = rateLimit({
//   windowMs: RATE_LIMIT_WINDOW_MS,
//   max: RATE_LIMIT_MAX_REQUESTS,
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: (req, res) => {
//     res.status(429).json({
//       success: false,
//       message: 'Too many requests from this IP, please try again later.',
//       retryAfter: Math.round(RATE_LIMIT_WINDOW_MS / 1000)
//     });
//   }
// });

// Apply rate limiting to all requests - DISABLED
// app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FitServe API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: NODE_ENV
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FitServe API v1.0 - Food Measurement & Portion Tracker',
    version: '1.0.0',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      users: `${API_PREFIX}/users`,
      foods: `${API_PREFIX}/foods`
    },
    documentation: '/api/docs',
    timestamp: new Date().toISOString()
  });
});

// API Documentation placeholder
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FitServe API Documentation',
    version: '1.0.0',
    baseUrl: `${req.protocol}://${req.get('host')}${API_PREFIX}`,
    endpoints: {
      authentication: {
        'POST /auth/register': 'Register a new user',
        'POST /auth/login': 'Login user',
        'POST /auth/logout': 'Logout user',
        'POST /auth/refresh': 'Refresh token',
        'POST /auth/forgot-password': 'Send password reset email',
        'POST /auth/reset-password': 'Reset password',
        'POST /auth/change-password': 'Change password',
        'GET /auth/verify-token': 'Verify token',
        'GET /auth/me': 'Get auth status'
      },
      users: {
        'GET /users/me': 'Get current user profile',
        'PUT /users/me': 'Update current user profile',
        'DELETE /users/me': 'Delete user account',
        'GET /users/me/preferences': 'Get user preferences',
        'PUT /users/me/preferences': 'Update user preferences',
        'GET /users/me/goals': 'Get nutrition goals',
        'PUT /users/me/goals': 'Update nutrition goals',
        'GET /users/me/progress': 'Get user progress',
        'POST /users/me/weight': 'Record weight entry',
        'GET /users/me/stats': 'Get user statistics'
      },
      foods: {
        'GET /foods/search': 'Search foods',
        'GET /foods/categories': 'Get food categories',
        'GET /foods/:id': 'Get food by ID',
        'POST /foods': 'Create food item',
        'PUT /foods/:id': 'Update food item',
        'DELETE /foods/:id': 'Delete food item',
        'POST /foods/log': 'Log food consumption',
        'GET /foods/entries': 'Get food entries',
        'GET /foods/nutrition/daily/:date': 'Get daily nutrition',
        'GET /foods/nutrition/range': 'Get nutrition range'
      }
    }
  });
});

// API Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/foods`, foodRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to FitServe API - Food Measurement & Portion Tracker',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
    api: {
      base: API_PREFIX,
      auth: `${API_PREFIX}/auth`,
      users: `${API_PREFIX}/users`,
      foods: `${API_PREFIX}/foods`
    }
  });
});

// Error handling middleware (order matters!)
app.use(corsErrorHandler);
app.use(bodyParserErrorHandler);
app.use(securityErrorHandler);
app.use(logError);

// Handle 404 - Not Found
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);

module.exports = app;