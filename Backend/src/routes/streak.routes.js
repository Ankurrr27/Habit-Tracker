import express from "express";
import { getHabitStreak } from "../controllers/streak.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:habitId", auth, getHabitStreak);

export default router;
