import ActivityLog from "../models/activityLog.model.js";
import Habit from "../models/habit.model.js";
import User from "../models/user.model.js";
import {
  getAppDateKey,
  getUTCStartOfDay,
  getUTCEndOfDay,
} from "../utils/date.js";
import {
  isHabitScheduledOnDate,
  syncAutoVerifiedHabitsForDate,
} from "../services/platformSync.service.js";

export const getStatusByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    const target = new Date(date);
    const start = getUTCStartOfDay(target);
    const end = getUTCEndOfDay(target);

    await syncAutoVerifiedHabitsForDate(userId, target);

    const allHabits = await Habit.find({ user: userId });
    const habits = allHabits.filter((habit) =>
      isHabitScheduledOnDate(habit, target)
    );

    const logs = await ActivityLog.find({
      user: userId,
      date: { $gte: start, $lt: end },
    });

    const response = habits.map((habit) => {
      const log = logs.find((entry) => entry.habit.toString() === habit._id.toString());

      return {
        habitId: habit._id,
        title: habit.title,
        done: log?.status === "done",
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPublicStatusByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    const user = await User.findOne({ username }).lean();

    if (!user || !user.profilePublic) {
      return res.status(404).json({ message: "Public profile not found" });
    }

    const target = new Date(date);
    const start = getUTCStartOfDay(target);
    const end = getUTCEndOfDay(target);

    await syncAutoVerifiedHabitsForDate(user._id, target);

    const allHabits = await Habit.find({ user: user._id });
    const habits = allHabits.filter((habit) => isHabitScheduledOnDate(habit, target));

    const logs = await ActivityLog.find({
      user: user._id,
      date: { $gte: start, $lt: end },
    });

    const response = habits.map((habit) => {
      const log = logs.find((entry) => entry.habit.toString() === habit._id.toString());

      return {
        habitId: habit._id,
        title: habit.title,
        done: log?.status === "done",
        type: habit.type,
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleHabitByDate = async (req, res) => {
  try {
    const { habitId, date } = req.body;
    const userId = req.user.id;

    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const target = getUTCStartOfDay(new Date(date));

    const existing = await ActivityLog.findOne({
      user: userId,
      habit: habitId,
      date: target,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ done: false });
    }

    await ActivityLog.create({
      user: userId,
      habit: habitId,
      habitType: habit.type,
      date: target,
      status: "done",
      confidence: 30,
    });

    res.json({ done: true });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getActivityRange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({ message: "startDate required" });
    }

    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await syncAutoVerifiedHabitsForDate(userId, today);

    const habits = await Habit.find({ user: userId }).lean();
    const logs = await ActivityLog.find({
      user: userId,
      date: { $gte: start, $lte: today },
    }).lean();

    const logMap = {};
    for (const log of logs) {
      const key = `${log.habit}_${getAppDateKey(log.date)}`;
      logMap[key] = {
        done: log.status === "done",
        confidence: log.confidence ?? 0,
      };
    }

    res.json({
      habits,
      logs: logMap,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const completeHabitToday = async (req, res) => {
  try {
    const userId = req.user.id;
    const habitId = req.params.habitId;

    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = getUTCStartOfDay(new Date());

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
      habitType: habit.type,
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
