import { motion as Motion } from "framer-motion";

export const DayCell = ({ dateKey, intensity, isToday, colorClass, accentColor = "indigo" }) => {
  const accentRingMap = {
    indigo: "ring-indigo-500/60",
    pink: "ring-pink-500/60",
    rose: "ring-rose-400/60",
    sky: "ring-sky-400/60",
    emerald: "ring-emerald-500/60",
    cyan: "ring-cyan-500/60",
    orange: "ring-orange-500/60",
    violet: "ring-violet-500/60",
  };

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.4, zIndex: 10 }}
      className={`
        aspect-square w-[16px] h-[16px] rounded-[3px]
        transition-colors
        ${colorClass}
        ${isToday ? `ring-2 ring-offset-1 ${accentRingMap[accentColor] || accentRingMap.indigo}` : ""}
      `}
      title={`${dateKey}: ${Math.round(intensity)}%`}
    />
  );
};
