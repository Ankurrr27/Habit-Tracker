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
        text-[10px] leading-none
        px-1 py-[1px] rounded
        ${
          isToday
            ? "text-violet-300 bg-violet-500/10"
            : "text-zinc-400"
        }
        ${
          isWeekStart
            ? "border-l border-zinc-700 ml-1 pl-1"
            : ""
        }
      `}
    >
      <span>{weekday}</span>
      <span className="text-[9px] text-zinc-500">
        {day.getUTCDate()}
      </span>
    </div>
  );
}
