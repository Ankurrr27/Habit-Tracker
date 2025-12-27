import express from "express";
import cors from "cors";

import habitRoutes from "./routes/Habit.routes.js";
import authRoutes from "./routes/Auth.routes.js";
import activityRoutes from "./routes/Activity.routes.js";
import usersRoutes from "./routes/Users.routes.js"; // ✅ FIXED

const app = express();

/* =====================
   CORS CONFIG
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
app.use("/habits", habitRoutes);
app.use("/auth", authRoutes);
app.use("/activity", activityRoutes);
app.use("/users", usersRoutes); // ✅ NOW WORKS

app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
