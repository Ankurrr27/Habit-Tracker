import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HabitHeatmap from "../components/HabitHeatmap";
import HabitByDay from "../components/HabitByDay";
import RollingHabitGrid from "../components/RollingHabitGrid/RollingHabitGrid";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-bg text-text">
      <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
        <aside
          className={`
            bg-bg/95 transition-[width] duration-300 ease-in-out lg:shrink-0
            ${collapsed ? "lg:w-20" : "lg:w-[320px]"}
          `}
        >
          <div className="mx-4 mt-4 overflow-hidden rounded-[1.75rem] bg-white shadow-sm dark:bg-zinc-950 lg:mx-0 lg:mt-0 lg:h-full lg:rounded-none lg:shadow-none">
            <div className="flex items-center justify-between px-4 py-4 lg:border-b lg:border-zinc-200/70 lg:dark:border-zinc-800">
              {!collapsed && (
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  Daily habits
                </span>
              )}

              <button
                onClick={() => setCollapsed((value) => !value)}
                className="rounded-xl p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                aria-label="Toggle habit panel"
              >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            <div className="lg:h-[calc(100%-64px)] lg:overflow-y-auto">
              {collapsed ? (
                <button
                  onClick={() => setCollapsed(false)}
                  className="
                    flex w-full items-center justify-center gap-3 px-4 pb-5 pt-2 text-sm font-medium text-text/60 transition hover:text-text
                    lg:h-full lg:flex-col lg:gap-4
                  "
                >
                  <span className="lg:mt-4 lg:rotate-180 lg:pt-4 lg:text-[14px] lg:tracking-wide lg:[writing-mode:vertical-rl]">
                    Today&apos;s habits
                  </span>
                </button>
              ) : (
                <div className="p-4">
                  <HabitByDay />
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-2 sm:px-6 lg:px-6 lg:py-6">
          <div className="space-y-6">
            <RollingHabitGrid />
            <HabitHeatmap />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
