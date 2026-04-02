import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

/* PAGES */
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import IntroPage from "./pages/IntroPage";
import Dashboard from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import TeamsPage from "./pages/TeamsPage";
import TeamPage from "./pages/TeamPage";
import ProjectPage from "./pages/ProjectPage";
import CalendarPage from "./pages/CalendarPage";

/* ROUTES */
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

/* LAYOUTS */
import AppLayout from "./layouts/AppLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

export default function App() {
  /* =====================
     BACKEND WARM-UP
  ===================== */
  useEffect(() => {
    fetch("https://habit-tracker-ixsb.onrender.com/")
      .catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route element={<PublicRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<IntroPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* 🔐 PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<DashboardLayout />}>
              {/* DASHBOARD */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* PROFILE */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/u/:username" element={<ProfilePage />} />

              {/* USERS */}
              <Route path="/users" element={<UsersPage />} />

              {/* CALENDAR */}
              <Route path="/calendar" element={<CalendarPage />} />

              {/* TEAMS & PROJECTS */}
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teams/:teamId" element={<TeamPage />} />
              <Route path="/projects" element={<ProjectPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
