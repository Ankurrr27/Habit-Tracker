import express from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { googleLogin } from "../controllers/googleAuth.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", auth, me);

export default router;
