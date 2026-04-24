#!/usr/bin/env node

/**
 * LeetCode Problem Import Script
 * Run this script to fetch and import all LeetCode problems into your database
 * 
 * Usage:
 *   node migrate-problems.js all                    # Import all problems
 *   node migrate-problems.js easy|medium|hard       # Import by difficulty
 *   node migrate-problems.js clear                  # Clear all problems
 *   node migrate-problems.js stats                  # Show statistics
 */

require('dotenv').config();
const problemImportService = require('./services/problemImportService');

const command = process.argv[2];

async function main() {
  try {
    if (!command) {
      console.log('❌ No command specified');
      showHelp();
      process.exit(1);
    }

    switch (command.toLowerCase()) {
      case 'all':
        console.log('🚀 Importing all LeetCode problems...');
        await problemImportService.importAllProblems();
        break;

      case 'easy':
      case 'medium':
      case 'hard':
        const difficulty = command.charAt(0).toUpperCase() + command.slice(1);
        console.log(`🚀 Importing ${difficulty} problems...`);
        await problemImportService.importProblemsByDifficulty(difficulty);
        break;

      case 'clear':
        console.log('🗑️  Clearing all problems...');
        await problemImportService.clearAllProblems();
        console.log('✅ Done!');
        break;

      case 'stats':
        console.log('📊 Fetching statistics...');
        const stats = await problemImportService.getImportStats();
        console.log('\n=== Import Statistics ===');
        console.log(`Total Problems: ${stats.totalProblems}`);
        console.log(`Total Topics: ${stats.totalTopics}`);
        console.log('\nBreakdown by Difficulty:');
        stats.byDifficulty.forEach(item => {
          console.log(`  ${item.difficulty}: ${item.count}`);
        });
        break;

      default:
        console.log(`❌ Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }

    console.log('\n✅ Operation completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
📚 LeetCode Problem Import Script

Usage:
  node migrate-problems.js <command>

Commands:
  all              Import all LeetCode problems
  easy             Import only Easy problems
  medium           Import only Medium problems
  hard             Import only Hard problems
  clear            Delete all problems from database
  stats            Show import statistics

Examples:
  node migrate-problems.js all
  node migrate-problems.js easy
  node migrate-problems.js clear
  node migrate-problems.js stats
`);
}

main();
