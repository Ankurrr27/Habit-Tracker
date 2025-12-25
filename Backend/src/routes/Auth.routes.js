import express from "express";
import { register, login, me } from "../controllers/Auth.controller.js";
import authMiddleware from "../middlewares/Auth.middleware.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);


export default router;
