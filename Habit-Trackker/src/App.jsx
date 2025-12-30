import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import IntroPage from "./pages/IntroPage";
import Dashboard from "./pages/DashboardPage";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import AppLayout from "./layouts/AppLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import UsersPage from "./pages/UsersPage";

import TeamPage from "./pages/TeamPage";
import TeamsPage from "./pages/TeamsPage";
import ProjectPage from "./pages/ProjectPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 INTRO PAGE */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<IntroPage />} />
        </Route>

        {/* 🔓 AUTH */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* 🔐 APP */}
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

              {/* 🟣 TEAMS */}
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/projects" element={<ProjectPage />} />
              <Route path="/teams/:teamId" element={<TeamPage />} />

            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

