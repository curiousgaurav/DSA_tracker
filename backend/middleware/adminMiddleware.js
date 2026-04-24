const pool = require("../config/db");

const adminMiddleware = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      "SELECT role FROM users WHERE id=$1",
      [user_id]
    );

    if (result.rows[0].role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = adminMiddleware;