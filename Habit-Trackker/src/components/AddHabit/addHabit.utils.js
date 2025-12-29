export function validateHabit({
  title,
  frequency,
  days,
  intervalDays,
  durationType,
  durationDays,
}) {
  if (!title.trim()) {
    return "Title required";
  }

  if (frequency === "weekly" && days.length === 0) {
    return "Select at least one day";
  }

  if (frequency === "interval" && intervalDays < 1) {
    return "Interval must be at least 1 day";
  }

  if (durationType === "custom" && durationDays < 1) {
    return "Duration must be at least 1 day";
  }

  return null;
}
