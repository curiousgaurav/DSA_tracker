const pool = require("../config/db");

/* =========================================
   UPDATE PROGRESS + HANDLE STREAK
========================================= */
exports.updateProgress = async (req, res) => {
  try {
    const { problem_id, status, notes } = req.body;
    const user_id = req.user.id;

    // Insert or update progress
    const result = await pool.query(
      `INSERT INTO user_progress (user_id, problem_id, status, notes)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, problem_id)
       DO UPDATE SET status=$3, notes=$4, updated_at=NOW()
       RETURNING *`,
      [user_id, problem_id, status, notes]
    );

    /* ========= STREAK LOGIC ========= */
    if (status === "solved") {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const userResult = await pool.query(
        "SELECT streak, last_solved_date FROM users WHERE id=$1",
        [user_id]
      );

      const user = userResult.rows[0];

      if (!user.last_solved_date) {
        await pool.query(
          "UPDATE users SET streak=1, last_solved_date=$1 WHERE id=$2",
          [today, user_id]
        );
      } else {
        const lastDate = new Date(user.last_solved_date);

        if (lastDate.toDateString() === yesterday.toDateString()) {
          // Continue streak
          await pool.query(
            "UPDATE users SET streak=streak+1, last_solved_date=$1 WHERE id=$2",
            [today, user_id]
          );
        } else if (lastDate.toDateString() !== today.toDateString()) {
          // Reset streak
          await pool.query(
            "UPDATE users SET streak=1, last_solved_date=$1 WHERE id=$2",
            [today, user_id]
          );
        }
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================
   DASHBOARD STATS
========================================= */
exports.getStats = async (req, res) => {
  try {
    const user_id = req.user.id;

    const total = await pool.query("SELECT COUNT(*) FROM problems");

    const solved = await pool.query(
      `SELECT COUNT(*) FROM user_progress 
       WHERE user_id=$1 AND status='solved'`,
      [user_id]
    );

    const difficultyStats = await pool.query(
      `SELECT p.difficulty, COUNT(*) 
       FROM user_progress up
       JOIN problems p ON up.problem_id = p.id
       WHERE up.user_id=$1 AND up.status='solved'
       GROUP BY p.difficulty`,
      [user_id]
    );

    res.json({
      total: parseInt(total.rows[0].count),
      solved: parseInt(solved.rows[0].count),
      difficulty: difficultyStats.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================
   GET USER STREAK
========================================= */
exports.getStreak = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      "SELECT streak FROM users WHERE id=$1",
      [user_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================
   TOPIC-WISE STATS
========================================= */
exports.getTopicStats = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT t.name,
              COUNT(up.problem_id) AS solved
       FROM topics t
       LEFT JOIN problems p ON p.topic_id = t.id
       LEFT JOIN user_progress up
         ON up.problem_id = p.id
         AND up.user_id=$1
         AND up.status='solved'
       GROUP BY t.name
       ORDER BY t.name`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================
   LEADERBOARD (TOP 10 USERS)
========================================= */
exports.getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.name,
              COUNT(up.problem_id) AS solved
       FROM users u
       LEFT JOIN user_progress up
         ON u.id = up.user_id
         AND up.status='solved'
       GROUP BY u.name
       ORDER BY solved DESC
       LIMIT 10`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};