import { getAppWeekdayIndex, startOfAppDay } from "../../utils/date";

export function isHabitScheduledOnDate(habit, date) {
  const day = startOfAppDay(date);

  if (habit.startDate) {
    const start = startOfAppDay(habit.startDate);
    if (day < start) return false;
  }

  if (habit.endDate) {
    const end = startOfAppDay(habit.endDate);
    if (day > end) return false;
  }

  const weekdayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekday = weekdayMap[getAppWeekdayIndex(day)];

  const habitDays = Array.isArray(habit.days)
    ? habit.days.map((d) => d.toLowerCase().slice(0, 3))
    : [];

  if (habit.frequency === "daily") return true;
  if (habit.frequency === "weekly") return habitDays.includes(weekday);

  if (habit.frequency === "interval") {
    if (!habit.startDate || !habit.intervalDays) return false;
    const start = startOfAppDay(habit.startDate);
    const diff =
      (day.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff % habit.intervalDays === 0;
  }

  return false;
}
