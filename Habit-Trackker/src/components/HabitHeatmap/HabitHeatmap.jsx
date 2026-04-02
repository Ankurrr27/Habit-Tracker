import { motion as Motion } from "framer-motion";
import { useHabitHeatmap } from "./useHabitHeatmap";
import HeatmapGrid from "./HeatmapGrid";
import HeatmapLegend from "./HeatmapLegend";

export default function HabitHeatmap() {
  const { days, today, loading, getDailyIntensity } = useHabitHeatmap();

  if (loading) {
    return (
      <div className="p-8 text-xs text-zinc-700 dark:text-zinc-600">
        Loading heatmap...
      </div>
    );
  }

  return (
    <Motion.div
      className="
        rounded-[1.5rem]
        p-5 sm:p-8
        bg-white dark:bg-zinc-950
        shadow-sm
      "
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="
          -mx-5 mb-5 px-5 sm:-mx-8 sm:mb-6 sm:px-8
          pb-4
          flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between
          border-b border-zinc-200/70 dark:border-zinc-800
        "
      >
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Habit Density
          </h3>
          <p className="text-[10px] uppercase tracking-wide text-zinc-500">
            Last 365 days
          </p>
        </div>

        <HeatmapLegend />
      </div>

      <HeatmapGrid
        days={days}
        today={today}
        getDailyIntensity={getDailyIntensity}
      />
    </Motion.div>
  );
}
