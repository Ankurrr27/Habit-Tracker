import { useEffect, useRef } from "react";
import { DAYS } from "../constants/days";

/*
  weekDates: array of Date (NOW CAN BE 30+ DAYS)
  selectedIndex: number
  onSelect: (index) => void
*/

export default function WeekCalendar({
  weekDates = [],
  selectedIndex = 0,
  onSelect = () => {},
  habitCounts = [],
}) {
  const containerRef = useRef(null);
  const todayRef = useRef(null);
  const itemRefs = useRef([]);

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

  /* ===== SEARCH DATE HANDLER ===== */
  const handleDateSearch = (e) => {
    const value = e.target.value;
    if (!value) return;

    const target = new Date(value);
    target.setHours(0, 0, 0, 0);

    const index = weekDates.findIndex(
      (d) =>
        d.getFullYear() === target.getFullYear() &&
        d.getMonth() === target.getMonth() &&
        d.getDate() === target.getDate()
    );

    if (index !== -1) {
      onSelect(index);
      itemRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <div className="space-y-2">
      {/* ===== DAYS STRIP ===== */}
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

          const count = habitCounts[i] ?? 0;

          return (
            <button
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
                if (isToday) todayRef.current = el;
              }}
              onClick={() => onSelect(i)}
              className={`relative min-w-[64px] px-2 py-2 rounded-xl  transition ${
                isSelected
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-black  text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <div className="text-xs uppercase">
                {DAYS[date.getDay()]}
              </div>
              <div className="text-lg font-semibold">
                {date.getDate()}
              </div>

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

      {/* ===== DATE SEARCH ===== */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">Jump to date:</span>
        <input
          type="date"
          onChange={handleDateSearch}
          className="
            bg-black border border-zinc-800 text-zinc-300
            rounded-md px-2 py-1 text-xs
            focus:outline-none focus:border-indigo-500
          "
        />
      </div>
    </div>
  );
}
