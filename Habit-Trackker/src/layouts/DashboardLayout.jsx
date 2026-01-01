import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

export default function DashboardLayout() {
  return (
    <div
      className="
        flex min-h-screen
        bg-bg text-text
        transition-colors
      "
    >
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* PAGE CONTENT */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
