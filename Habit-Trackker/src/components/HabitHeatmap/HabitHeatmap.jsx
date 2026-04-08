import { useMemo } from "react";
import { motion as Motion } from "framer-motion";
import { useDashboard } from "../../context/useDashboard";
import { startOfAppDay, addAppDays } from "../../utils/date";
import HeatmapGrid from "./HeatmapGrid";
import HeatmapLegend from "./HeatmapLegend";

export default function HabitHeatmap() {
  const { loading, getDailyIntensity } = useDashboard();
  const DESKTOP_DAYS = 240; // Last ~8 months on laptop/desktop

  const today = useMemo(() => startOfAppDay(new Date()), []);
  const days = useMemo(() => {
    const start = addAppDays(today, -(DESKTOP_DAYS - 1));
    return Array.from({ length: DESKTOP_DAYS }, (_, index) => addAppDays(start, index));
  }, [today]);

  if (loading) {
    return (
      <div className="w-full h-full p-8 animate-pulse">
        <div className="flex items-start justify-between mb-8 pb-4">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-zinc-100 dark:bg-zinc-900 rounded-md" />
            <div className="h-3 w-40 bg-zinc-50 dark:bg-zinc-900/40 rounded-md" />
          </div>
          <div className="h-3 w-40 bg-zinc-50 dark:bg-zinc-900/40 rounded-md" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16px,16px))] gap-[3px]">
          {Array.from({ length: DESKTOP_DAYS }).map((_, i) => (
            <div key={i} className="h-[16px] w-[16px] bg-zinc-100 dark:bg-zinc-900 rounded-[3px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Motion.div
      className="w-full h-full p-5 sm:p-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="
          -mx-5 mb-5 px-5 sm:-mx-8 sm:mb-6 sm:px-8
          pb-4
          flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between
        "
      >
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Habit Density
          </h3>
          <p className="text-[10px] uppercase tracking-wide text-zinc-500 lg:hidden">
            Last 2 months
          </p>
          <p className="text-[10px] uppercase tracking-wide text-zinc-500 hidden lg:block">
            Last 8 months
          </p>
        </div>

        <HeatmapLegend />
      </div>

      <div className="lg:hidden">
        <HeatmapGrid
          days={days.slice(-60)}
          today={today}
          getDailyIntensity={getDailyIntensity}
        />
      </div>
      <div className="hidden lg:block">
        <HeatmapGrid
          days={days}
          today={today}
          getDailyIntensity={getDailyIntensity}
        />
      </div>
    </Motion.div>
  );
}
