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
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";


const app = express();

/* =====================
   CORS
===================== */
app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://habit-tracker-ybku.vercel.app",
      ];

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith("chrome-extension://") ||
        origin.startsWith("moz-extension://")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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
const mountApiRoutes = (prefix = "") => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/habits`, habitRoutes);
  app.use(`${prefix}/activity`, activityRoutes);
  app.use(`${prefix}/stats`, statsRoutes);
  app.use(`${prefix}/streak`, streakRoutes);
  app.use(`${prefix}/heatmap`, heatmapRoutes);
  app.use(`${prefix}/proof`, proofRoutes);
  app.use(`${prefix}/teams`, teamRoutes);
  app.use(`${prefix}/team-invites`, teamInviteRoutes);
  app.use(`${prefix}/views`, viewsRoutes);
  app.use(`${prefix}/projects`, projectRoutes);
  app.use(`${prefix}/tasks`, taskRoutes);
};

// Support both "/route" and "/api/route" to prevent env/baseURL mismatches.
mountApiRoutes();
mountApiRoutes("/api");


app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
