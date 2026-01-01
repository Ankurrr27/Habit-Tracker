import express from "express";
import cors from "cors";

/* ROUTES */
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import habitRoutes from "./routes/habit.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import streakRoutes from "./routes/streak.routes.js";
import heatmapRoutes from "./routes/heatmap.routes.js";
import proofRoutes from "./routes/proof.routes.js";
import teamRoutes from "./routes/team.routes.js";
import teamInviteRoutes from "./routes/teamInvite.routes.js";
import viewsRoutes from "./routes/views.routes.js";


const app = express();

/* =====================
   CORS
===================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://habit-tracker-ybku.vercel.app",
    ],
    credentials: true,
  })
);

/* =====================
   MIDDLEWARE
===================== */
app.use(express.json());

/* =====================
   ROUTES
===================== */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/habits", habitRoutes);
app.use("/activity", activityRoutes);
app.use("/stats", statsRoutes);
app.use("/streak", streakRoutes);
app.use("/heatmap", heatmapRoutes);
app.use("/proof", proofRoutes);
app.use("/teams", teamRoutes);
app.use("/team-invites", teamInviteRoutes);
app.use("/views", viewsRoutes);


app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
