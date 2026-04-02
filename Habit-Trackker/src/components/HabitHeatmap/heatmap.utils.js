import { getAppWeekdayIndex, toDateKey } from "../../utils/date";

export { toDateKey };

export const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const getDayKey = (date) =>
  WEEKDAYS[getAppWeekdayIndex(date)];

export function getIntensityColor(percentage) {
  if (percentage === 0)
    return "bg-zinc-200 dark:bg-zinc-900";

  if (percentage <= 25)
    return "bg-blue-200 dark:bg-emerald-900";

  if (percentage <= 50)
    return "bg-blue-300 dark:bg-emerald-700";

  if (percentage <= 75)
    return "bg-blue-400 dark:bg-emerald-500";

  return `
    bg-blue-500 dark:bg-emerald-400
    dark:shadow-[0_0_10px_rgba(52,211,153,0.35)]
  `;
}
