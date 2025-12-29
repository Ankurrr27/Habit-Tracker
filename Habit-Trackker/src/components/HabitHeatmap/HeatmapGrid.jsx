import { useMemo } from "react";
import { toDateKey, getIntensityColor } from "./heatmap.utils";
import {MonthGroup} from "./MonthGroup";

export default function HeatmapGrid({ days, today, getDailyIntensity }) {
  const todayKey = toDateKey(today);

  // Group days into months with start-of-week offsets
  const months = useMemo(() => {
    const grouped = [];
    days.forEach((day) => {
      const monthLabel = day.toLocaleString("default", { month: "short" });
      const year = day.getFullYear();
      const key = `${monthLabel}-${year}`;

      let lastMonth = grouped[grouped.length - 1];
      if (!lastMonth || lastMonth.key !== key) {
        grouped.push({
          key,
          label: monthLabel,
          days: [day],
          startOffset: day.getDay(), // 0 = Sun, 1 = Mon...
        });
      } else {
        lastMonth.days.push(day);
      }
    });
    return grouped;
  }, [days]);

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex gap-2.75 min-w-max items-end px-2">
        {/* Optional: Add a Weekday Legend here */}
        <div className="grid grid-rows-7 gap-1 pb-[2px] pr-2 text-[9px] text-slate-400 uppercase">
          <div>Sun</div><div></div><div>Tue</div><div></div><div>Thu</div><div></div><div>Sat</div>
        </div>

        {months.map((month) => (
          <MonthGroup
            key={month.key}
            month={month}
            todayKey={todayKey}
            getDailyIntensity={getDailyIntensity}
            toDateKey={toDateKey}
            getIntensityColor={getIntensityColor}
          />
        ))}
      </div>
    </div>
  );
}