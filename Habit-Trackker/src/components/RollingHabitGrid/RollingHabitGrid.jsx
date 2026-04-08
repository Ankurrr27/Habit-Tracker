import { motion as Motion } from "framer-motion";
import { toDateKey } from "../../utils/date";
import { addAppDays, startOfAppDay } from "../../utils/date";
import { useDashboard } from "../../context/useDashboard";
import RollingHabitGridLayout from "./RollingHabitGridLayout";

const getRollingDays = (center = new Date()) => {
  const base = startOfAppDay(center);

  const days = [];

  for (let index = 5; index > 0; index -= 1) {
    days.push(addAppDays(base, -index));
  }

  days.push(new Date(base));

  for (let index = 1; index <= 10; index += 1) {
    days.push(addAppDays(base, index));
  }

  return {
    days,
    todayKey: toDateKey(base),
  };
};

export default function RollingHabitGrid() {
  const today = startOfAppDay(new Date());

  const { days, todayKey } = getRollingDays(today);
  const { habits, logs, loading, toggleHabit } = useDashboard();

  if (loading) {
    return (
      <div className="w-full h-full animate-pulse overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-zinc-100 dark:bg-zinc-900 rounded-md" />
            <div className="h-3 w-40 bg-zinc-50 dark:bg-zinc-900/40 rounded-md" />
          </div>
        </div>
        <div className="p-6 space-y-[24px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 h-6">
              <div className="w-24 h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md shrink-0" />
              <div className="flex-1 flex justify-between gap-2">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div key={j} className="w-6 h-6 rounded-full bg-zinc-50 dark:bg-zinc-900/50 shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Motion.div
      className="w-full h-full pt-3 pb-2 transition-colors"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="
          sticky top-0 z-30
          flex items-center justify-between
          px-4 py-3 sm:px-6
          backdrop-blur-sm
          bg-white/50 dark:bg-zinc-950/50
        "
      >
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
            Habit Timeline
          </h2>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-500">
            5 days back - Today - 10 days ahead
          </p>
        </div>
      </div>

      <RollingHabitGridLayout
        days={days}
        habits={habits}
        logs={logs}
        todayKey={todayKey}
        onToggle={toggleHabit}
      />
    </Motion.div>
  );
}
