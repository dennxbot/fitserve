const { NODE_ENV } = require('../config/env');

/**
 * Custom error class for application-specific errors
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Supabase errors
 */
const handleSupabaseError = (error) => {
  let message = 'Database operation failed';
  let statusCode = 500;

  if (error.code === 'PGRST116') {
    message = 'Resource not found';
    statusCode = 404;
  } else if (error.code === '23505') {
    message = 'Duplicate entry - resource already exists';
    statusCode = 409;
  } else if (error.code === '23503') {
    message = 'Referenced resource does not exist';
    statusCode = 400;
  } else if (error.code === '42501') {
    message = 'Insufficient permissions';
    statusCode = 403;
  } else if (error.message) {
    message = error.message;
  }

  return new AppError(message, statusCode);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

/**
 * Handle JWT expired errors
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

/**
 * Handle validation errors
 */
const handleValidationError = (error) => {
  const errors = error.details.map(detail => detail.message);
  const message = `Validation failed: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle cast errors (invalid ID format)
 */
const handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    // Log error for debugging
    console.error('ERROR 💥:', err);

    // Send generic message
    res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }
};

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code && error.code.startsWith('PG')) error = handleSupabaseError(error);

    sendErrorProd(error, res);
  }
};

/**
 * Handle uncaught exceptions
 */
const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message, err.stack);
    process.exit(1);
  });
};

/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = (server) => {
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

/**
 * Handle SIGTERM signal
 */
const handleSigterm = (server) => {
  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
};

/**
 * Async error wrapper - catches errors from async functions
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * 404 handler middleware
 */
const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

/**
 * Request timeout middleware
 */
const timeoutHandler = (timeout = 30000) => {
  return (req, res, next) => {
    res.setTimeout(timeout, () => {
      const err = new AppError('Request timeout', 408);
      next(err);
    });
    next();
  };
};

/**
 * Rate limit exceeded handler
 */
// Rate limit handler - DISABLED
// const rateLimitHandler = (req, res) => {
//   res.status(429).json({
//     success: false,
//     message: 'Too many requests from this IP, please try again later.',
//     retryAfter: Math.round(process.env.RATE_LIMIT_WINDOW_MS / 1000) || 900
//   });
// };

/**
 * CORS error handler
 */
const corsErrorHandler = (err, req, res, next) => {
  if (err && err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    });
  }
  next(err);
};

/**
 * Body parser error handler
 */
const bodyParserErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body'
    });
  }
  next(err);
};

/**
 * File upload error handler
 */
const multerErrorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large'
    });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files'
    });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected field in file upload'
    });
  }
  next(err);
};

/**
 * Security error handler
 */
const securityErrorHandler = (err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large'
    });
  }
  next(err);
};

/**
 * Log error for monitoring
 */
const logError = (err, req, res, next) => {
  if (err.statusCode >= 500) {
    console.error(`
      Error: ${err.message}
      Status: ${err.statusCode}
      Method: ${req.method}
      URL: ${req.originalUrl}
      IP: ${req.ip}
      User-Agent: ${req.get('User-Agent')}
      Stack: ${err.stack}
      Time: ${new Date().toISOString()}
    `);
  }
  next(err);
};

module.exports = {
  AppError,
  globalErrorHandler,
  handleUncaughtException,
  handleUnhandledRejection,
  handleSigterm,
  catchAsync,
  notFoundHandler,
  timeoutHandler,
  // rateLimitHandler, // DISABLED
  corsErrorHandler,
  bodyParserErrorHandler,
  multerErrorHandler,
  securityErrorHandler,
  logError
};