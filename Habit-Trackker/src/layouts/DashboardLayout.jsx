import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileBottomBar from "../components/MobileBottomBar";
import AddHabitModal from "../components/AddHabitModal";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* PAGE CONTENT */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* MOBILE BOTTOM BAR */}
      <MobileBottomBar onAddHabit={() => setOpen(true)} />

      {open && <AddHabitModal onClose={() => setOpen(false)} />}
    </div>
  );
}
