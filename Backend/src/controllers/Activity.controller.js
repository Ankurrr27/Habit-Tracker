import mongoose from "mongoose";
import ActivityLog from "../models/ActivityLog.model.js";
import Habit from "../models/Habit.model.js";
import Proof from "../models/Proof.model.js";
import { getUTCStartOfDay, getUTCEndOfDay, getUTCDayKey } from "../utils/date.js";



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




export const getHabitStreak = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.id;

    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const logs = await ActivityLog.find({
      user: userId,
      habit: habitId,
      status: "done",
    }).sort({ date: -1 });

    if (!logs.length) {
      return res.json({ habitId, streak: 0 });
    }

    const logDates = new Set(
      logs.map((l) =>
        getUTCStartOfDay(l.date).toISOString()
      )
    );

    let streak = 0;
    let cursor = getUTCStartOfDay(new Date());

    // ⛔ stop streak if habit duration ended
    if (habit.endDate) {
      const endUTC = getUTCStartOfDay(habit.endDate);
      if (cursor > endUTC) {
        cursor = endUTC;
      }
    }

    while (true) {
      const cursorISO = cursor.toISOString();
      const dayKey = getUTCDayKey(cursor);

      // 🧠 DAILY
      if (habit.frequency === "daily") {
        if (!logDates.has(cursorISO)) break;
        streak++;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
        continue;
      }

      // 🧠 WEEKLY
      if (habit.frequency === "weekly") {
        if (!habit.days.includes(dayKey)) {
          cursor.setUTCDate(cursor.getUTCDate() - 1);
          continue;
        }

        if (!logDates.has(cursorISO)) break;
        streak++;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
        continue;
      }

      // 🧠 INTERVAL (every N days)
      if (habit.frequency === "interval") {
        if (!logDates.has(cursorISO)) break;

        streak++;
        cursor.setUTCDate(cursor.getUTCDate() - habit.intervalDays);
        continue;
      }

      break;
    }

    res.json({ habitId, streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





export const addProof = async (req, res) => {
  try {
    const { logId } = req.params;
    const { type, value } = req.body;

    // basic validation
    if (!type || !value) {
      return res.status(400).json({ message: "Proof type and value required" });
    }

    const log = await ActivityLog.findById(logId);
    if (!log) {
      return res.status(404).json({ message: "Activity log not found" });
    }

    // create proof
    await Proof.create({
      activityLog: logId,
      type,
      value,
      weight: 30, // simple rule
    });

    // increase confidence (cap at 100)
    log.confidence = Math.min(log.confidence + 30, 100);
    await log.save();

    res.json({
      message: "Proof added",
      confidence: log.confidence,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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


export const addHabit = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      title,
      frequency,
      days,
      intervalDays,
      durationDays,      // 🔥 NEW
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
    const dayKey = getUTCDayKey(target);

    const habits = await Habit.find({
      user: userId,
      $or: [
        { frequency: "daily" },
        { frequency: "weekly", days: dayKey },
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
        done: log?.status === "done",
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





export const getActivityHeatmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = Number(req.query.year) || new Date().getFullYear();

    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));

    const data = await ActivityLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          status: "done",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
              timezone: "Asia/Kolkata",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Heatmap error:", err);
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
      habitType: habit.type, // ✅ THIS WAS MISSING
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
