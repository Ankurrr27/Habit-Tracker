import { motion } from "framer-motion";
import { toDateKey, getIntensityColor } from "./heatmap.utils";

export default function HeatmapGrid({
  days,
  today,
  getDailyIntensity,
}) {
  const todayKey = toDateKey(today);

  return (
    <div className="overflow-x-auto pb-4 custom-scrollbar">
      <div
        className="grid grid-flow-col grid-rows-7 gap-2"
        style={{ gridAutoColumns: "16px" }}
      >
        {days.map((day, i) => {
          const dateKey = toDateKey(day);
          const intensity = getDailyIntensity(dateKey);
          const isToday = dateKey === todayKey;

          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.0015 }}
              whileHover={{ scale: 1.35, zIndex: 20 }}
              className={`
                w-4 h-4 rounded-[3px]
                ${getIntensityColor(intensity)}
                ${isToday ? "ring-1 ring-violet-400" : ""}
                transition-colors
              `}
              title={`${dateKey} • ${Math.round(intensity)}% completed`}
            />
          );
        })}
      </div>
    </div>
  );
}
