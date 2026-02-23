const express = require("express");
const {
  createHabit,
  getHabits,
  completeHabit,
  deleteHabit,
  updateHabit, 
  getHabitLogs,
  getAnalyticsOverview,
} = require("../controllers/habitController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.get("/analytics/overview", protect, getAnalyticsOverview); // ← moved up
router.post("/:id/complete", protect, completeHabit);
router.delete("/:id", protect, deleteHabit);
router.put("/:id", protect, updateHabit);
router.get("/:id/logs", protect, getHabitLogs);
module.exports = router;
