import express from "express";
import authMiddleware from "../middlewares/Auth.middleware.js";
import {
  addProof,
  getWeeklyStatus,
  toggleHabitByDate,
  getActivityHeatmap,
  getHabitStreak,
  getStatusByDate,
  getTodayStatus,
  getUserLevel,
} from "../controllers/Activity.controller.js";

const router = express.Router();

// 🔐 Apply auth to ALL routes
router.use(authMiddleware);

// ================= ACTIVITY =================
router.get("/today", getTodayStatus);
router.get("/streak/:habitId", getHabitStreak);
router.post("/:logId/proof", addProof);
router.get("/level", getUserLevel);
router.get("/", getStatusByDate); // /activity?date=
router.get("/heatmap", getActivityHeatmap);

// 🔥 WEEKLY GRID
router.get("/weekly", getWeeklyStatus);
router.post("/toggle", toggleHabitByDate);

export default router;
