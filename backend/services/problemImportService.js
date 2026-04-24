const pool = require('../config/db');
const leetcodeService = require('./leetcodeService');

/**
 * Import all LeetCode problems into database
 */
exports.importAllProblems = async () => {
  let client;
  try {
    client = await pool.connect();
    
    console.log('🚀 Starting problem import process...');
    
    // Get all problems from LeetCode
    const allProblems = await leetcodeService.getAllProblems();
    
    console.log(`📊 Total problems to import: ${allProblems.length}`);
    
    // Start transaction
    await client.query('BEGIN');
    
    let importedCount = 0;
    let skippedCount = 0;

    for (const problem of allProblems) {
      try {
        // Map topic tags to topic_ids (create if doesn't exist)
        let topic_id = null;
        
        if (problem.topicTags && problem.topicTags.length > 0) {
          const topicName = problem.topicTags[0].name;
          
          // Check if topic exists
          let topicResult = await client.query(
            'SELECT id FROM topics WHERE name = $1',
            [topicName]
          );
          
          if (topicResult.rows.length === 0) {
            // Create new topic
            topicResult = await client.query(
              'INSERT INTO topics (name) VALUES ($1) RETURNING id',
              [topicName]
            );
          }
          
          topic_id = topicResult.rows[0].id;
        }
        
        // Check if problem already exists
        const existingProblem = await client.query(
          'SELECT id FROM problems WHERE title = $1',
          [problem.title]
        );
        
        if (existingProblem.rows.length > 0) {
          skippedCount++;
          continue;
        }
        
        // Insert problem
        await client.query(
          `INSERT INTO problems 
          (title, difficulty, topic_id, platform, platform_link, youtube_link)
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            problem.title,
            problem.difficulty,
            topic_id,
            'LeetCode',
            `https://leetcode.com/problems/${problem.titleSlug}/`,
            null // YouTube link empty for now
          ]
        );
        
        importedCount++;
        
        // Log progress every 100 problems
        if (importedCount % 100 === 0) {
          console.log(`✅ Progress: ${importedCount} problems imported, ${skippedCount} skipped`);
        }
        
      } catch (err) {
        console.error(`❌ Error importing problem "${problem.title}":`, err.message);
        skippedCount++;
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log(`\n✅ Import completed!`);
    console.log(`📈 Total imported: ${importedCount}`);
    console.log(`⏭️  Total skipped: ${skippedCount}`);
    
    return {
      success: true,
      imported: importedCount,
      skipped: skippedCount,
      total: allProblems.length
    };
    
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('❌ Import failed:', error.message);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * Import problems by difficulty
 */
exports.importProblemsByDifficulty = async (difficulty) => {
  let client;
  try {
    client = await pool.connect();
    
    console.log(`🚀 Starting import for ${difficulty} problems...`);
    
    // Get problems from LeetCode
    const result = await leetcodeService.getProblemsByDifficulty(difficulty);
    const problemsToImport = result.questions;
    
    console.log(`📊 Total ${difficulty} problems to import: ${problemsToImport.length}`);
    
    // Start transaction
    await client.query('BEGIN');
    
    let importedCount = 0;
    let skippedCount = 0;

    for (const problem of problemsToImport) {
      try {
        // Map topic tags
        let topic_id = null;
        
        if (problem.topicTags && problem.topicTags.length > 0) {
          const topicName = problem.topicTags[0].name;
          
          let topicResult = await client.query(
            'SELECT id FROM topics WHERE name = $1',
            [topicName]
          );
          
          if (topicResult.rows.length === 0) {
            topicResult = await client.query(
              'INSERT INTO topics (name) VALUES ($1) RETURNING id',
              [topicName]
            );
          }
          
          topic_id = topicResult.rows[0].id;
        }
        
        // Check if problem already exists
        const existingProblem = await client.query(
          'SELECT id FROM problems WHERE title = $1',
          [problem.title]
        );
        
        if (existingProblem.rows.length > 0) {
          skippedCount++;
          continue;
        }
        
        // Insert problem
        await client.query(
          `INSERT INTO problems 
          (title, difficulty, topic_id, platform, platform_link, youtube_link)
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            problem.title,
            problem.difficulty,
            topic_id,
            'LeetCode',
            `https://leetcode.com/problems/${problem.titleSlug}/`,
            null
          ]
        );
        
        importedCount++;
        
      } catch (err) {
        console.error(`Error importing problem "${problem.title}":`, err.message);
        skippedCount++;
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log(`✅ Import completed for ${difficulty}!`);
    console.log(`📈 Total imported: ${importedCount}`);
    console.log(`⏭️  Total skipped: ${skippedCount}`);
    
    return {
      success: true,
      difficulty,
      imported: importedCount,
      skipped: skippedCount,
      total: problemsToImport.length
    };
    
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error(`Error importing ${difficulty} problems:`, error.message);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * Clear all problems from database
 */
exports.clearAllProblems = async () => {
  let client;
  try {
    client = await pool.connect();
    
    console.log('🗑️  Clearing all problems from database...');
    
    // Delete user progress first (due to foreign key constraint)
    await client.query('DELETE FROM user_progress');
    console.log('✅ Deleted user progress');
    
    // Delete problems
    await client.query('DELETE FROM problems');
    console.log('✅ Deleted all problems');
    
    // Delete topics with no problems
    await client.query('DELETE FROM topics WHERE id NOT IN (SELECT DISTINCT topic_id FROM problems WHERE topic_id IS NOT NULL)');
    console.log('✅ Cleaned up empty topics');
    
    return { success: true, message: 'All problems cleared' };
    
  } catch (error) {
    console.error('Error clearing problems:', error.message);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * Get import statistics
 */
exports.getImportStats = async () => {
  try {
    const problemCount = await pool.query('SELECT COUNT(*) as count FROM problems');
    const topicCount = await pool.query('SELECT COUNT(*) as count FROM topics');
    const difficultyBreakdown = await pool.query(`
      SELECT difficulty, COUNT(*) as count 
      FROM problems 
      GROUP BY difficulty
    `);
    
    return {
      totalProblems: parseInt(problemCount.rows[0].count),
      totalTopics: parseInt(topicCount.rows[0].count),
      byDifficulty: difficultyBreakdown.rows
    };
    
  } catch (error) {
    console.error('Error getting import stats:', error.message);
    throw error;
  }
};
