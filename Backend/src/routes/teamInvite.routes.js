import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  inviteUser,
  getMyInvites,
  acceptInvite,
  rejectInvite,
  // createInvite,
  // joinViaInvite,
} from "../controllers/teamInvite.controller.js";

const router = express.Router();

/* =====================
   USER INVITES (PRIMARY)
===================== */

// invite a specific user (email / username)
router.post("/user", auth, inviteUser);

// get my pending invites
router.get("/my", auth, getMyInvites);

// accept / reject invite
router.post("/:inviteId/accept", auth, acceptInvite);
router.post("/:inviteId/reject", auth, rejectInvite);

/* =====================
   INVITE LINK (OPTIONAL)
===================== */

// create invite link for a team
// router.post("/:teamId/link", auth, createInvite);

// join team via link
// router.post("/join/:code", auth, joinViaInvite);

export default router;
