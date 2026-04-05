import Task from "../models/task.model.js";
import { getUTCStartOfDay, getUTCEndOfDay } from "../utils/date.js";

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const start = getUTCStartOfDay(today);
    const end = getUTCEndOfDay(today);

    // Fetch all pending tasks + tasks done today
    const tasks = await Task.find({
      user: userId,
      $or: [
        { status: "pending" },
        { status: "done", updatedAt: { $gte: start, $lt: end } }
      ]
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: userId,
      title,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({ _id: id, user: userId });
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = task.status === "pending" ? "done" : "pending";
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
