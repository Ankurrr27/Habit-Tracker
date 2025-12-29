import WeekCalendar from "./WeekCalendar";
import HabitList from "./HabitList";
import { useHabitByDay } from "./useHabitByDay";


export default function HabitByDay() {
  const {
    weekDates,
    selectedIndex,
    setSelectedIndex,
    selectedDate,
    isToday,
    habits,
    loading,
    completeHabit,
    deleteHabit,
  } = useHabitByDay();

  return (
    <div className="space-y-4 md:space-y-5">
      <WeekCalendar
        weekDates={weekDates}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        habitCounts={weekDates.map((_, i) =>
          i === selectedIndex ? habits.length : 0
        )}
      />

      <div className="text-sm text-zinc-400 px-1">
        {isToday ? "Today" : selectedDate.toDateString()}
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 pb-24">
        <HabitList
          habits={habits}
          loading={loading}
          isToday={isToday}
          onComplete={completeHabit}
          onDelete={deleteHabit}
        />
      </div>
    </div>
  );
}
