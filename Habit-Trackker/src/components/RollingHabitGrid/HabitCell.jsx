import { motion } from "framer-motion";
import { getHeatColor } from "../HabitHeatmap/heatmap";

export default function HabitCell({ isScheduled, isPast, log }) {
  if (!isScheduled) {
    return <div className="opacity-10" />;
  }

  const active = log?.done;

  return (
    <div
      className={`flex items-center justify-center ${
        isPast ? "opacity-40" : ""
      }`}
      style={{ perspective: 600 }}
    >
      <motion.div
        className={`
          w-[22px] h-[22px]
          
          ${active ? getHeatColor(log.confidence) : "bg-zinc-900"}
        `}
        initial={{
          scale: 0.85,
          opacity: 0,
          rotateX: -15,
          borderRadius: "4px",
        }}
        animate={{
          scale: 1,
          opacity: 1,
          rotateX: 0,
          borderRadius: "4px",
        }}
        whileHover={{
          scale: 1.3,
          rotateX: 12,
          rotateY: -12,
          borderRadius: "999px", // 🔥 square → circle
          boxShadow: active
            ? "0 0 16px rgba(16,185,129,0.65)"
            : "0 0 10px rgba(113,113,122,0.4)",
        }}
        whileTap={{
          scale: 1.1,
          rotateX: 0,
          rotateY: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 25,
        }}
      />
    </div>
  );
}
