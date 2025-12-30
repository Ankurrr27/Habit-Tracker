import { motion } from "framer-motion";

export const DayCell = ({ dateKey, intensity, isToday, colorClass }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.4, zIndex: 10 }}
    className={`
      aspect-square w-[13px] h-[13px] rounded-[2px]
      ${colorClass}
      ${isToday ? "" : ""}
    `}
    title={`${dateKey}: ${Math.round(intensity)}%`}
  />
);