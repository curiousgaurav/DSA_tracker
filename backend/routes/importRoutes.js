// Admin routes for managing LeetCode problem imports
const express = require('express');
const router = express.Router();
const problemImportService = require('../services/problemImportService');
const adminMiddleware = require('../middleware/adminMiddleware');

// Import all LeetCode problems
router.post('/import-problems', adminMiddleware, async (req, res) => {
  try {
    console.log('📥 Starting problem import...');
    const result = await problemImportService.importAllProblems();
    res.status(200).json({
      success: true,
      message: 'Problems imported successfully',
      data: result
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Import problems by difficulty
router.post('/import-problems/:difficulty', adminMiddleware, async (req, res) => {
  try {
    const { difficulty } = req.params;
    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: 'Invalid difficulty. Must be Easy, Medium, or Hard'
      });
    }
    
    const result = await problemImportService.importProblemsByDifficulty(difficulty);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get import statistics
router.get('/import-stats', adminMiddleware, async (req, res) => {
  try {
    const stats = await problemImportService.getImportStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear all problems
router.delete('/clear-problems', adminMiddleware, async (req, res) => {
  try {
    const result = await problemImportService.clearAllProblems();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Clear error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
