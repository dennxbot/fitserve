const express = require('express');
const router = express.Router();
const foodService = require('../services/foodService');
const { authenticateToken, optionalAuth } = require('../middlewares/authMiddleware');

// Search foods
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q: query, limit, offset, category } = req.query;

    // Allow empty query for public endpoints (return empty results)
    if (!query || query.trim() === '') {
      return res.status(200).json({
        success: true,
        data: [],
        meta: {
          pagination: {
            limit: parseInt(limit) || 20,
            offset: parseInt(offset) || 0,
            total: 0
          }
        }
      });
    }

    const options = {
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      category: category || null
    };

    const foods = await foodService.searchFoods(query, options);

    res.status(200).json({
      success: true,
      data: foods,
      meta: {
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total: foods.length
        }
      }
    });
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search foods'
    });
  }
});

// Get food categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await foodService.getFoodCategories();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get food categories'
    });
  }
});

// Get user's food entries (must be before /:id route)
router.get('/entries', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, limit, offset } = req.query;

    const options = {
      date: date || null,
      limit: parseInt(limit) || 50,
      offset: parseInt(offset) || 0
    };

    const entries = await foodService.getUserFoodEntries(userId, options);

    res.status(200).json({
      success: true,
      data: entries,
      meta: {
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total: entries.length
        }
      }
    });
  } catch (error) {
    console.error('Get food entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get food entries'
    });
  }
});

// Get daily nutrition summary (must be before /:id route)
router.get('/nutrition/daily/:date', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    const nutritionSummary = await foodService.getDailyNutritionSummary(userId, date);

    res.status(200).json({
      success: true,
      data: nutritionSummary
    });
  } catch (error) {
    console.error('Get daily nutrition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get daily nutrition summary'
    });
  }
});

// Get weekly nutrition summary (must be before /:id route)
router.get('/nutrition/weekly', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate query parameters are required'
      });
    }

    const nutritionSummary = await foodService.getWeeklyNutritionSummary(userId, startDate, endDate);

    res.status(200).json({
      success: true,
      data: nutritionSummary
    });
  } catch (error) {
    console.error('Get weekly nutrition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get weekly nutrition summary'
    });
  }
});

// Scan barcode to find food (must be before /:id route)
router.get('/barcode/:barcode', optionalAuth, async (req, res) => {
  try {
    const { barcode } = req.params;
    
    if (!barcode || barcode.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Barcode is required'
      });
    }

    // Search for food by barcode using USDA API
    const food = await foodService.searchFoodByBarcode(barcode);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found for this barcode'
      });
    }

    res.status(200).json({
      success: true,
      data: { food }
    });
  } catch (error) {
    console.error('Barcode scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to scan barcode'
    });
  }
});

// Get food by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodService.getFoodById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { food }
    });
  } catch (error) {
    console.error('Get food by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get food'
    });
  }
});

// Create new food
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const foodData = req.body;

    const newFood = await foodService.createFood(foodData, userId);

    res.status(201).json({
      success: true,
      message: 'Food created successfully',
      data: { food: newFood }
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create food'
    });
  }
});

// Update food
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const updatedFood = await foodService.updateFood(id, updateData, userId);

    res.status(200).json({
      success: true,
      message: 'Food updated successfully',
      data: { food: updatedFood }
    });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update food'
    });
  }
});

// Log food consumption
router.post('/log', authenticateToken, async (req, res) => {
  try {
    const entryData = { ...req.body, user_id: req.user.id };
    const result = await foodService.logFoodConsumption(entryData);

    res.status(201).json({
      success: true,
      message: 'Food logged successfully',
      data: result
    });
  } catch (error) {
    console.error('Log food error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to log food'
    });
  }
});

// Delete food entry
router.delete('/entries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await foodService.deleteFoodEntry(id, userId);

    res.status(200).json({
      success: true,
      message: 'Food entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete food entry error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete food entry'
    });
  }
});



// USDA API status
router.get('/usda/status', async (req, res) => {
  try {
    const status = await foodService.getUSDAAPIStatus();

    res.status(200).json({
      success: true,
      data: status,
      message: status.message
    });
  } catch (error) {
    console.error('USDA status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check USDA API status'
    });
  }
});

// Search USDA foods
router.get('/usda/search', async (req, res) => {
  try {
    const { q: query, pageSize, pageNumber, dataType, autoImport } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const options = {
      pageSize: parseInt(pageSize) || 25,
      pageNumber: parseInt(pageNumber) || 1,
      dataType: dataType ? dataType.split(',') : ['Foundation', 'SR Legacy', 'Branded'],
      autoImport: autoImport === 'true'
    };

    const foods = await foodService.searchUSDAFoods(query, options);

    res.status(200).json({
      success: true,
      data: foods
    });
  } catch (error) {
    console.error('USDA search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search USDA foods'
    });
  }
});

// Get USDA food by FDC ID
router.get('/usda/:fdcId', async (req, res) => {
  try {
    const { fdcId } = req.params;
    const food = await foodService.getUSDAFood(fdcId);

    res.status(200).json({
      success: true,
      data: { food }
    });
  } catch (error) {
    console.error('Get USDA food error:', error);
    res.status(404).json({
      success: false,
      message: 'USDA food not found'
    });
  }
});

// Import USDA food to local database
router.post('/usda/:fdcId/import', authenticateToken, async (req, res) => {
  try {
    const { fdcId } = req.params;
    const userId = req.user.id;

    const importedFood = await foodService.importUSDAFood(fdcId, userId);

    res.status(201).json({
      success: true,
      message: 'USDA food imported successfully',
      data: { food: importedFood }
    });
  } catch (error) {
    console.error('Import USDA food error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to import USDA food'
    });
  }
});

module.exports = router;