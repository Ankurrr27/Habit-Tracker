import { useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { DAYS } from "../../constants/days";

const accentClassMap = {
  indigo: {
    selected: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-100/50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
    ring: "ring-indigo-500/60",
    indicator: "bg-indigo-500",
  },
  emerald: {
    selected: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    ring: "ring-emerald-500/60",
    indicator: "bg-emerald-500",
  },
  amber: {
    selected: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100/50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    ring: "ring-amber-400/70",
    indicator: "bg-amber-500",
  },
  rose: {
    selected: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-100/50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
    ring: "ring-rose-400/70",
    indicator: "bg-rose-500",
  },
};

const surfaceClassMap = {
  solid: "bg-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors",
  glass:
    "bg-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors",
  minimal:
    "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900",
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
        className="flex gap-2 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
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
              <div className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? "opacity-100" : "text-zinc-500 dark:text-zinc-400"}`}>
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className={`mt-1.5 text-xl ${isSelected ? "font-extrabold text-zinc-900 dark:text-white" : "font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"}`}>
                {date.getDate()}
              </div>

              {isSelected && (
                 <Motion.div 
                   layoutId="activeDayDash"
                   className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${accent.indicator}`} 
                 />
              )}

              {showCounts && count > 0 && (
                <span
                  className={`
                    absolute right-1 top-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold
                    ${isSelected ? accent.badge : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"}
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
            rounded-lg bg-zinc-100 px-2 py-1 text-xs
            text-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/30
            dark:bg-zinc-900 dark:text-zinc-300
          "
        />
      </div>
    </div>
  );
}
