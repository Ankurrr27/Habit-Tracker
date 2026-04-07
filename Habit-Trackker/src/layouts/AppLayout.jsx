import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";

export default function AppLayout() {
  const { user } = useAuth();
  const accentColor = user?.accentColor || "indigo";

  return (
    <div className={`theme-${accentColor} min-h-screen w-full flex flex-col bg-bg text-text transition-all duration-500 overflow-y-auto lg:overflow-hidden relative`}>
      {/* Immersive background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[rgba(var(--primary),0.15)] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[rgba(var(--primary),0.1)] blur-[120px]" />
      </div>

      <Navbar />
      <main className="flex-1 flex flex-col min-h-0 lg:overflow-hidden w-full relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
