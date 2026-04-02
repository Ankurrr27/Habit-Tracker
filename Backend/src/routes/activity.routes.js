import express from "express";
import {
  toggleHabitByDate,
  completeHabitToday,
  getActivityRange,
  getStatusByDate,
  getPublicStatusByUsername,
} from "../controllers/activity.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/public/:username/status", getPublicStatusByUsername);
router.post("/toggle", auth, toggleHabitByDate);
router.post("/complete/:habitId", auth, completeHabitToday);
router.get("/range", auth, getActivityRange);
router.get("/status", auth, getStatusByDate);

export default router;
