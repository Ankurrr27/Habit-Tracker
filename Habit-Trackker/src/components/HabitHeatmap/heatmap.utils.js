import { getAppWeekdayIndex, toDateKey } from "../../utils/date";

export { toDateKey };

export const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const getDayKey = (date) =>
  WEEKDAYS[getAppWeekdayIndex(date)];

export function getIntensityColor(percentage, accentColor = "indigo") {
  if (percentage === 0)
    return "bg-zinc-200 dark:bg-zinc-900";

  // Map our internal theme names to Tailwind color families
  const colorMap = {
    indigo: { light: "indigo", dark: "indigo" },
    pink: { light: "pink", dark: "pink" },
    rose: { light: "rose", dark: "rose" },
    sky: { light: "sky", dark: "sky" },
    emerald: { light: "emerald", dark: "emerald" },
    cyan: { light: "cyan", dark: "cyan" },
    orange: { light: "orange", dark: "orange" },
    violet: { light: "violet", dark: "violet" },
  };

  const { light, dark } = colorMap[accentColor] || colorMap.indigo;

  if (percentage <= 25)
    return `bg-${light}-200 dark:bg-${dark}-950/60`;

  if (percentage <= 50)
    return `bg-${light}-300 dark:bg-${dark}-800/80`;

  if (percentage <= 75)
    return `bg-${light}-400 dark:bg-${dark}-600/90`;

  return `
    bg-${light}-500 dark:bg-${dark}-500/90
    dark:shadow-[0_0_12px_rgba(var(--primary),0.25)]
  `;
}
