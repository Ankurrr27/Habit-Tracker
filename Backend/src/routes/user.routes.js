import express from "express";
import {
  updateProfile,
  getUserByUsername,
  getUsers,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:username", auth, getUserByUsername);
router.put(
  "/profile",
  auth,
  upload.single("avatar"), // 🔥 REQUIRED
  updateProfile
);

export default router;
