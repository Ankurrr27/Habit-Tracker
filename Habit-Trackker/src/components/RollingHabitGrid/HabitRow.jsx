import { toDateKey } from "../../utils/date";
import { isHabitScheduledOnDate } from "./habitSchedule";
import HabitCell from "./HabitCell";

export default function HabitRow({ habit, days, logs, todayKey }) {
  return (
    <div className="contents group">
      {/* HABIT TITLE — STICKY */}
      <div
        className="
          sticky  z-20
          flex items-center
          rounded-lg
          bg-zinc-950
          pr-3 pl-4
          text-[13px] font-medium text-zinc-200
          transition-colors
          
          group-hover:text-white
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
        const isScheduled =
          !!log || isHabitScheduledOnDate(habit, day);

        return (
          <div
            key={cellKey}
            className="
              flex items-center justify-center
              transition-colors
             
            "
          >
            <HabitCell
              isScheduled={isScheduled}
              isPast={isPast}
              log={log}
            />
          </div>
        );
      })}
    </div>
  );
}
