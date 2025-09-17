const Joi = require('joi');

/**
 * Common validation schemas
 */
const commonSchemas = {
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),

  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    'any.required': 'Password is required'
  }),

  name: Joi.string().trim().min(1).max(50).pattern(/^[a-zA-Z\s\-']+$/).messages({
    'string.min': 'Name must not be empty',
    'string.max': 'Name cannot exceed 50 characters',
    'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes'
  }),

  date: Joi.date().iso().messages({
    'date.base': 'Please provide a valid date',
    'date.format': 'Date must be in ISO format (YYYY-MM-DD)'
  }),

  positiveNumber: Joi.number().positive().messages({
    'number.positive': 'Value must be a positive number'
  }),

  nonNegativeNumber: Joi.number().min(0).messages({
    'number.min': 'Value must be zero or greater'
  })
};

/**
 * User registration validation
 */
const validateRegister = (userData) => {
  const schema = Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: commonSchemas.name.required().messages({
      'any.required': 'First name is required'
    }),
    lastName: commonSchemas.name.required().messages({
      'any.required': 'Last name is required'
    }),
    dateOfBirth: commonSchemas.date.max('now').optional().messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
    gender: Joi.string().valid('male', 'female', 'other').optional().messages({
      'any.only': 'Gender must be male, female, or other'
    }),
    height: Joi.number().min(50).max(300).optional().messages({
      'number.min': 'Height must be at least 50 cm',
      'number.max': 'Height cannot exceed 300 cm'
    }),
    weight: Joi.number().min(1).max(500).optional().messages({
      'number.min': 'Weight must be at least 1 kg',
      'number.max': 'Weight cannot exceed 500 kg'
    }),
    activityLevel: Joi.string().valid(
      'sedentary', 
      'lightly_active', 
      'moderately_active', 
      'very_active', 
      'extremely_active'
    ).optional().messages({
      'any.only': 'Activity level must be one of: sedentary, lightly_active, moderately_active, very_active, extremely_active'
    }),
    goal: Joi.string().valid('weight_loss', 'weight_gain', 'maintain').optional().messages({
      'any.only': 'Goal must be weight_loss, weight_gain, or maintain'
    }),
    targetWeight: Joi.number().min(20).max(500).optional().messages({
      'number.min': 'Target weight must be at least 20 kg',
      'number.max': 'Target weight cannot exceed 500 kg'
    }),
    units: Joi.string().valid('metric', 'imperial').optional().messages({
      'any.only': 'Units must be metric or imperial'
    }),
    timezone: Joi.string().optional()
  });

  return schema.validate(userData, { abortEarly: false });
};

/**
 * User login validation
 */
const validateLogin = (loginData) => {
  const schema = Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  return schema.validate(loginData, { abortEarly: false });
};

/**
 * Password change validation
 */
const validatePasswordChange = (passwordData) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    newPassword: commonSchemas.password
  });

  return schema.validate(passwordData, { abortEarly: false });
};

/**
 * User profile validation
 */
const validateUser = (userData, options = {}) => {
  const schema = Joi.object({
    firstName: commonSchemas.name.when('$allowPartial', {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required().messages({
        'any.required': 'First name is required'
      })
    }),
    lastName: commonSchemas.name.when('$allowPartial', {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required().messages({
        'any.required': 'Last name is required'
      })
    }),
    dateOfBirth: commonSchemas.date.max('now').optional().messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    height: Joi.number().min(50).max(300).optional().messages({
      'number.min': 'Height must be at least 50 cm',
      'number.max': 'Height cannot exceed 300 cm'
    }),
    weight: Joi.number().min(1).max(500).optional().messages({
      'number.min': 'Weight must be at least 1 kg',
      'number.max': 'Weight cannot exceed 500 kg'
    }),
    activityLevel: Joi.string().valid(
      'sedentary', 
      'lightly_active', 
      'moderately_active', 
      'very_active', 
      'extremely_active'
    ).optional(),
    goal: Joi.string().valid('weight_loss', 'weight_gain', 'maintain').optional(),
    targetWeight: Joi.number().min(20).max(500).optional().messages({
      'number.min': 'Target weight must be at least 20 kg',
      'number.max': 'Target weight cannot exceed 500 kg'
    }),
    avatarUrl: Joi.string().uri().optional().allow(null),
    timezone: Joi.string().optional(),
    units: Joi.string().valid('metric', 'imperial').optional()
  });

  return schema.validate(userData, { 
    abortEarly: false, 
    context: { allowPartial: options.allowPartial || false } 
  });
};

