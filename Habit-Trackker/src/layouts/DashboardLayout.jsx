import { Outlet } from "react-router-dom";
import { DashboardProvider } from "../context/DashboardContext";
import Sidebar from "../components/Sidebar/Sidebar";

export default function DashboardLayout() {
  return (
    <DashboardProvider>
      <div className="flex bg-transparent text-text transition-colors relative min-h-screen lg:h-screen w-full lg:overflow-hidden">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col md:ml-[60px] border-l border-[rgba(var(--primary),0.1)] dark:border-[rgba(var(--primary),0.15)] pb-24 md:pb-0 h-auto lg:h-full lg:overflow-hidden">
          <div className="w-full h-auto lg:h-full flex flex-col min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
