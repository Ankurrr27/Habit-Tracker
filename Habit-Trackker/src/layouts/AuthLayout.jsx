// src/layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Outlet />
    </div>
  );
}
