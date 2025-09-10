const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await userService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: { user: userProfile }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// Update current user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.id;
    delete updateData.email;
    delete updateData.created_at;
    delete updateData.updated_at;

    const updatedUser = await userService.updateUser(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update user profile'
    });
  }
});

// Delete current user account
router.delete('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await userService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user account'
    });
  }
});

// Get user nutrition goals
router.get('/me/goals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await userService.calculateNutritionGoals(userId);

    res.status(200).json({
      success: true,
      data: goals
    });
  } catch (error) {
    console.error('Get nutrition goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate nutrition goals'
    });
  }
});

// Update user nutrition goals
router.put('/me/goals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const goalsData = req.body;
    
    // Validate required fields
    if (!goalsData.dailyCalories || !goalsData.dailyProtein || !goalsData.dailyCarbs || !goalsData.dailyFat) {
      return res.status(400).json({
        success: false,
        message: 'Missing required nutrition goals data'
      });
    }
    
    const updatedGoals = await userService.updateNutritionGoals(userId, goalsData);
    
    res.status(200).json({
      success: true,
      message: 'Nutrition goals updated successfully',
      data: updatedGoals
    });
  } catch (error) {
    console.error('Update nutrition goals error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update nutrition goals'
    });
  }
});

// Generate recommended nutrition goals
router.post('/me/goals/recommended', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const recommendedGoals = await userService.generateRecommendedGoals(userId);
    
    res.status(200).json({
      success: true,
      message: 'Recommended goals generated successfully',
      data: recommendedGoals
    });
  } catch (error) {
    console.error('Generate recommended goals error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to generate recommended goals'
    });
  }
});

// Weight tracking
router.get('/me/weight', authenticateToken, async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    const weightEntries = await userService.getWeightEntries(req.user.id, days);
    res.json({
      success: true,
      data: weightEntries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/me/weight', authenticateToken, async (req, res) => {
  try {
    console.log('Weight POST request body:', JSON.stringify(req.body, null, 2));
    console.log('Weight POST request body type:', typeof req.body);
    console.log('Weight POST request body keys:', Object.keys(req.body));
    const weightEntry = await userService.recordWeight(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: weightEntry
    });
  } catch (error) {
    console.log('Weight POST error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update weight entry
router.put('/me/weight/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;
    const updateData = req.body;
    
    const updatedEntry = await userService.updateWeightEntry(userId, entryId, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Weight entry updated successfully',
      data: updatedEntry
    });
  } catch (error) {
    console.error('Update weight entry error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update weight entry'
    });
  }
});

// Delete weight entry
router.delete('/me/weight/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;
    
    await userService.deleteWeightEntry(userId, entryId);
    
    res.status(200).json({
      success: true,
      message: 'Weight entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete weight entry error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete weight entry'
    });
  }
});

// Get user progress
router.get('/me/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const days = req.query.days ? parseInt(req.query.days) : 30;
    const progress = await userService.getUserProgress(userId, days);

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user progress'
    });
  }
});

// Get comprehensive user statistics
router.get('/me/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await userService.getUserStats(userId);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics'
    });
  }
});

module.exports = router;