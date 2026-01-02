import express from "express";
import View from "../models/view.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let view = await View.findOne({ key: "website" });

    if (!view) {
      view = await View.create({ key: "website", count: 1 });
    } else {
      view.count += 1;
      await view.save();
    }

    res.json({ count: view.count });
  } catch (err) {
    console.error("view counter error:", err);
    res.status(500).json({ error: "view counter failed" });
  }
});

export default router;
