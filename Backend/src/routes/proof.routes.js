import express from "express";
import { addProof } from "../controllers/proof.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:logId", auth, addProof);

export default router;
