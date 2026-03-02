const express = require("express");
const { updateProgress, getStats } = require("../controllers/progressController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, updateProgress);
router.get("/stats", auth, getStats);

module.exports = router;