const pool = require("../config/db");

/* ===============================
   PROBLEM MANAGEMENT
=================================*/

// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM problems ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch problems" });
  }
};

// Create problem
exports.createProblem = async (req, res) => {
  const {
    title,
    difficulty,
    topic_id,
    platform,
    platform_link,
    youtube_link,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO problems 
       (title, difficulty, topic_id, platform, platform_link, youtube_link)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, difficulty, topic_id, platform, platform_link, youtube_link]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create problem" });
  }
};

// Update problem
exports.updateProblem = async (req, res) => {
  const {
    title,
    difficulty,
    topic_id,
    platform,
    platform_link,
    youtube_link,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE problems 
       SET title=$1, difficulty=$2, topic_id=$3, 
           platform=$4, platform_link=$5, youtube_link=$6
       WHERE id=$7
       RETURNING *`,
      [
        title,
        difficulty,
        topic_id,
        platform,
        platform_link,
        youtube_link,
        req.params.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to update problem" });
  }
};
// Delete problem
exports.deleteProblem = async (req, res) => {
  try {
    await pool.query("DELETE FROM problems WHERE id=$1", [
      req.params.id,
    ]);
    res.json({ message: "Problem deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete problem" });
  }
};

/* ===============================
   USER MANAGEMENT
=================================*/

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Change user role
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role",
      [role, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to update role" });
  }
};