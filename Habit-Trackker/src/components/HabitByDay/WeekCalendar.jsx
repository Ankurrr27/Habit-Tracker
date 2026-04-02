import { useEffect, useRef } from "react";
import { DAYS } from "../../constants/days";

const accentClassMap = {
  indigo: {
    selected: "bg-indigo-600 text-white",
    badge: "bg-white text-indigo-600",
    ring: "ring-indigo-500/60",
  },
  emerald: {
    selected: "bg-emerald-600 text-white",
    badge: "bg-white text-emerald-600",
    ring: "ring-emerald-500/60",
  },
  amber: {
    selected: "bg-amber-500 text-zinc-950",
    badge: "bg-white text-amber-600",
    ring: "ring-amber-400/70",
  },
  rose: {
    selected: "bg-rose-600 text-white",
    badge: "bg-white text-rose-600",
    ring: "ring-rose-400/70",
  },
};

const surfaceClassMap = {
  solid: "bg-zinc-100 dark:bg-black hover:bg-zinc-200 dark:hover:bg-zinc-900",
  glass:
    "bg-white/80 dark:bg-zinc-950/70 backdrop-blur border border-zinc-200/80 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-950",
  minimal:
    "bg-transparent border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900",
};

const densityClassMap = {
  compact: "min-w-[58px] px-2 py-2",
  comfy: "min-w-[70px] px-3 py-3",
  wide: "min-w-[84px] px-4 py-3.5",
};

export default function WeekCalendar({
  weekDates = [],
  selectedIndex = 0,
  onSelect = () => {},
  habitCounts = [],
  design = {},
}) {
  const containerRef = useRef(null);
  const todayRef = useRef(null);
  const itemRefs = useRef([]);

  const accent = accentClassMap[design.accent] || accentClassMap.indigo;
  const surface =
    surfaceClassMap[design.surface] || surfaceClassMap.solid;
  const density =
    densityClassMap[design.density] || densityClassMap.comfy;
  const showCounts = design.showCounts !== false;

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

  const handleDateSearch = (event) => {
    const value = event.target.value;
    if (!value) return;

    const target = new Date(value);
    target.setHours(0, 0, 0, 0);

    const index = weekDates.findIndex(
      (date) =>
        date.getFullYear() === target.getFullYear() &&
        date.getMonth() === target.getMonth() &&
        date.getDate() === target.getDate()
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
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
      >
        {weekDates.map((date, index) => {
          const isSelected = index === selectedIndex;
          const isToday =
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();

          const count = habitCounts[index] ?? 0;

          return (
            <button
              key={index}
              ref={(element) => {
                itemRefs.current[index] = element;
                if (isToday) {
                  todayRef.current = element;
                }
              }}
              onClick={() => onSelect(index)}
              className={`
                relative rounded-2xl text-left transition
                ${density}
                ${isSelected ? accent.selected : surface}
                ${isToday && !isSelected ? `ring-1 ${accent.ring}` : ""}
              `}
            >
              <div className="text-[11px] uppercase tracking-wide opacity-70">
                {DAYS[date.getDay()]}
              </div>
              <div className="mt-1 text-lg font-semibold">
                {date.getDate()}
              </div>

              {showCounts && count > 0 && (
                <span
                  className={`
                    absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium
                    ${
                      isSelected
                        ? accent.badge
                        : "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                    }
                  `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-600 dark:text-zinc-400">
          Jump to date:
        </span>
        <input
          type="date"
          onChange={handleDateSearch}
          className="
            rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs
            text-zinc-700 focus:outline-none focus:border-indigo-500
            dark:border-zinc-800 dark:bg-black dark:text-zinc-300
          "
        />
      </div>
    </div>
  );
}
