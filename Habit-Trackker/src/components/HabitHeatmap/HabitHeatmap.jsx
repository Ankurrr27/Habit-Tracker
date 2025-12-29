import { motion } from "framer-motion";
import { useHabitHeatmap } from "./useHabitHeatmap";
import HeatmapGrid from "./HeatmapGrid";
import HeatmapLegend from "./HeatmapLegend";

export default function HabitHeatmap() {
  const { days, today, loading, getDailyIntensity } = useHabitHeatmap();

  if (loading) {
    return <div className="p-8 text-zinc-600 text-xs">Loading heatmap…</div>;
  }

  return (
    <motion.div
      className="
        bg-zinc-950
        rounded-2xl
        p-8
      "
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ===== HEADER (FULL-WIDTH BORDER) ===== */}
      <div
        className="
          -mx-8              /* ⬅ stretch to edges */
          px-8               /* ⬅ restore inner padding */
          mb-6
          pb-4
          flex items-start justify-between
          border-b border-zinc-800
        "
      >
        <div>
          <h3 className="text-sm font-semibold text-white">
            Habit Density
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
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
