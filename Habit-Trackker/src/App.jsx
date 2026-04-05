import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

/* PAGES */
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import IntroPage from "./pages/IntroPage";
import Dashboard from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import CalendarPage from "./pages/CalendarPage";
import ExtensionPage from "./pages/ExtensionPage";
import AboutPage from "./pages/AboutPage";
import HowToUsePage from "./pages/HowToUsePage";

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

              {/* EXTENSION */}
              <Route path="/extension" element={<ExtensionPage />} />

              {/* INFO PAGES */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-to-use" element={<HowToUsePage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
