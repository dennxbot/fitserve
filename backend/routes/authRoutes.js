const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      name, // For mobile compatibility
      dateOfBirth, 
      gender, 
      height, 
      weight,
      activityLevel,
      activity_level, // For mobile compatibility
      goal,
      targetWeight,
      profile // For mobile compatibility
    } = req.body;

    // Handle mobile app format (name field) vs web format (firstName/lastName)
    let finalFirstName, finalLastName;
    if (name && !firstName && !lastName) {
      // Mobile format: split name into firstName and lastName
      const nameParts = name.trim().split(' ');
      finalFirstName = nameParts[0] || '';
      finalLastName = nameParts.slice(1).join(' ') || '';
    } else {
      // Web format: use firstName and lastName directly
      finalFirstName = firstName;
      finalLastName = lastName;
    }

    // Handle mobile profile format
    const mobileProfile = profile || {};
    const finalDateOfBirth = dateOfBirth || mobileProfile.dateOfBirth;
    const finalGender = gender || mobileProfile.gender;
    const finalHeight = height || mobileProfile.height;
    const finalWeight = weight || mobileProfile.weight;
    const finalActivityLevel = activityLevel || activity_level || mobileProfile.activity_level;
    const finalGoal = goal || mobileProfile.goal;
    const finalTargetWeight = targetWeight || mobileProfile.targetWeight;

    // Validate required fields
    if (!email || !password || !finalFirstName || !finalLastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, firstName, and lastName are required'
      });
    }

    // Validate additional required fields for complete profile
    if (!finalDateOfBirth || !finalGender || !finalHeight || !finalWeight || !finalActivityLevel || !finalGoal) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth, gender, height, weight, activity level, and fitness goal are required for registration'
      });
    }
    
    // Validate target weight for goals that require it
    const goalsThatRequireTargetWeight = ['lose_weight', 'gain_weight', 'build_muscle'];
    if (goalsThatRequireTargetWeight.includes(finalGoal) && (!finalTargetWeight || finalTargetWeight <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Target weight is required for your selected fitness goal'
      });
    }

    // Register user with complete profile
    const result = await authService.register({
      email,
      password,
      firstName: finalFirstName,
      lastName: finalLastName,
      dateOfBirth: finalDateOfBirth,
      gender: finalGender,
      height: finalHeight,
      weight: finalWeight,
      activityLevel: finalActivityLevel,
      goal: finalGoal,
      targetWeight: finalTargetWeight
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Login user
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
});

// Logout user
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await authService.logout(token);
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await authService.getCurrentUser(userId);

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Change password
    await authService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to change password'
    });
  }
});

module.exports = router;
