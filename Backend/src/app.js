import express from "express";
import cors from "cors";
import habitRoutes from "./routes/Habit.routes.js";
import authRoutes from "./routes/Auth.routes.js";
import activityRoutes from "./routes/Activity.routes.js"

const app = express();

/* =====================
   CORS CONFIG
===================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite frontend
      // add production frontend later
    ],
    credentials: true,
  })
);

/* =====================
   MIDDLEWARE
===================== */
app.use(express.json());

app.use("/habits", habitRoutes);
app.use("/auth", authRoutes);
app.use("/activity", activityRoutes);



app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
