import { getAppDayOfMonth, getAppWeekdayIndex, toDateKey } from "../../utils/date";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DayHeader({ day, todayKey }) {
  const isToday = toDateKey(day) === todayKey;
  const weekdayIndex = getAppWeekdayIndex(day);
  const weekday = WEEKDAYS[weekdayIndex];
  const isWeekStart = weekdayIndex === 0;

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-[10px] leading-none
        px-1 py-[1px] rounded
        transition-colors
        ${
          isToday
            ? "accent-text accent-bg-soft"
            : "text-zinc-600 dark:text-zinc-400"
        }
        ${
          isWeekStart
            ? "border-l border-zinc-300 dark:border-zinc-700 ml-1 pl-1"
            : ""
        }
      `}
    >
      <span>{weekday}</span>
      <span className="text-[9px] text-zinc-500 dark:text-zinc-500">
        {getAppDayOfMonth(day)}
      </span>
    </div>
  );
}
