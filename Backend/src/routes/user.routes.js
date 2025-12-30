import express from "express";
import {
  updateProfile,
  getUserByUsername,
  getUsers,
  searchUsers,          // ✅ ADD THIS
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/* =====================
   USER SEARCH (🔥 MUST BE FIRST)
===================== */
router.get("/search", auth, searchUsers);

/* =====================
   LIST USERS
===================== */
router.get("/", auth, getUsers);

/* =====================
   GET PROFILE BY USERNAME
===================== */
router.get("/:username", auth, getUserByUsername);

/* =====================
   UPDATE PROFILE
===================== */
router.put(
  "/profile",
  auth,
  upload.single("avatar"), // 🔥 REQUIRED for PFP
  updateProfile
);

export default router;
