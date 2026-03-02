const pool = require("../config/db");

exports.updateProgress = async (req, res) => {
  try {
    const { problem_id, status, notes } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO user_progress (user_id, problem_id, status, notes)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, problem_id)
       DO UPDATE SET status=$3, notes=$4, updated_at=NOW()
       RETURNING *`,
      [user_id, problem_id, status, notes]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
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