const pool = require("../config/db");

exports.createTopic = async (req, res) => {
  try {
    const { name } = req.body;
    const topic = await pool.query(
      "INSERT INTO topics (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(topic.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopics = async (req, res) => {
  const topics = await pool.query("SELECT * FROM topics ORDER BY id");
  res.json(topics.rows);
};