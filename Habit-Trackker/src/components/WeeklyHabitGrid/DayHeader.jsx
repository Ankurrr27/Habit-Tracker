import { toDateKey } from "../../utils/date";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DayHeader({ day, todayKey }) {
  const isToday = toDateKey(day) === todayKey;
  const weekday = WEEKDAYS[day.getUTCDay()];
  const isWeekStart = day.getUTCDay() === 0;

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-[11px] font-medium
        rounded-md px-1 py-[2px]
        ${
          isToday
            ? "text-violet-300 bg-violet-500/10"
            : "text-zinc-400"
        }
        ${isWeekStart ? "border-l border-zinc-700 ml-1 bg-zinc-900/40" : ""}
      `}
    >
      <span className="leading-none">{weekday}</span>
      <span className="leading-none">{day.getUTCDate()}</span>
    </div>
  );
}
