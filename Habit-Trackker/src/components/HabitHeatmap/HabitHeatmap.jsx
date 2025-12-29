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
      className="bg-zinc-950 p-8 rounded-xl border border-zinc-800"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6 flex justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Habit Density</h3>
          <p className="text-[10px] text-zinc-500 uppercase">
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
    </motion.div>
  );
}
