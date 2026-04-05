import HabitRow from "./HabitRow";
import DayHeader from "./DayHeader";

export default function RollingHabitGridLayout({
  days,
  habits,
  logs,
  todayKey,
  onToggle,
}) {
  return (
    <div className="overflow-x-auto">
      <div
        className="
          grid gap-x-2 gap-y-2
          px-6 py-5
          bg-transparent
          text-zinc-800 dark:text-zinc-200
        "
        style={{
          gridTemplateColumns: `200px repeat(${days.length}, 34px)`,
          gridAutoRows: "48px",
        }}
      >
        {/* EMPTY CORNER */}
        <div />

        {/* DAY HEADERS */}
        {days.map((day) => (
          <DayHeader
            key={day.toISOString()}
            day={day}
            todayKey={todayKey}
          />
        ))}

        {/* HABIT ROWS */}
        {habits.map((habit) => (
          <HabitRow
            key={habit._id}
            habit={habit}
            days={days}
            logs={logs}
            todayKey={todayKey}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
