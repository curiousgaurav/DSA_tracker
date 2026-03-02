const pool = require("../config/db");

exports.createProblem = async (req, res) => {
  try {
    const {
      title,
      difficulty,
      topic_id,
      platform,
      platform_link,
      youtube_link,
    } = req.body;

    const problem = await pool.query(
      `INSERT INTO problems 
      (title,difficulty,topic_id,platform,platform_link,youtube_link)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, difficulty, topic_id, platform, platform_link, youtube_link]
    );

    res.status(201).json(problem.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProblems = async (req, res) => {
  const problems = await pool.query(
    `SELECT problems.*, topics.name as topic_name
     FROM problems
     JOIN topics ON problems.topic_id = topics.id`
  );
  res.json(problems.rows);
};