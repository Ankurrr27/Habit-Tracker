import { motion as Motion } from "framer-motion";

export const DayCell = ({ dateKey, intensity, isToday, colorClass }) => (
  <Motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.4, zIndex: 10 }}
    className={`
      aspect-square w-[13px] h-[13px] rounded-[2px]
      transition-colors
      ${colorClass}
      ${isToday ? "ring-1 ring-indigo-500/60" : ""}
    `}
    title={`${dateKey}: ${Math.round(intensity)}%`}
  />
);
