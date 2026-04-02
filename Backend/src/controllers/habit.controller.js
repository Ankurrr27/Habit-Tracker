import ActivityLog from "../models/activityLog.model.js";
import Habit from "../models/habit.model.js";
import User from "../models/user.model.js";

export const addHabit = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      title,
      type,
      frequency,
      days,
      intervalDays,
      durationDays,
      verificationRule,
      githubRepo,
      platformSource,
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

    if (verificationRule === "platform" && !platformSource) {
      return res.status(400).json({
        message: "Choose a platform for automatic verification",
      });
    }

    if (verificationRule === "platform") {
      const user = await User.findById(userId).lean();
      const handle = user?.externalProfiles?.[platformSource]?.trim();

      if (!handle) {
        return res.status(400).json({
          message: `Add your ${platformSource} handle in profile first`,
        });
      }
    }

    let endDate = null;
    if (durationDays && durationDays > 0) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + Number(durationDays));
    }

    const habit = await Habit.create({
      user: userId,
      title: title.trim(),
      type: type === "hobby" ? "hobby" : "habit",
      frequency,
      days: frequency === "weekly" ? days : [],
      intervalDays: frequency === "interval" ? intervalDays : undefined,
      startDate: new Date(),
      endDate,
      verificationRule: verificationRule || "manual",
      githubRepo: verificationRule === "github" ? githubRepo : undefined,
      platformSource:
        verificationRule === "platform" ? platformSource : null,
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

    await ActivityLog.deleteMany({
      user: userId,
      habit: habitId,
    });

    await habit.deleteOne();

    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
