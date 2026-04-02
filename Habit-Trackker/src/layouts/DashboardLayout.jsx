import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-bg text-text transition-colors">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-24 md:h-screen md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
