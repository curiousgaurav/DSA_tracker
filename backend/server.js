const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const problemRoutes = require("./routes/problemRoutes");
const progressRoutes = require("./routes/progressRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/progress", progressRoutes);


app.get("/", (req, res) => {
  res.send("DSA Tracker API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});