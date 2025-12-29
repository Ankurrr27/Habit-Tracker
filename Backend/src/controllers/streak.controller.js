import ActivityLog from "../models/activityLog.model.js";
import Habit from "../models/habit.model.js";
import {
  getUTCStartOfDay,
  getUTCDayKey,
} from "../utils/date.js";



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

