import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WeeklyHabitGrid from "../components/WeeklyHabitGrid";
import HabitByDayList from "../components/HabitByDayList";

const MainPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN STRIP */}
        <div className="flex flex-1 overflow-hidden">
          {/* DAILY LIST */}
          <aside className="w-72 shrink-0 border-r border-zinc-800 p-4 overflow-y-auto">
            <HabitByDayList />
          </aside>

          {/* WEEKLY GRID */}
          <main className="flex-1 overflow-auto">
            <WeeklyHabitGrid />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
