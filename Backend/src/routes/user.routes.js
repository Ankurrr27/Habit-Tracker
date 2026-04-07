import { Router } from "express";
import {
  updateProfile,
  getUserByUsername,
  getPublicUserByUsername,
  getUsers,
  searchUsers,
  toggleFollow,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.get("/public/:username", getPublicUserByUsername);
router.get("/search", auth, searchUsers);
router.post("/:username/follow", auth, toggleFollow);
router.get("/", auth, getUsers);
router.get("/:username", auth, getUserByUsername);
router.put("/profile", auth, upload.single("avatar"), updateProfile);

export default router;
