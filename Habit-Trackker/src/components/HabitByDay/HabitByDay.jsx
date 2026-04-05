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
        habitCounts={weekDates.map((_, index) =>
          index === selectedIndex ? habits.length : 0
        )}
      />

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {isToday ? "Today" : selectedDate.toDateString()}
      </div>

      <div className="max-h-[60vh] space-y-2 overflow-y-auto pb-24">
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
