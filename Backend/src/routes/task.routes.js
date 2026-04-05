import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getTasks, createTask, toggleTask, deleteTask } from "../controllers/task.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);

export default router;
