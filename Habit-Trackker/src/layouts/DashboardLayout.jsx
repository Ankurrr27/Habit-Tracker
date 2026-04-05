import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex bg-transparent text-text transition-colors relative min-h-screen w-full lg:overflow-hidden">
      <Sidebar />

      <main className="flex-1 w-full flex flex-col md:ml-[60px] border-l border-zinc-100 dark:border-zinc-900/50 pb-24 md:pb-0 h-auto lg:h-full lg:overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
