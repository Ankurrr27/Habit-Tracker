import express from "express";
import authMiddleware from "../middlewares/Auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  register,
  login,
  me,
  updateProfile,
} from "../controllers/Auth.controller.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);

router.get("/me", authMiddleware, me);
router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile
);

export default router;
