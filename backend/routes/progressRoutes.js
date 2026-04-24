const express = require("express");
const {
  updateProgress,
  getStats,
  getStreak,
  getTopicStats,
  getLeaderboard
} = require("../controllers/progressController");

const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, updateProgress);
router.get("/stats", auth, getStats);
router.get("/streak", auth, getStreak);
router.get("/topic-stats", auth, getTopicStats);
router.get("/leaderboard", getLeaderboard);

module.exports = router;