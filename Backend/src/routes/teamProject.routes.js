import express from "express";
import auth from "../middleware/auth.middleware.js";
import { createProject } from "../controllers/teamProject.controller.js";

const router = express.Router();

router.post("/:teamId/projects", auth, createProject);

export default router;
