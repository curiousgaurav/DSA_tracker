const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Get all problems (for users)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM problems ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch problems" });
  }
});

module.exports = router;