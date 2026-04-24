# ⚡ LeetCode Integration - Complete Setup Guide

Your DSA Tracker now supports **fetching all LeetCode problems directly via GraphQL API**! 🚀

## 🎯 What's New?

✅ **Fetch ALL ~3000+ LeetCode problems** from their official GraphQL API  
✅ **Automatic topic/tag management** - no manual setup needed  
✅ **Smart deduplication** - won't create duplicates on re-import  
✅ **Transaction safety** - database rollback on errors  
✅ **Admin-only endpoints** - secure API for imports  
✅ **CLI tool** - command-line interface for bulk operations  
✅ **Rate limiting** - protects your IP from bans  

## 📋 Quick Path

**For Windows Users:**
```bash
# 1. Open terminal in backend folder
# 2. Run setup
QUICKSTART.bat

# 3. Choose import option (1 for full import)
# 4. Wait 15-30 minutes for import to complete
```

**For Mac/Linux Users:**
```bash
bash QUICKSTART.sh
```

**For Manual Setup:**
```bash
npm install
node migrate-problems.js all
npm run dev
```

---

## 📦 Installation & Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

This installs:
- `axios` - for GraphQL API requests
- All other existing dependencies

### Step 2: Verify Environment
Ensure `.env` has correct Supabase credentials:
```env
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
PORT=5000
```

### Step 3: Import LeetCode Problems

**Option A: Full Import (Recommended)**
```bash
node migrate-problems.js all
```
- Imports ~3000 problems
- Takes 15-30 minutes
- Do this once on initial setup

**Option B: By Difficulty**
```bash
node migrate-problems.js easy      # ~850 problems (2-5 mins)
node migrate-problems.js medium    # ~1200 problems (5-10 mins)
node migrate-problems.js hard      # ~800 problems (3-8 mins)
```

**Option C: Check Progress**
```bash
node migrate-problems.js stats
```

Output example:
```
=== Import Statistics ===
Total Problems: 2850
Total Topics: 25

Breakdown by Difficulty:
  Easy: 850
  Medium: 1200
  Hard: 800
```

---

## 🔧 Ways to Import Problems

### 1️⃣ CLI Script (Best for bulk operations)

**All Problems:**
```bash
node migrate-problems.js all
```

**Specific Difficulty:**
```bash
node migrate-problems.js easy
node migrate-problems.js medium
node migrate-problems.js hard
```

**Statistics:**
```bash
node migrate-problems.js stats
```

**Clear Database:**
```bash
node migrate-problems.js clear
```

### 2️⃣ HTTP API Endpoints (for integration)

All endpoints require **admin authentication** via JWT token.

**Import All:**
```bash
curl -X POST http://localhost:5000/api/import/import-problems \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json"
```

**Import Specific Difficulty:**
```bash
curl -X POST http://localhost:5000/api/import/import-problems/medium \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json"
```

**Get Statistics:**
```bash
curl -X GET http://localhost:5000/api/import/import-stats \
  -H "Authorization: Bearer <admin-token>"
```

**Clear Problems:**
```bash
curl -X DELETE http://localhost:5000/api/import/clear-problems \
  -H "Authorization: Bearer <admin-token>"
```

### 3️⃣ Code/Custom Implementation

```javascript
const leetcodeService = require('./services/leetcodeService');
const problemImportService = require('./services/problemImportService');

// Get all problems
const problems = await leetcodeService.getAllProblems();

// Import to database
await problemImportService.importAllProblems();

// Get statistics
const stats = await problemImportService.getImportStats();
```

See `EXAMPLES.js` for complete code examples.

---

## 📊 File Structure

```bash
backend/
├── services/
│   ├── leetcodeService.js          # ⭐ LeetCode GraphQL API
│   └── problemImportService.js     # ⭐ Database import logic
├── routes/
│   └── importRoutes.js             # ⭐ Import API endpoints
├── migrate-problems.js             # ⭐ CLI tool
├── QUICKSTART.bat                  # ⭐ Windows setup
├── QUICKSTART.sh                   # ⭐ Mac/Linux setup
├── LEETCODE_INTEGRATION.md         # ⭐ Detailed guide
├── EXAMPLES.js                     # ⭐ Code examples
└── server.js                       # Updated with import routes
```

---

## 🔄 Import Process Breakdown

### What Happens During Import

1. **Fetch from LeetCode GraphQL API**
   - Connects to `https://leetcode.com/graphql`
   - Fetches problems in batches of 50
   - Adds 500ms delays to avoid rate limiting

2. **Create Topics**
   - Automatically creates topics from problem tags
   - Examples: Array, String, DP, Graph, etc.
   - Reuses existing topics to avoid duplicates

