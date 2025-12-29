import express from "express";
import {
  getTodayStatus,
  getWeeklyStatus,
  getUserLevel,
} from "../controllers/stats.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/today", auth, getTodayStatus);
router.get("/weekly", auth, getWeeklyStatus); // TEMP
router.get("/level", auth, getUserLevel);

export default router;
