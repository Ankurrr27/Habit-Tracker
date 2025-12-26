import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import IntroPage from "./pages/Intro";
import Dashboard from "./pages/Main";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import AppLayout from "./layouts/AppLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import UsersPage from "./pages/Users";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 INTRO PAGE (HEADER + FOOTER, NO SIDEBAR) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<IntroPage />} />
        </Route>

        {/* 🔓 AUTH (NO HEADER / FOOTER / SIDEBAR) */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* 🔐 DASHBOARD (HEADER + FOOTER + SIDEBAR) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/u/:username" element={<ProfilePage />} />
              <Route path="/users" element={<UsersPage />} />

            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
