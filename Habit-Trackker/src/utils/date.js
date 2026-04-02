export const APP_TIMEZONE_OFFSET_MINUTES = 330;
const APP_TIMEZONE_OFFSET_MS = APP_TIMEZONE_OFFSET_MINUTES * 60 * 1000;

export function shiftToAppTime(date) {
  return new Date(new Date(date).getTime() + APP_TIMEZONE_OFFSET_MS);
}

export function startOfAppDay(date = new Date()) {
  const shifted = shiftToAppTime(date);

  return new Date(
    Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate()
    ) - APP_TIMEZONE_OFFSET_MS
  );
}

export const toDateKey = (date) => {
  const shifted = shiftToAppTime(date);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shifted.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getAppWeekdayIndex = (date) => shiftToAppTime(date).getUTCDay();

export const getAppDayOfMonth = (date) => shiftToAppTime(date).getUTCDate();

export function addAppDays(date, days) {
  const shifted = shiftToAppTime(date);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return new Date(shifted.getTime() - APP_TIMEZONE_OFFSET_MS);
}

export function getNDays(start, n = 100) {
  const normalizedStart = startOfAppDay(start);

  return Array.from({ length: n }, (_, i) => addAppDays(normalizedStart, i));
}
