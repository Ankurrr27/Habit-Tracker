import { motion as Motion } from "framer-motion";
import { toDateKey } from "../../utils/date";
import { addAppDays, startOfAppDay } from "../../utils/date";
import { useWeeklyHabits } from "./useMonthlyHabits";
import RollingHabitGridLayout from "./RollingHabitGridLayout";

const getRollingDays = (center = new Date()) => {
  const base = startOfAppDay(center);

  const days = [];

  for (let index = 10; index > 0; index -= 1) {
    days.push(addAppDays(base, -index));
  }

  days.push(new Date(base));

  for (let index = 1; index <= 15; index += 1) {
    days.push(addAppDays(base, index));
  }

  return {
    days,
    rangeKey: toDateKey(days[0]),
    todayKey: toDateKey(base),
  };
};

export default function RollingHabitGrid() {
  const today = startOfAppDay(new Date());

  const { days, rangeKey, todayKey } = getRollingDays(today);
  const { habits, logs, loading } = useWeeklyHabits(rangeKey);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-600 dark:text-zinc-500">
        Loading habits...
      </div>
    );
  }

  return (
    <Motion.div
      className="
        w-full h-full
        rounded-[1.5rem]
        overflow-hidden
        pt-3 pb-2
        transition-colors
        bg-white dark:bg-zinc-950
        shadow-sm
      "
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="
          sticky top-0 z-30
          flex items-center justify-between
          px-4 py-3 sm:px-6
          backdrop-blur
          bg-white/90 dark:bg-zinc-950/90
          border-b border-zinc-200/70 dark:border-zinc-800
        "
      >
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
            Habit Timeline
          </h2>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-500">
            10 days back - Today - 15 days ahead
          </p>
        </div>
      </div>

      <RollingHabitGridLayout
        days={days}
        habits={habits}
        logs={logs}
        todayKey={todayKey}
      />
    </Motion.div>
  );
}
