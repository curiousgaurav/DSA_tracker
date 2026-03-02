const express = require("express");
const { createTopic, getTopics } = require("../controllers/topicController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", auth, role("admin"), createTopic);
router.get("/", auth, getTopics);

module.exports = router;