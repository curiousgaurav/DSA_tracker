const express = require("express");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

/* Problem Routes */
router.get("/problems", auth, adminOnly, adminController.getAllProblems);
router.post("/problems", auth, adminOnly, adminController.createProblem);
router.put("/problems/:id", auth, adminOnly, adminController.updateProblem);
router.delete("/problems/:id", auth, adminOnly, adminController.deleteProblem);

/* User Routes */
router.get("/users", auth, adminOnly, adminController.getAllUsers);
router.put("/users/:id/role", auth, adminOnly, adminController.updateUserRole);

module.exports = router;