import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  return (
    <div className="h-screen w-full flex flex-col bg-bg text-text transition-colors overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden w-full relative">
        <Outlet />
      </main>
    </div>
  );
}
