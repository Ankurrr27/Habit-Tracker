import { motion } from "framer-motion";
import { getStartOfWeek } from "../../utils/week";
import { getNDays, toDateKey } from "../../utils/date";
import { useWeeklyHabits } from "./useWeeklyHabits";
import HabitRow from "./HabitRow";
import DayHeader from "./DayHeader";

export default function WeeklyHabitGrid() {
  const weekStart = getStartOfWeek();
  const days = getNDays(weekStart, 100);
  const weekKey = toDateKey(weekStart);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayKey = toDateKey(today);

  const { habits, logs, loading } = useWeeklyHabits(weekKey);

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
        w-full h-full overflow-x-auto overflow-y-hidden
        bg-zinc-950 rounded-xl
        border border-zinc-800
        shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
      "
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div
        className="grid gap-x-[8px] gap-y-[6px] p-6"
        style={{
          gridTemplateColumns: `160px repeat(100, 32px)`,
          gridAutoRows: "36px",
        }}
      >
        {/* EMPTY CORNER */}
        <div />

        {/* DAY HEADERS */}
        {days.map((day) => (
          <DayHeader
            key={day.toISOString()}
            day={day}
            todayKey={todayKey}
          />
        ))}

        {/* HABIT ROWS */}
        {habits.map((habit) => (
          <HabitRow
            key={habit._id}
            habit={habit}
            days={days}
            logs={logs}
            todayKey={todayKey}
          />
        ))}
      </div>
    </motion.div>
  );
}
