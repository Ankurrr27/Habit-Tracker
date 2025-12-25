import { useEffect, useRef } from "react";
import { DAYS } from "../constants/days";

export default function WeekCalendar({
  weekDates = [],
  selectedIndex = 0,
  onSelect = () => {},
  habitCounts = [], // ✅ DEFAULT FIX
}) {
  const containerRef = useRef(null);
  const todayRef = useRef(null);

  useEffect(() => {
    if (todayRef.current && containerRef.current) {
      todayRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [weekDates]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
    >
      {weekDates.map((date, i) => {
        const isSelected = i === selectedIndex;

        const isToday =
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate();

        const count = habitCounts[i] ?? 0; // ✅ SAFE ACCESS

        return (
          <button
            key={i}
            ref={isToday ? todayRef : null}
            onClick={() => onSelect(i)}
            className={`relative min-w-[64px] px-2 py-2 rounded-xl border transition ${
              isSelected
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-black border-zinc-800 text-zinc-300 hover:bg-zinc-900"
            }`}
          >
            <div className="text-xs uppercase">{DAYS[i]}</div>
            <div className="text-lg font-semibold">{date.getDate()}</div>

            {count > 0 && (
              <span
                className={`absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-white text-indigo-600"
                    : "bg-zinc-700 text-zinc-200"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
