import express from "express";
import authMiddleware from "../middlewares/Auth.middleware.js";
import optionalAuth from "../middlewares/optionalAuth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

import {
  register,
  login,
  me,
  updateProfile,
} from "../controllers/Auth.controller.js";

import { getUserByUsername } from "../controllers/User.controller.js";

const router = express.Router();

/* =====================
   AUTH
===================== */
router.post("/register", upload.single("avatar"), register);
router.post("/login", login);

router.get("/me", authMiddleware, me);

router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile
);

/* =====================
   PUBLIC PROFILE (OPTIONAL AUTH)
===================== */
router.get(
  "/u/:username",
  optionalAuth,        // 🔥 THIS is what was missing
  getUserByUsername
);

export default router;
