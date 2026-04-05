import { DayCell } from "./DayCell";

export const MonthGroup = ({
  month,
  todayKey,
  getDailyIntensity,
  toDateKey,
  getIntensityColor,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="
        text-[10px] font-medium uppercase
        text-zinc-600 dark:text-zinc-400
      ">
        {month.label}
      </span>

      <div
        className="grid grid-flow-col grid-rows-7 gap-1"
        style={{ gridAutoColumns: "16px" }}
      >
        {/* Spacer cells */}
        {[...Array(month.startOffset)].map((_, i) => (
          <div key={`spacer-${i}`} className="w-[16px] h-[16px]" />
        ))}

        {month.days.map((day) => {
          const dateKey = toDateKey(day);
          const intensity = getDailyIntensity(dateKey);

          return (
            <DayCell
              key={dateKey}
              dateKey={dateKey}
              intensity={intensity}
              isToday={dateKey === todayKey}
              colorClass={getIntensityColor(intensity)}
            />
          );
        })}
      </div>
    </div>
  );
};
