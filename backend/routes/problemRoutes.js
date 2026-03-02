const express = require("express");
const { createProblem, getProblems } = require("../controllers/problemController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", auth, role("admin"), createProblem);
router.get("/", auth, getProblems);

module.exports = router;