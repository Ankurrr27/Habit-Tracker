import ActivityLog from "../models/activityLog.model.js";
import Habit from "../models/habit.model.js";
import { getUTCStartOfDay } from "../utils/date.js";

export const addHabit = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      title,
      frequency,
      days,
      intervalDays,
      durationDays, // 🔥 NEW
      verificationRule,
      githubRepo,
    } = req.body;

    if (!title || !frequency) {
      return res.status(400).json({ message: "Title and frequency required" });
    }

    if (frequency === "weekly" && (!Array.isArray(days) || days.length === 0)) {
      return res
        .status(400)
        .json({ message: "Weekly habits need selected days" });
    }

    if (frequency === "interval" && (!intervalDays || intervalDays < 1)) {
      return res
        .status(400)
        .json({ message: "Interval habits need intervalDays >= 1" });
    }

    if (verificationRule === "github" && !githubRepo) {
      return res
        .status(400)
        .json({ message: "GitHub repo required for github verification" });
    }

    // 🧠 duration logic
    let endDate = null;
    if (durationDays && durationDays > 0) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + Number(durationDays));
    }

    const habit = await Habit.create({
      user: userId,
      title: title.trim(),
      frequency,

      // clean frequency-specific fields
      days: frequency === "weekly" ? days : [],
      intervalDays: frequency === "interval" ? intervalDays : undefined,

      startDate: new Date(),
      endDate,

      verificationRule: verificationRule || "manual",
      githubRepo: verificationRule === "github" ? githubRepo : undefined,
    });

    res.status(201).json({
      message: "Habit created",
      habitId: habit._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;

    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // 🔥 delete all logs first
    await ActivityLog.deleteMany({
      user: userId,
      habit: habitId,
    });

    // 🔥 delete habit
    await habit.deleteOne();

    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
