const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const problemRoutes = require("./routes/problemRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adminRoutes = require("./routes/adminRoutes");
const importRoutes = require("./routes/importRoutes");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/import", importRoutes);

app.get("/", (req, res) => {
  res.send("DSA Tracker API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test database connection
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected (Supabase):", result.rows[0]);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
});