/**
 * User preferences validation
 */
const validateUserPreferences = (preferencesData) => {
  const schema = Joi.object({
    notifications: Joi.object({
      mealReminders: Joi.boolean().optional(),
      dailyGoals: Joi.boolean().optional(),
      weeklyReports: Joi.boolean().optional()
    }).optional(),
    privacy: Joi.object({
      profilePublic: Joi.boolean().optional(),
      shareProgress: Joi.boolean().optional()
    }).optional(),
    dailyGoals: Joi.object({
      calories: Joi.number().min(800).max(5000).optional().messages({
        'number.min': 'Daily calorie goal must be at least 800',
        'number.max': 'Daily calorie goal cannot exceed 5000'
      }),
      protein: Joi.number().min(0).max(500).optional().messages({
        'number.min': 'Protein goal cannot be negative',
        'number.max': 'Protein goal cannot exceed 500g'
      }),
      carbs: Joi.number().min(0).max(1000).optional().messages({
        'number.min': 'Carbs goal cannot be negative',
        'number.max': 'Carbs goal cannot exceed 1000g'
      }),
      fat: Joi.number().min(0).max(300).optional().messages({
        'number.min': 'Fat goal cannot be negative',
        'number.max': 'Fat goal cannot exceed 300g'
      }),
      fiber: Joi.number().min(0).max(100).optional().messages({
        'number.min': 'Fiber goal cannot be negative',
        'number.max': 'Fiber goal cannot exceed 100g'
      }),
      water: Joi.number().min(0).max(20).optional().messages({
        'number.min': 'Water goal cannot be negative',
        'number.max': 'Water goal cannot exceed 20 glasses'
      })
    }).optional()
  });

  return schema.validate(preferencesData, { abortEarly: false });
};

/**
 * Food validation
 */
const validateFood = (foodData, options = {}) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(1).max(200).when('$allowPartial', {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required().messages({
        'any.required': 'Food name is required'
      })
    }).messages({
      'string.min': 'Food name cannot be empty',
      'string.max': 'Food name cannot exceed 200 characters'
    }),
    brand: Joi.string().trim().max(100).optional().allow(null, ''),
    barcode: Joi.string().trim().max(20).optional().allow(null, ''),
    category: Joi.string().trim().min(1).max(50).when('$allowPartial', {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required().messages({
        'any.required': 'Food category is required'
      })
    }),
    servingSize: commonSchemas.positiveNumber.when('$allowPartial', {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required().messages({
        'any.required': 'Serving size is required'
      })
    }),
    servingUnit: Joi.string().trim().min(1).max(20).when('$allowPartial', {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required().messages({
        'any.required': 'Serving unit is required'
      })
    }),
    calories: commonSchemas.nonNegativeNumber.when('$allowPartial', {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required().messages({
        'any.required': 'Calories are required'
      })
    }),
    protein: commonSchemas.nonNegativeNumber.optional(),
    carbs: commonSchemas.nonNegativeNumber.optional(),
    fat: commonSchemas.nonNegativeNumber.optional(),
    fiber: commonSchemas.nonNegativeNumber.optional(),
    sugar: commonSchemas.nonNegativeNumber.optional(),
    sodium: commonSchemas.nonNegativeNumber.optional(),
    cholesterol: commonSchemas.nonNegativeNumber.optional(),
    saturatedFat: commonSchemas.nonNegativeNumber.optional(),
    transFat: commonSchemas.nonNegativeNumber.optional(),
    potassium: commonSchemas.nonNegativeNumber.optional(),
    calcium: commonSchemas.nonNegativeNumber.optional(),
    iron: commonSchemas.nonNegativeNumber.optional(),
    vitaminA: commonSchemas.nonNegativeNumber.optional(),
    vitaminC: commonSchemas.nonNegativeNumber.optional(),
    imageUrl: Joi.string().uri().optional().allow(null, ''),
    verified: Joi.boolean().optional()
  });

  return schema.validate(foodData, { 
    abortEarly: false, 
    context: { allowPartial: options.allowPartial || false } 
  });
};

