export function isHabitScheduledOnDate(habit, date) {
  const day = new Date(date);
  day.setUTCHours(0, 0, 0, 0);

  if (habit.startDate) {
    const start = new Date(habit.startDate);
    start.setUTCHours(0, 0, 0, 0);
    if (day < start) return false;
  }

  if (habit.endDate) {
    const end = new Date(habit.endDate);
    end.setUTCHours(0, 0, 0, 0);
    if (day > end) return false;
  }

  const weekday = day
    .toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })
    .toLowerCase()
    .slice(0, 3);

  const habitDays = Array.isArray(habit.days)
    ? habit.days.map((d) => d.toLowerCase().slice(0, 3))
    : [];

  if (habit.frequency === "daily") return true;
  if (habit.frequency === "weekly") return habitDays.includes(weekday);

  if (habit.frequency === "interval") {
    if (!habit.startDate || !habit.intervalDays) return false;
    const start = new Date(habit.startDate);
    start.setUTCHours(0, 0, 0, 0);
    const diff =
      (day.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff % habit.intervalDays === 0;
  }

  return false;
}
