import express from "express";
import {
  updateProfile,
  getUserByUsername,
  getUsers,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:username", auth, getUserByUsername);
router.put("/profile", auth, updateProfile);

export default router;
