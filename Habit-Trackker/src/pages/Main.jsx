import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import WeeklyHabitGrid from "../components/WeeklyHabitGrid";
import HabitByDayList from "../components/HabitByDayList";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContributionHeatmap from "../components/WeeklyHabitGrdi2";
import HabitHeatmap2 from "../components/HabitHeatMap2";

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        {/* LEFT APP SIDEBAR */}
        <Sidebar />

        {/* MAIN AREA */}
        <div className="flex flex-1 overflow-hidden">
          {/* 🟦 HABIT PANEL */}
          <aside
            className={`
              flex flex-col
              border-r border-zinc-800
              transition-[width] duration-300 ease-in-out
              ${collapsed ? "w-14" : "w-[260px]"}
              bg-black
            `}
          >
            {/* HEADER (STABLE HEIGHT) */}
            <div className="h-12 flex items-center justify-between px-3 border-b border-zinc-800">
              {!collapsed && (
                <span className="text-xs font-medium text-zinc-400">
                  Daily Habits
                </span>
              )}

              <button
                onClick={() => setCollapsed(!collapsed)}
                className="
                  p-1 rounded-md
                  hover:bg-zinc-800
                  transition
                "
              >
                {collapsed ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>
            </div>

            {/* CONTENT */}
            <div
              className={`
                flex-1 overflow-y-auto
                transition-opacity duration-200
                ${collapsed ? "opacity-0 pointer-events-none" : "opacity-100"}
              `}
            >
              {!collapsed && (
                <div className="p-4">
                  <HabitByDayList />
                </div>
              )}
            </div>
          </aside>

          {/* 🟩 GRID (NEVER JITTERS) */}
          {/* 🟩 MAIN CONTENT (STACKED) */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
            {/* TOP: Calendar / Weekly Grid */}
            <ContributionHeatmap />

            {/* BOTTOM: Year Heatmap */}
            <HabitHeatmap2 />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
