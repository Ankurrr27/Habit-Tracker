import { motion } from "framer-motion";
import { toDateKey } from "../../utils/date";
import { useWeeklyHabits } from "./useMonthlyHabits";
import RollingHabitGridLayout from "./RollingHabitGridLayout";

/* =========================
   ROLLING RANGE (UTC SAFE)
========================= */
const getRollingDays = (center = new Date()) => {
  const base = new Date(center);
  base.setUTCHours(0, 0, 0, 0);

  const days = [];

  // 10 days behind
  for (let i = 10; i > 0; i--) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() - i);
    days.push(d);
  }

  // today
  days.push(new Date(base));

  // 15 days ahead
  for (let i = 1; i <= 15; i++) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + i);
    days.push(d);
  }

  return {
    days,
    rangeKey: toDateKey(days[0]),
    todayKey: toDateKey(base),
  };
};

export default function RollingHabitGrid() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const { days, rangeKey, todayKey } = getRollingDays(today);
  const { habits, logs, loading } = useWeeklyHabits(rangeKey);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500">
        Loading habits…
      </div>
    );
  }

  return (
    <motion.div
      className="
        w-full h-full
        rounded-xl
        overflow-hidden
        pt-4 pb-2
        bg-zinc-950
      "
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ===== HEADER ===== */}
      <div
        className="
          sticky top-0 z-30
          flex items-center justify-between
          px-6 py-3
          border-b border-zinc-800
          bg-zinc-950/90 backdrop-blur
        "
      >
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">
            Habit Timeline
          </h2>
          <p className="text-xs text-zinc-500">
            10 days back · Today · 15 days ahead
          </p>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <RollingHabitGridLayout
        days={days}
        habits={habits}
        logs={logs}
        todayKey={todayKey}
      />
    </motion.div>
  );
}
