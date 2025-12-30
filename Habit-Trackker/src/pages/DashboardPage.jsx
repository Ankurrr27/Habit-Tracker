import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import HabitHeatmap from "../components/HabitHeatmap";
import HabitByDay from "../components/HabitByDay";
import RollingHabitGrid from "../components/RollingHabitGrid/RollingHabitGrid";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex flex-col">
      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        <div className="flex flex-1 overflow-hidden">

          {/* 🟦 LEFT HABIT PANEL */}
          <aside
            className={`
              flex flex-col
              border-r border-zinc-200 dark:border-zinc-950
              bg-zinc-50 dark:bg-black
              transition-[width] duration-300 ease-in-out
              ${collapsed ? "w-14" : "w-[260px]"}
            `}
          >
            {/* PANEL HEADER */}
            <div className="h-12 flex items-center justify-between px-3 border-b border-zinc-200 dark:border-zinc-950">
              {!collapsed && (
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Daily Habits
                </span>
              )}

              <button
                onClick={() => setCollapsed((v) => !v)}
                className="
                  p-1 rounded-md
                  hover:bg-zinc-200 dark:hover:bg-zinc-800
                  transition
                "
                aria-label="Toggle habit panel"
              >
                {collapsed ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>
            </div>

            {/* PANEL CONTENT */}
            <div
              className={`
                flex-1 overflow-y-auto
                transition-opacity duration-200
                ${collapsed ? "opacity-0 pointer-events-none" : "opacity-100"}
              `}
            >
              {!collapsed && (
                <div className="p-4">
                  <HabitByDay />
                </div>
              )}
            </div>
          </aside>

          {/* 🟩 MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-white dark:bg-black">
            {/* WEEKLY GRID */}
            <RollingHabitGrid />

            {/* YEAR HEATMAP */}
            <HabitHeatmap />
          </main>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
