import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-bg text-text transition-colors overflow-y-auto lg:overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0 lg:overflow-hidden w-full relative">
        <Outlet />
      </main>
    </div>
  );
}
