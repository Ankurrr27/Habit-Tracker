import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import HabitHeatmap from "../components/HabitHeatmap";
import HabitByDay from "../components/HabitByDay";
import RollingHabitGrid from "../components/RollingHabitGrid/RollingHabitGrid";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className=" bg-bg text-text flex flex-col">
      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* 🟦 LEFT HABIT PANEL */}
          <aside
            className={`
              flex flex-col
              border-r border-black/10
              bg-bg
              transition-[width] duration-300 ease-in-out
              ${collapsed ? "w-14" : "w-[260px]"}
            `}
          >
            {/* PANEL HEADER */}
            <div className="h-12 flex items-center justify-between px-3 border-b border-black/10">
              {!collapsed && (
                <span className="text-xs font-medium opacity-70">
                  Daily Habits
                </span>
              )}

              <button
                onClick={() => setCollapsed((v) => !v)}
                className="
                  p-1 rounded-md
                  hover:bg-primary/10
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
            <div className="flex-1 overflow-y-auto">
              {collapsed ? (
                <div
                  onClick={() => setCollapsed(false)}
                  className="
      flex-1 flex flex-col items-center justify-center
      gap-4
      cursor-pointer select-none
      text-text/60
      hover:text-text
      transition
    "
                >
                  {/* ICON */}

                  {/* VERTICAL TEXT */}
                  <span
                    className="
        text-[14px] pt-4 mt-4 font-medium tracking-wide
        [writing-mode:vertical-rl]
        rotate-180
      "
                  >
                    Today’s Habits
                  </span>
                </div>
              ) : (
                <div className="p-4">
                  <HabitByDay />
                </div>
              )}
            </div>
          </aside>

          {/* 🟩 MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-bg">
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
