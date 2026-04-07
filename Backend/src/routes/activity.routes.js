import { Router } from "express";
import {
  toggleHabitByDate,
  completeHabitToday,
  getActivityRange,
  getStatusByDate,
  getPublicStatusByUsername,
  syncActivity,
} from "../controllers/activity.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.get("/public/:username/status", getPublicStatusByUsername);
router.post("/toggle", auth, toggleHabitByDate);
router.post("/complete/:habitId", auth, completeHabitToday);
router.get("/range", auth, getActivityRange);
router.get("/status", auth, getStatusByDate);
router.get("/sync", auth, syncActivity);
router.post("/sync", auth, syncActivity);

export default router;