/**
 * Food entry validation
 */
const validateFoodEntry = (entryData) => {
  const schema = Joi.object({
    userId: Joi.string().required().messages({
      'any.required': 'User ID is required'
    }),
    foodId: Joi.string().required().messages({
      'any.required': 'Food ID is required'
    }),
    quantity: commonSchemas.positiveNumber.required().messages({
      'any.required': 'Quantity is required'
    }),
    unit: Joi.string().trim().min(1).max(20).required().messages({
      'any.required': 'Unit is required',
      'string.min': 'Unit cannot be empty',
      'string.max': 'Unit cannot exceed 20 characters'
    }),
    mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required().messages({
      'any.required': 'Meal type is required',
      'any.only': 'Meal type must be breakfast, lunch, dinner, or snack'
    }),
    consumedAt: commonSchemas.date.optional().default(() => new Date()),
    notes: Joi.string().max(500).optional().allow(null, '').messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
  });

  return schema.validate(entryData, { abortEarly: false });
};

/**
 * Query parameters validation
 */
const validateQueryParams = (queryData, type) => {
  const schemas = {
    search: Joi.object({
      q: Joi.string().trim().max(100).optional().allow(''),
      category: Joi.string().trim().max(50).optional(),
      verified: Joi.boolean().optional(),
      limit: Joi.number().min(1).max(100).optional().default(20),
      offset: Joi.number().min(0).optional().default(0),
      user_only: Joi.boolean().optional()
    }),
    
    dateRange: Joi.object({
      start_date: Joi.date().iso().optional(),
      end_date: Joi.date().iso().min(Joi.ref('start_date')).optional().messages({
        'date.min': 'End date must be after start date'
      }),
      meal_type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').optional(),
      limit: Joi.number().min(1).max(100).optional().default(50),
      offset: Joi.number().min(0).optional().default(0)
    }),

    pagination: Joi.object({
      limit: Joi.number().min(1).max(100).optional().default(20),
      offset: Joi.number().min(0).optional().default(0),
      sort: Joi.string().valid('name', 'created_at', 'updated_at').optional().default('created_at'),
      order: Joi.string().valid('asc', 'desc').optional().default('desc')
    })
  };

  const schema = schemas[type];
  if (!schema) {
    throw new Error(`Unknown validation type: ${type}`);
  }

  return schema.validate(queryData, { abortEarly: false });
};

/**
 * File upload validation
 */
const validateFileUpload = (file, options = {}) => {
  const {
    allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'],
    maxSize = 5 * 1024 * 1024, // 5MB
    required = true
  } = options;

  const errors = [];

  if (required && !file) {
    errors.push('File is required');
  }

  if (file) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      errors.push(`File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize input data
 */
const sanitizeInput = (data) => {
  if (typeof data === 'string') {
    return data.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  
  if (data && typeof data === 'object') {
    const sanitized = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeInput(data[key]);
      }
    }
    return sanitized;
  }
  
  return data;
};

/**
 * Validate and sanitize request data
 */
const validateAndSanitize = (validator, data, options = {}) => {
  const sanitized = sanitizeInput(data);
  return validator(sanitized, options);
};

module.exports = {
  // Validation functions
  validateRegister,
  validateLogin,
  validatePasswordChange,
  validateUser,
  validateUserPreferences,
  validateFood,
  validateFoodEntry,
  validateQueryParams,
  validateFileUpload,
  
  // Utility functions
  sanitizeInput,
  validateAndSanitize,
  
  // Common schemas for reuse
  commonSchemas
};