3. **Insert Problems**
   - Checks if problem already exists
   - Skips duplicates
   - Stores full problem details
   - Links to platform_link on LeetCode

4. **Transaction Safety**
   - Uses database transactions
   - Rolls back on any error
   - Ensures data consistency

### Timeline for Full Import

| Step | Time | Action |
|------|------|--------|
| 0-5 min | Setup | Database connection, transaction start |
| 5-25 min | Fetch & Insert | LeetCode API calls + database inserts |
| 25-30 min | Finalization | Cleanup, stats, commit transaction |

---

## 📈 Data Stored

For each LeetCode problem, we store:

| Database Field | LeetCode Field | Example |
|---|---|---|
| `title` | problem.title | "Two Sum" |
| `difficulty` | problem.difficulty | "Easy" |
| `topic_id` → `topics.name` | problem.topicTags[0].name | "Array" |
| `platform` | hardcoded | "LeetCode" |
| `platform_link` | derived URL | "https://leetcode.com/problems/two-sum/" |
| `youtube_link` | none | NULL |

**Database Schema:**
```sql
problems (id, title, difficulty, topic_id, platform, platform_link, created_at)
topics (id, name, created_at)
user_progress (user_id, problem_id, status, notes, updated_at)
```

---

## 🛠️ Using Problems in Frontend

After import, problems are available via existing endpoints:

**Get all problems:**
```bash
GET /api/problems
```

**Get with filters (add these to problemController.js):**
```bash
GET /api/problems?difficulty=Medium&topic=Array
```

**Get problems with user progress:**
```bash
GET /api/problems/:id/progress
```

---

## ⚠️ Troubleshooting

### Issue: Slow Import
**Cause:** Network speed or LeetCode delays  
**Solution:** Normal! Takes 15-30 mins. Try during off-peak hours.

### Issue: Network Error During Import
```
Error: ECONNREFUSED or Network timeout
```
**Solution:**
1. Check internet connection
2. Wait 5 minutes
3. Try smaller batch: `node migrate-problems.js easy`

### Issue: Cannot Find Module 'axios'
```
Error: Cannot find module 'axios'
```
**Solution:** Run `npm install` in backend directory

### Issue: Database Connection Failed
```
Error: connect ECONNREFUSED at 127.0.0.1:5432
```
**Solution:**
1. Check `.env` DATABASE_URL
2. Verify Supabase connection
3. Test: `npm run dev` before importing

### Issue: Permission Denied Error
```
401 Unauthorized
```
**Solution:** Use admin account's JWT token for API endpoints

### Issue: Import Stops Midway
**Cause:** Network interruption or server timeout  
**Solution:**
1. Already imported problems won't duplicate
2. Just run the import again
3. Continue where it left off

---

## 📚 Reference Documentation

- **LeetCode Integration Guide:** [LEETCODE_INTEGRATION.md](LEETCODE_INTEGRATION.md)
- **Code Examples:** [EXAMPLES.js](EXAMPLES.js)
- **Schema:** [supabase_schema.sql](supabase_schema.sql)

---

## 🚀 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Import problems: Choose your method above
3. ✅ Check stats: `node migrate-problems.js stats`
4. ✅ Start server: `npm run dev`
5. ✅ Use in frontend: Problems now available via API

---

## 💡 Pro Tips

1. **First Time Setup:**
   - Import Easy problems first to test
   - Then Medium, then Hard
   - Safer than importing all at once

2. **Regular Updates:**
   - Re-run import monthly to get new problems
   - Existing problems won't duplicate
   - New problems automatically added

3. **Performance:**
   - Import during off-peak hours (3-6 AM)
   - Faster internet = faster import
   - Close other bandwidth-heavy apps

4. **Backup:**
   - Before importing, backup your database
   - Use `pg_dump` for PostgreSQL backup

---

## 🔐 Security & Rate Limiting

✅ **Protected Endpoints**
- All import routes require admin authentication
- Non-admin users get 403 Forbidden

✅ **Rate Limiting**
- Built-in 500ms delays between API calls
- Respects LeetCode's API limits
- Won't get your IP blocked

✅ **Data Protection**
- Transaction rollback on errors
- No partial/corrupted data
- Automatic deduplication

---

## 📞 Need Help?

Check these resources in order:
1. This file (README_SETUP.md)
2. [LEETCODE_INTEGRATION.md](LEETCODE_INTEGRATION.md) - Detailed guide
3. [EXAMPLES.js](EXAMPLES.js) - Code examples
4. Error message in console - usually very helpful!

---

**You're all set! 🎉 Start importing and building your DSA tracker!**

---

*Last Updated: March 2024*  
*LeetCode GraphQL API Integration v1.0*
