import { motion as Motion } from "framer-motion";
import { getHeatColor } from "../HabitHeatmap/heatmap";

export default function HabitCell({ isScheduled, isPast, log, onClick }) {
  if (!isScheduled) {
    return <div className="opacity-10 w-[24px] h-[24px]" />;
  }

  const active = log?.done;

  return (
    <div
      className={`flex items-center justify-center ${
        isPast ? "opacity-60" : ""
      } cursor-pointer`}
      style={{ perspective: 600 }}
      onClick={onClick}
    >
      <Motion.div
        className={`
          w-[24px] h-[24px]
          rounded-[6px]
          transition-all duration-300
          ${
            active
              ? getHeatColor(log?.confidence || 100)
              : "bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/30"
          }
        `}
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        whileHover={{
          scale: 1.25,
          borderRadius: "8px",
          boxShadow: active
            ? "0 0 15px rgba(59,130,246,0.5)"
            : "0 0 10px rgba(113,113,122,0.3)",
          zIndex: 10,
        }}
        whileTap={{
          scale: 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      />
    </div>
  );
}
