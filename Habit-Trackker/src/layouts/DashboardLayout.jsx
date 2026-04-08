import { Outlet } from "react-router-dom";
import { DashboardProvider } from "../context/DashboardContext";
import Sidebar from "../components/Sidebar/Sidebar";

export default function DashboardLayout() {
  return (
    <DashboardProvider>
      <div className="relative flex h-full min-h-0 w-full overflow-hidden bg-transparent text-text transition-colors">
        <Sidebar />

        <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-white/30 pb-24 md:ml-[72px] md:pb-0 dark:border-white/5">
          <div className="flex h-full min-h-0 w-full flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
