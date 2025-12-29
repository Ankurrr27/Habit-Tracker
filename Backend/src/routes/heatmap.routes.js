import express from "express";
import { getActivityHeatmap } from "../controllers/heatmap.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", auth, getActivityHeatmap);

export default router;
