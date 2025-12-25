import ActivityLog from "../models/ActivityLog.model.js";
import Habit from "../models/Habit.model.js";
import { getUTCStartOfDay } from "../utils/date.js";

export const completeHabitToday = async (req, res) => {
  try {
    const userId = req.user.id;
    const habitId = req.params.habitId;

    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // ✅ UTC DAY (REAL FIX)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const exists = await ActivityLog.findOne({
      user: userId,
      habit: habitId,
      date: today,
    });

    if (exists) {
      return res.status(400).json({
        message: "Already marked as done today",
      });
    }

    const log = await ActivityLog.create({
      user: userId,
      habit: habitId,
      date: today,
      status: "done",
      confidence: 30,
    });

    res.status(201).json({
      message: "Habit completed",
      log,
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