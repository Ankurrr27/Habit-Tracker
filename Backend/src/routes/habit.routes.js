import { Router } from "express";
import {
  addHabit,
  getHabits,
  deleteHabit,
} from "../controllers/habit.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", auth, addHabit);
router.get("/", auth, getHabits);
router.delete("/:habitId", auth, deleteHabit);

export default router;
