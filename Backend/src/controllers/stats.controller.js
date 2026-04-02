import ActivityLog from "../models/activityLog.model.js";
import Habit from "../models/habit.model.js";
import {
  getAppDateKey,
  getUTCStartOfDay,
  getUTCEndOfDay,
} from "../utils/date.js";
import {
  isHabitScheduledOnDate,
  syncAutoVerifiedHabitsForDate,
} from "../services/platformSync.service.js";

export const getUserLevel = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await ActivityLog.find({ user: userId });

    if (!logs.length) {
      return res.json({ level: 0, streak: 0, avgConfidence: 0 });
    }

    const avgConfidence = Math.round(
      logs.reduce((sum, log) => sum + (log.confidence || 0), 0) / logs.length
    );

    const sorted = logs
      .filter((log) => log.status === "done")
      .sort((left, right) => right.date - left.date);

    let streak = 0;
    let current = getUTCStartOfDay(new Date());

    for (const log of sorted) {
      const date = getUTCStartOfDay(log.date);

      const diff = (current - date) / (1000 * 60 * 60 * 24);

      if (diff === 0 || diff === 1) {
        streak += 1;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    let level = 1;
    if (streak >= 30 && avgConfidence >= 85) level = 5;
    else if (streak >= 14 && avgConfidence >= 75) level = 4;
    else if (streak >= 7 && avgConfidence >= 60) level = 3;
    else if (streak >= 3 && avgConfidence >= 40) level = 2;

    res.json({ level, streak, avgConfidence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeeklyStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({ message: "startDate required" });
    }

    const start = getUTCStartOfDay(new Date(startDate));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 28);

    const habits = await Habit.find({ user: userId });
    const logs = await ActivityLog.find({
      user: userId,
      date: { $gte: start, $lt: end },
    });

    const logMap = {};

    logs.forEach((log) => {
      const dateKey = getAppDateKey(log.date);
      logMap[`${log.habit}_${dateKey}`] = {
        done: log.status === "done",
        confidence: log.confidence ?? 30,
      };
    });

    res.json({
      habits,
      logs: logMap,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const start = getUTCStartOfDay(today);
    const end = getUTCEndOfDay(today);

    await syncAutoVerifiedHabitsForDate(userId, today);

    const allHabits = await Habit.find({ user: userId });
    const habits = allHabits.filter((habit) =>
      isHabitScheduledOnDate(habit, today)
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
        frequency: habit.frequency,
        done: log?.status === "done",
        confidence: log?.confidence ?? 0,
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
