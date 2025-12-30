import { motion } from "framer-motion";
import { useHabitHeatmap } from "./useHabitHeatmap";
import HeatmapGrid from "./HeatmapGrid";
import HeatmapLegend from "./HeatmapLegend";

export default function HabitHeatmap() {
  const { days, today, loading, getDailyIntensity } = useHabitHeatmap();

  if (loading) {
    return (
      <div className="p-8 text-xs text-zinc-700 dark:text-zinc-600">
        Loading heatmap…
      </div>
    );
  }

  return (
    <motion.div
      className="
        rounded-2xl
        p-8
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
      "
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ===== HEADER ===== */}
      <div
        className="
          -mx-8
          px-8
          mb-6
          pb-4
          flex items-start justify-between
          border-b border-zinc-200 dark:border-zinc-800
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

      {/* ===== GRID ===== */}
      <HeatmapGrid
        days={days}
        today={today}
        getDailyIntensity={getDailyIntensity}
      />
    </motion.div>
  );
}
