const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");
const { calculateStreak } = require("../utils/streakUtils");

// CREATE A HABIT
const createHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = await Habit.create({
      user: req.user._id,
      name,
      frequency,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL HABITS FOR LOGGED-IN USER
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({
      user: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK HABIT AS DONE (STREAK MAGIC 🔥)
const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Save habit log (prevents duplicate same-day logs)
    await HabitLog.create({
      habit: habit._id,
      date: today,
    });

    // Calculate streak
    const streakResult = calculateStreak(
      habit.frequency,
      habit.lastCompletedDate,
      habit.currentStreak,
      habit.longestStreak,
      today
    );

    habit.currentStreak = streakResult.currentStreak;
    habit.longestStreak = streakResult.longestStreak;
    habit.lastCompletedDate = streakResult.lastCompletedDate;

    await habit.save();

    res.json(habit);
  } catch (error) {
    // Duplicate completion protection
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Habit already completed this period" });
    }

    res.status(500).json({ message: error.message });
  }
};

// DELETE (SOFT DELETE) HABIT
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.isActive = false;
    await habit.save();

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body;

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Ensure user owns the habit
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    habit.name = name || habit.name;
    habit.frequency = frequency || habit.frequency;

    const updatedHabit = await habit.save();

    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getHabitLogs = async (req, res) => {
  try {
    const logs = await HabitLog.find({
      habit: req.params.id,
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAnalyticsOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const habits = await Habit.find({ user: userId, isActive: true });
    const habitIds = habits.map(h => h._id);

    const logs = await HabitLog.find({
      habit: { $in: habitIds }
    });

    const totalHabits = habits.length;
    const totalCompletions = logs.length;

    const completionsPerHabit = habits.map(habit => ({
      name: habit.name,
      completions: logs.filter(log =>
        log.habit.toString() === habit._id.toString()
      ).length
    }));

    const averageStreak =
      habits.length > 0
        ? (
            habits.reduce((sum, h) => sum + h.currentStreak, 0) /
            habits.length
          ).toFixed(1)
        : 0;

    const bestHabit =
      habits.length > 0
        ? habits.reduce((max, h) =>
            h.currentStreak > max.currentStreak ? h : max
          )
        : null;

    const last30Days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0,0,0,0);

      const count = logs.filter(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0,0,0,0);
        return logDate.getTime() === d.getTime();
      }).length;

      last30Days.push({
        date: d.toLocaleDateString(),
        completions: count
      });
    }

    res.json({
      totalHabits,
      totalCompletions,
      averageStreak,
      bestHabit: bestHabit ? bestHabit.name : null,
      bestHabitStreak: bestHabit ? bestHabit.currentStreak : 0,
      completionsPerHabit,
      last30Days
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createHabit,
  getHabits,
  completeHabit,
  deleteHabit,
  updateHabit,
  getHabitLogs,
  getAnalyticsOverview
};

