/**
 * EXAMPLES: LeetCode Integration Usage
 * 
 * This file demonstrates various ways to use the LeetCode integration
 * in your application.
 */

// ============================================
// EXAMPLE 1: Direct Service Usage
// ============================================

const leetcodeService = require('./services/leetcodeService');
const problemImportService = require('./services/problemImportService');

// Fetch all problems
async function example1_getAllProblems() {
  try {
    const allProblems = await leetcodeService.getAllProblems();
    console.log(`Total problems: ${allProblems.length}`);
    console.log('Sample problem:', allProblems[0]);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Fetch problems by difficulty
async function example2_getByDifficulty() {
  try {
    const easyProblems = await leetcodeService.fetchLeetCodeProblems(50, 0);
    console.log('Easy problems:', easyProblems.questions);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Fetch single problem details
async function example3_getProblemDetails() {
  try {
    const problem = await leetcodeService.fetchProblemDetails('two-sum');
    console.log('Problem:', problem);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================
// EXAMPLE 2: Import Service Usage
// ============================================

// Import all problems into database
async function example4_importAll() {
  try {
    const result = await problemImportService.importAllProblems();
    console.log('Import result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Import specific difficulty
async function example5_importByDifficulty() {
  try {
    const result = await problemImportService.importProblemsByDifficulty('Medium');
    console.log('Import result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get statistics
async function example6_getStats() {
  try {
    const stats = await problemImportService.getImportStats();
    console.log('Statistics:', stats);
    // Output:
    // {
    //   totalProblems: 2850,
    //   totalTopics: 25,
    //   byDifficulty: [
    //     { difficulty: 'Easy', count: 850 },
    //     { difficulty: 'Medium', count: 1200 },
    //     { difficulty: 'Hard', count: 800 }
    //   ]
    // }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================
// EXAMPLE 3: Database Queries
// ============================================

const pool = require('./config/db');

// Get all problems with their topics
async function example7_queryAllProblems() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.difficulty,
        t.name as topic,
        p.platform_link
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.id
      ORDER BY p.difficulty, p.title
    `);
    
    console.log('All problems:', result.rows);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get problems by difficulty
async function example8_getByDifficultyFromDB() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.difficulty,
        t.name as topic,
        p.platform_link
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.id
      WHERE p.difficulty = $1
      ORDER BY p.title
    `, ['Medium']);
    
    console.log('Medium problems:', result.rows);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get problems by topic
async function example9_getByTopicFromDB() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.difficulty,
        t.name as topic,
        p.platform_link
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.id
      WHERE t.name = $1
      ORDER BY p.difficulty, p.title
    `, ['Array']);
    
    console.log('Array problems:', result.rows);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get user progress on problems
async function example10_getUserProgress() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.difficulty,
        t.name as topic,
        up.status,
        up.notes,
        up.updated_at
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.id
      LEFT JOIN user_progress up ON p.id = up.problem_id
      WHERE up.user_id = $1
      ORDER BY up.updated_at DESC
    `, [1]); // Replace with actual user_id
    
    console.log('User progress:', result.rows);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get problems solved by user
async function example11_getSolvedProblems() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.difficulty,
        t.name as topic,
        up.status
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.id
      JOIN user_progress up ON p.id = up.problem_id
      WHERE up.user_id = $1 AND up.status = 'solved'
      ORDER BY p.difficulty, p.title
    `, [1]); // Replace with actual user_id
    
    console.log('Solved problems:', result.rows);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get difficulty statistics for user
async function example12_getUserStats() {
  try {
    const result = await pool.query(`
      SELECT 
        p.difficulty,
        COUNT(*) as total,
        SUM(CASE WHEN up.status = 'solved' THEN 1 ELSE 0 END) as solved,
        SUM(CASE WHEN up.status = 'attempted' THEN 1 ELSE 0 END) as attempted,
        SUM(CASE WHEN up.status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM problems p
      LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = $1
      GROUP BY p.difficulty
    `, [1]); // Replace with actual user_id
    
    console.log('User statistics:', result.rows);
    // Output:
    // [
    //   { difficulty: 'Easy', total: 850, solved: 100, attempted: 50, pending: 700 },
    //   { difficulty: 'Medium', total: 1200, solved: 45, attempted: 30, pending: 1125 }
    // ]
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================
// EXAMPLE 4: API Response Formats
// ============================================

/**
 * LeetCode Problem Response Format
 * 
 * From LeetCode GraphQL API:
 * {
 *   questionId: 1,
 *   questionFrontendId: "1",
 *   title: "Two Sum",
 *   titleSlug: "two-sum",
 *   difficulty: "Easy",
 *   topicTags: [
 *     { 
 *       name: "Array", 
 *       slug: "array" 
 *     },
 *     { 
 *       name: "Hash Table", 
 *       slug: "hash-table" 
 *     }
 *   ],
 *   acRate: 50.5,
 *   isPaid: false
 * }
 */

/**
 * Database Problem Record Format
 * 
 * After import:
 * {
 *   id: 1,
 *   title: "Two Sum",
 *   difficulty: "Easy",
 *   topic_id: 5,
 *   platform: "LeetCode",
 *   platform_link: "https://leetcode.com/problems/two-sum/",
 *   youtube_link: null,
 *   created_at: "2024-03-21T10:30:00.000Z"
 * }
 */

// ============================================
// EXAMPLE 5: Using in Express Routes
// ============================================

const express = require('express');
const router = express.Router();

// Get all problems (paginated)
router.get('/all', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;
    
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.difficulty,
        t.name as topic,
        p.platform_link
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.id
      ORDER BY p.id
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    const countResult = await pool.query('SELECT COUNT(*) as total FROM problems');
    
    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get problems by filters
router.get('/filter', async (req, res) => {
  try {
    const { difficulty, topic } = req.query;
    
    let query = `
      SELECT 
        p.id,
        p.title,
        p.difficulty,
        t.name as topic,
        p.platform_link
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.id
      WHERE 1=1
    `;
    const params = [];
    
    if (difficulty) {
      query += ` AND p.difficulty = $${params.length + 1}`;
      params.push(difficulty);
    }
    
    if (topic) {
      query += ` AND t.name = $${params.length + 1}`;
      params.push(topic);
    }
    
    query += ' ORDER BY p.title';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get similar/related problems
router.get('/similar/:problem_id', async (req, res) => {
  try {
    const { problem_id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.difficulty,
        t.name as topic,
        p.platform_link
      FROM problems p
      LEFT JOIN topics t ON p.topic_id = t.id
      WHERE p.topic_id = (
        SELECT topic_id FROM problems WHERE id = $1
      ) AND p.id != $1
      ORDER BY p.difficulty, p.title
      LIMIT 10
    `, [problem_id]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// ============================================
// How to Run These Examples
// ============================================

/*
  1. Direct usage (in files):
     const example = require('./EXAMPLES.js');
     example.example1_getAllProblems();
  
  2. Via CLI:
     node migrate-problems.js all
     node migrate-problems.js stats
     node migrate-problems.js easy
  
  3. Via API:
     GET /api/import/import-stats
     POST /api/import/import-problems
     POST /api/import/import-problems/medium
     DELETE /api/import/clear-problems
  
  4. Check database directly:
     SELECT COUNT(*) FROM problems;
     SELECT difficulty, COUNT(*) FROM problems GROUP BY difficulty;
     SELECT * FROM problems LIMIT 5;
*/
