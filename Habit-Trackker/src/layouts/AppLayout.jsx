import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";

export default function AppLayout() {
  const { user } = useAuth();
  const accentColor = user?.accentColor || "indigo";

  return (
    <div
      className={`theme-${accentColor} relative flex w-full flex-col bg-bg text-text transition-all duration-500 ${
        user ? "h-screen overflow-hidden" : "min-h-screen overflow-y-auto"
      }`}
    >
      {/* Immersive background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[rgba(var(--primary),0.15)] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[rgba(var(--primary),0.1)] blur-[120px]" />
      </div>

      <Navbar />
      <main className="relative z-10 flex w-full flex-1 min-h-0 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
