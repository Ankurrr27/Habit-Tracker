import express from "express";
import {
  updateProfile,
  getUserByUsername,
  getUsers,
  searchUsers,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/search", auth, searchUsers);
router.get("/friend-requests", auth, getFriendRequests);
router.post("/friend-requests", auth, sendFriendRequest);
router.post("/friend-requests/:requestId/accept", auth, acceptFriendRequest);
router.post("/friend-requests/:requestId/reject", auth, rejectFriendRequest);
router.get("/", auth, getUsers);
router.get("/:username", auth, getUserByUsername);
router.put("/profile", auth, upload.single("avatar"), updateProfile);

export default router;
