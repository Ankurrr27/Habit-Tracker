import { addAppDays, getAppWeekdayIndex, startOfAppDay, toDateKey } from "../../utils/date";

export const toUTCDateKey = toDateKey;

export function getNDays(count = 30) {
  const now = startOfAppDay(new Date());
  const start = addAppDays(now, -getAppWeekdayIndex(now));

  return Array.from({ length: count }, (_, i) => addAppDays(start, i));
}
