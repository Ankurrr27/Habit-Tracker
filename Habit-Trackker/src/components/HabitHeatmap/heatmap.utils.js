import { getAppWeekdayIndex, toDateKey } from "../../utils/date";

export { toDateKey };

export const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const getDayKey = (date) =>
  WEEKDAYS[getAppWeekdayIndex(date)];

export function getIntensityColor(percentage, accentColor = "indigo") {
  if (percentage === 0)
    return "bg-zinc-200 dark:bg-zinc-900";

  const intensityPalette = {
    indigo: [
      "bg-indigo-200 dark:bg-indigo-950/60",
      "bg-indigo-300 dark:bg-indigo-800/80",
      "bg-indigo-400 dark:bg-indigo-600/90",
      "bg-indigo-500 dark:bg-indigo-500/90 dark:shadow-[0_0_12px_rgba(var(--primary),0.25)]",
    ],
    pink: [
      "bg-pink-200 dark:bg-pink-950/60",
      "bg-pink-300 dark:bg-pink-800/80",
      "bg-pink-400 dark:bg-pink-600/90",
      "bg-pink-500 dark:bg-pink-500/90 dark:shadow-[0_0_12px_rgba(var(--primary),0.25)]",
    ],
    rose: [
      "bg-rose-200 dark:bg-rose-950/60",
      "bg-rose-300 dark:bg-rose-800/80",
      "bg-rose-400 dark:bg-rose-600/90",
      "bg-rose-500 dark:bg-rose-500/90 dark:shadow-[0_0_12px_rgba(var(--primary),0.25)]",
    ],
    sky: [
      "bg-sky-200 dark:bg-sky-950/60",
      "bg-sky-300 dark:bg-sky-800/80",
      "bg-sky-400 dark:bg-sky-600/90",
      "bg-sky-500 dark:bg-sky-500/90 dark:shadow-[0_0_12px_rgba(var(--primary),0.25)]",
    ],
    emerald: [
      "bg-emerald-200 dark:bg-emerald-950/60",
      "bg-emerald-300 dark:bg-emerald-800/80",
      "bg-emerald-400 dark:bg-emerald-600/90",
      "bg-emerald-500 dark:bg-emerald-500/90 dark:shadow-[0_0_12px_rgba(var(--primary),0.25)]",
    ],
    cyan: [
      "bg-cyan-200 dark:bg-cyan-950/60",
      "bg-cyan-300 dark:bg-cyan-800/80",
      "bg-cyan-400 dark:bg-cyan-600/90",
      "bg-cyan-500 dark:bg-cyan-500/90 dark:shadow-[0_0_12px_rgba(var(--primary),0.25)]",
    ],
    orange: [
      "bg-orange-200 dark:bg-orange-950/60",
      "bg-orange-300 dark:bg-orange-800/80",
      "bg-orange-400 dark:bg-orange-600/90",
      "bg-orange-500 dark:bg-orange-500/90 dark:shadow-[0_0_12px_rgba(var(--primary),0.25)]",
    ],
    violet: [
      "bg-violet-200 dark:bg-violet-950/60",
      "bg-violet-300 dark:bg-violet-800/80",
      "bg-violet-400 dark:bg-violet-600/90",
      "bg-violet-500 dark:bg-violet-500/90 dark:shadow-[0_0_12px_rgba(var(--primary),0.25)]",
    ],
  };

  const palette = intensityPalette[accentColor] || intensityPalette.indigo;

  if (percentage <= 25)
    return palette[0];

  if (percentage <= 50)
    return palette[1];

  if (percentage <= 75)
    return palette[2];

  return palette[3];
}
