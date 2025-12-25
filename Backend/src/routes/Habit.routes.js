import express from "express";
import authMiddleware from "../middlewares/Auth.middleware.js";
import {
  getHabits,
  completeHabitToday,
} from "../controllers/Habit.controller.js";
import { addHabit } from "../controllers/Activity.controller.js";

const router = express.Router();

router.use(authMiddleware);

// ================= HABITS =================
router.get("/", getHabits);                     // GET /habits
router.post("/", addHabit);                     // POST /habits (create)
router.post("/:habitId/complete", completeHabitToday); // complete today

export default router;
