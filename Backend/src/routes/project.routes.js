import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  getProjectWorkspace,
  createProject,
  createTask,
  updateTask,
} from "../controllers/project.controller.js";

const router = express.Router();

router.get("/workspace", auth, getProjectWorkspace);
router.post("/", auth, createProject);
router.post("/tasks", auth, createTask);
router.put("/tasks/:taskId", auth, updateTask);

export default router;
