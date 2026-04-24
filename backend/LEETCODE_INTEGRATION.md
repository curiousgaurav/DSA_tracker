# LeetCode Integration Guide 🚀

This guide will help you set up and use the LeetCode GraphQL API integration to fetch and manage all LeetCode problems in your DSA Tracker.

## Overview

The LeetCode integration includes:
- **LeetCode GraphQL Service** - Fetches problems directly from LeetCode
- **Problem Import Service** - Manages database imports and transactions
- **Admin API Endpoints** - Provides HTTP endpoints for importing problems
- **CLI Migration Script** - Command-line tool for bulk operations

## 🔧 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

This includes the new `axios` dependency needed for GraphQL requests.

### 2. Update Environment Variables

Make sure your `.env` file has:

```env
DATABASE_URL=your_supabase_connection_string
PORT=5000
```

## 📥 Importing Problems

### Option 1: Using the CLI Script (Recommended)

```bash
# Import ALL problems from LeetCode
node migrate-problems.js all

# Import only Easy problems
node migrate-problems.js easy

# Import only Medium problems
node migrate-problems.js medium

# Import only Hard problems
node migrate-problems.js hard

# View current statistics
node migrate-problems.js stats

# Clear all problems
node migrate-problems.js clear
```

**First Run (Import All Problems):**
- Expected time: 15-30 minutes (depends on internet speed)
- Will fetch ~3000+ problems
- Includes automatic delays to avoid rate limiting

### Option 2: Using HTTP Endpoints (with Admin Privileges)

All endpoints require admin authentication via JWT token.

#### Import All Problems
```bash
POST /api/import/import-problems
Authorization: Bearer <admin-token>
```

Response:
```json
{
  "success": true,
  "message": "Problems imported successfully",
  "data": {
    "imported": 2850,
    "skipped": 45,
    "total": 2895
  }
}
```

#### Import by Difficulty
```bash
POST /api/import/import-problems/:difficulty
Authorization: Bearer <admin-token>
```

Example:
```bash
POST /api/import/import-problems/medium
```

Response:
```json
{
  "success": true,
  "data": {
    "difficulty": "Medium",
    "imported": 1200,
    "skipped": 15,
    "total": 1215
  }
}
```

#### Get Import Statistics
```bash
GET /api/import/import-stats
Authorization: Bearer <admin-token>
```

Response:
```json
{
  "success": true,
  "data": {
    "totalProblems": 2850,
    "totalTopics": 25,
    "byDifficulty": [
      { "difficulty": "Easy", "count": 850 },
      { "difficulty": "Medium", "count": 1200 },
      { "difficulty": "Hard", "count": 800 }
    ]
  }
}
```

#### Clear All Problems
```bash
DELETE /api/import/clear-problems
Authorization: Bearer <admin-token>
```

## 📊 What Gets Imported

For each problem, the following data is stored:

| Field | Value |
|-------|-------|
| **Title** | Problem title (e.g., "Two Sum") |
| **Difficulty** | Easy / Medium / Hard |
| **Topic/Tags** | Automatically grouped by first topic tag |
| **Platform** | Always "LeetCode" |
| **Platform Link** | Direct LeetCode URL |
| **Issue ID** | LeetCode problem ID |

Example problem in database:
```
ID: 1
Title: Two Sum
Difficulty: Easy
Topic: Array
Platform: LeetCode
Platform Link: https://leetcode.com/problems/two-sum/
Created: 2024-03-21
```

## 🔍 Key Features

### 1. **Automatic Topic/Tag Management**
- Topics are automatically created from LeetCode's tag system
- No manual topic setup needed
- Examples: Array, String, Dynamic Programming, Graph, etc.

### 2. **Smart Deduplication**
- Automatically skips problems that already exist
- Safe to run multiple times
- Won't create duplicates

### 3. **Transaction Safety**
- Uses database transactions
- If import fails, all changes are rolled back
- Data consistency guaranteed

### 4. **Rate Limiting Protection**
- Built-in 500ms delays between API calls
- Respects LeetCode's API limits
- Won't get IP blocked

### 5. **Progress Tracking**
- Real-time import progress in console
- Statistics every 100 problems
- Shows imported, skipped, and total counts

## 📈 Usage Examples

### Example 1: Start with Easy Problems
```bash
# First, import only Easy problems to test
node migrate-problems.js easy

# Check stats
node migrate-problems.js stats

# If successful, import Medium
node migrate-problems.js medium

# Then Hard
node migrate-problems.js hard
```

### Example 2: Full Import
```bash
# Import all problems at once
node migrate-problems.js all

# Takes ~15-30 minutes depending on connection
```

### Example 3: Update Statistics
```bash
# After import, check distribution
node migrate-problems.js stats

# Output shows breakdown by difficulty
```

## 🛠️ Troubleshooting

### Issue: Import is slow
- **Cause**: Network speed or LeetCode server delays
- **Solution**: This is normal. Takes 15-30 minutes for full import
- **Tip**: Run during off-peak hours for faster speeds

### Issue: Import fails with network error
```
Error: ECONNREFUSED or Network timeout
```
- **Cause**: Internet connection issue or LeetCode API temporarily down
- **Solution**: 
  1. Check your internet connection
  2. Wait a few minutes and try again
  3. Try importing a smaller subset (e.g., `easy`)

### Issue: "Cannot find module 'axios'"
```
Error: Cannot find module 'axios'
```
- **Solution**: Run `npm install` in the backend folder

### Issue: Database connection failed
```
Error: connect ECONNREFUSED
```
- **Solution**: 
  1. Check `.env` file has correct DATABASE_URL
  2. Verify Supabase connection is working
  3. Run: `npm run dev` to test database connection first

### Issue: Permission denied (Admin required)
```
Error: 401 Unauthorized
```
- **Solution**: Use an admin account's JWT token in the Authorization header

## 🔒 Security Notes

1. **Admin-only Endpoints**: All import endpoints require admin authentication
2. **Rate Limiting**: Built-in delays prevent abuse
3. **Data Validation**: Checks for duplicates before inserting
4. **Transaction Safety**: Automatic rollback on errors

## 📝 API Reference

### LeetCode Service Methods

```javascript
// Get all problems (useful for custom logic)
const allProblems = await leetcodeService.getAllProblems();

// Get problems by difficulty
const easyProblems = await leetcodeService.getProblemsByDifficulty('Easy');

// Get problems by tag
const arrayProblems = await leetcodeService.getProblemsByTag('array');

// Get single problem details
const problem = await leetcodeService.fetchProblemDetails('two-sum');
```

### Problem Import Service Methods

```javascript
// Import all problems
await problemImportService.importAllProblems();

// Import by difficulty
await problemImportService.importProblemsByDifficulty('Medium');

// Get stats
const stats = await problemImportService.getImportStats();

// Clear all problems
await problemImportService.clearAllProblems();
```

## 📚 Database Schema

Problems are stored in the `problems` table:

```sql
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  topic_id INTEGER,
  platform VARCHAR(100),
  platform_link VARCHAR(500),
  youtube_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_progress (
  user_id INTEGER NOT NULL,
  problem_id INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, problem_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (problem_id) REFERENCES problems(id)
);
```

## 🎯 Next Steps

1. **Install dependencies**: `npm install`
2. **Import problems**: `node migrate-problems.js all`
3. **Check stats**: `node migrate-problems.js stats`
4. **Start server**: `npm run dev`
5. **Use in frontend**: Problems are now available via `/api/problems` endpoint

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify `.env` configuration
3. Check database connection
4. View console logs for detailed error messages
5. Ensure you have admin privileges for API endpoints

---

**Happy tracking! 🎯**
