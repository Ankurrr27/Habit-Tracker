import { motion } from "framer-motion";
import { getHeatColor } from "../HabitHeatmap/heatmap";

export default function HabitCell({ isScheduled, isPast, log }) {
  if (!isScheduled) {
    return <div className="opacity-10" />;
  }

  return (
    <div
      className={`flex items-center justify-center ${
        isPast ? "opacity-40" : ""
      }`}
    >
      <motion.div
        className={`w-5 h-5 rounded-sm border border-zinc-700 ${
          log?.done ? getHeatColor(log.confidence) : "bg-zinc-900"
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{
          scale: 1.25,
          boxShadow: "0 0 8px rgba(16,185,129,0.6)",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 22,
        }}
      />
    </div>
  );
}
