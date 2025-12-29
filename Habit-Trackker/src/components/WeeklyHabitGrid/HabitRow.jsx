import { toDateKey } from "../../utils/date";
import { isHabitScheduledOnDate } from "./habitSchedule";
import HabitCell from "./HabitCell";

export default function HabitRow({ habit, days, logs, todayKey }) {
  return (
    <div className="contents">
      {/* HABIT TITLE */}
      <div
        className="
          flex items-center
          text-sm font-medium
          text-zinc-200
          pr-3
          sticky left-0
          bg-zinc-950
          z-10
        "
      >
        {habit.title}
      </div>

      {days.map((day) => {
        const dateKey = toDateKey(day);
        const cellKey = `${habit._id}_${dateKey}`;

        const rawLog = logs[cellKey];
        const log =
          typeof rawLog === "boolean"
            ? { done: rawLog, confidence: 30 }
            : rawLog;

        const isPast = dateKey < todayKey;
        const hasLog = !!log;
        const isScheduled =
          hasLog || isHabitScheduledOnDate(habit, day);

        return (
          <HabitCell
            key={cellKey}
            isScheduled={isScheduled}
            isPast={isPast}
            log={log}
          />
        );
      })}
    </div>
  );
}
