import ActivityLog from "../models/activityLog.model.js";
import Habit from "../models/habit.model.js";
import {
  getUTCStartOfDay,
  getUTCEndOfDay,
  getUTCDayKey,
} from "../utils/date.js";



export const getUserLevel = async (req, res) => {
  try {
    const userId = req.user.id;

    const logs = await ActivityLog.find({ user: userId });

    if (!logs.length) {
      return res.json({ level: 0, streak: 0, avgConfidence: 0 });
    }

    // average confidence
    const avgConfidence = Math.round(
      logs.reduce((sum, l) => sum + (l.confidence || 0), 0) / logs.length
    );

    // streak (overall, not per habit for now)
    const sorted = logs
      .filter((l) => l.status === "done")
      .sort((a, b) => b.date - a.date);

    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    for (const log of sorted) {
      const d = new Date(log.date);
      d.setHours(0, 0, 0, 0);

      const diff = (current - d) / (1000 * 60 * 60 * 24);

      if (diff === 0 || diff === 1) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    // level logic
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
    end.setUTCDate(end.getUTCDate() + 28); // 🔥 4 WEEKS

    const habits = await Habit.find({ user: userId });

    const logs = await ActivityLog.find({
      user: userId,
      date: { $gte: start, $lt: end },
    });

    const logMap = {};

    logs.forEach((log) => {
      const dateKey = log.date.toISOString().slice(0, 10);

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
    const dayKey = getUTCDayKey(today);

    const habits = await Habit.find({
  user: userId,
  $and: [
    {
      $or: [
        { frequency: "daily" },
        { frequency: "weekly", days: dayKey },
        { frequency: "interval" }, // 👈 include interval
      ],
    },
    {
      $or: [
        { endDate: null },
        { endDate: { $gte: start } }, // 👈 active habits only
      ],
    },
  ],
});


    const logs = await ActivityLog.find({
      user: userId,
      date: { $gte: start, $lt: end },
    });

    const response = habits.map((habit) => {
      const log = logs.find(
        (l) => l.habit.toString() === habit._id.toString()
      );

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
