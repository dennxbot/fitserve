const authService = require('../services/authService');
const userService = require('../services/userService');

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token
    const tokenData = await authService.verifyToken(token);
    
    // Get full user data
    const user = await userService.getUserById(tokenData.userId);
    
    // Attach user to request
    req.user = user;
    req.tokenData = tokenData;
    
    next();
  } catch (error) {
    if (error.message.includes('Token') || error.message.includes('expired') || error.message.includes('invalid')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Optional authentication middleware - attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

      if (token) {
        try {
          const tokenData = await authService.verifyToken(token);
          const user = await userService.getUserById(tokenData.userId);
          req.user = user;
          req.tokenData = tokenData;
        } catch (error) {
          // Ignore authentication errors for optional auth
          req.user = null;
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    req.user = null;
    next();
  }
};

/**
 * Admin role middleware - requires user to be authenticated and have admin privileges
 */
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has admin role (you'll need to implement role system)
    // For now, we'll check if user email is in admin list or has specific property
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim());
    const isAdmin = adminEmails.includes(req.user.email) || req.user.isAdmin;

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin privileges required'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

/**
 * Resource ownership middleware - ensures user owns the resource
 */
const requireOwnership = (resourceIdParam = 'id', userIdField = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const resourceId = req.params[resourceIdParam];
      const userId = req.user[userIdField];

      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID is required'
        });
      }

      // For resources that belong to the user, check ownership
      if (resourceId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only access your own resources'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

/**
 * Account status middleware - checks if user account is active
 */
const requireActiveAccount = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Account verification error'
    });
  }
};

/**
 * Email verification middleware - checks if user email is verified
 */
const requireEmailVerification = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address to access this resource'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Email verification error'
    });
  }
};

/**
 * Complete profile middleware - checks if user has completed essential profile information
 */
const requireCompleteProfile = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender'];
    const missingFields = requiredFields.filter(field => 
      !req.user[field] || req.user[field] === ''
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile to access this resource',
        missingFields
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Profile verification error'
    });
  }
};

/**
 * Role-based access control middleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRoles = req.user.roles || [];
      const hasRequiredRole = roles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied: Required role(s): ${roles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Role verification error'
      });
    }
  };
};

/**
 * Permission-based access control middleware
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userPermissions = req.user.permissions || [];
      const hasPermission = userPermissions.includes(permission);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied: Missing permission: ${permission}`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Permission verification error'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireOwnership,
  requireActiveAccount,
  requireEmailVerification,
  requireCompleteProfile,
  requireRole,
  requirePermission
};