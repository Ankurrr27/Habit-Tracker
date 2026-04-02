import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HabitHeatmap from "../components/HabitHeatmap";
import HabitByDay from "../components/HabitByDay";
import RollingHabitGrid from "../components/RollingHabitGrid/RollingHabitGrid";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex flex-col bg-bg text-text">
      <div className="flex h-[calc(100vh-64px)] flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <aside
            className={`
              flex flex-col border-r border-black/10 bg-bg
              transition-[width] duration-300 ease-in-out
              ${collapsed ? "w-16" : "w-[320px]"}
            `}
          >
            <div className="flex h-14 items-center justify-between border-b border-black/10 px-3">
              {!collapsed && (
                <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                  Daily habits
                </span>
              )}

              <button
                onClick={() => setCollapsed((value) => !value)}
                className="rounded-md p-1 transition hover:bg-primary/10"
                aria-label="Toggle habit panel"
              >
                {collapsed ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {collapsed ? (
                <button
                  onClick={() => setCollapsed(false)}
                  className="
                    flex h-full w-full flex-col items-center justify-center gap-4
                    cursor-pointer select-none text-text/60 transition hover:text-text
                  "
                >
                  <span
                    className="
                      mt-4 rotate-180 pt-4 text-[14px] font-medium tracking-wide
                      [writing-mode:vertical-rl]
                    "
                  >
                    Today's habits
                  </span>
                </button>
              ) : (
                <div className="p-4">
                  <HabitByDay />
                </div>
              )}
            </div>
          </aside>

          <main className="flex flex-1 flex-col space-y-6 overflow-y-auto bg-bg p-6">
            <RollingHabitGrid />
            <HabitHeatmap />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
