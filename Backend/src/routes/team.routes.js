import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createTeam,
  getMyTeams,
  getTeamById,
  updateMeetingLink,
} from "../controllers/team.controller.js";

const router = express.Router();

/* CREATE TEAM */
router.post("/", auth, createTeam);

/* GET MY TEAMS */
router.get("/my", auth, getMyTeams);

/* GET SINGLE TEAM */
router.get("/:teamId", auth, getTeamById);

/* UPDATE MEETING LINK */
router.put("/:teamId/meeting", auth, updateMeetingLink);

export default router;
