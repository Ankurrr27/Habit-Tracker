const APP_TIMEZONE_OFFSET_MINUTES = 330;
const APP_TIMEZONE_OFFSET_MS = APP_TIMEZONE_OFFSET_MINUTES * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function shiftToAppTimezone(date = new Date()) {
  return new Date(new Date(date).getTime() + APP_TIMEZONE_OFFSET_MS);
}

export const getUTCStartOfDay = (date = new Date()) => {
  const shifted = shiftToAppTimezone(date);

  return new Date(
    Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate()
    ) - APP_TIMEZONE_OFFSET_MS
  );
};

export const getUTCEndOfDay = (date = new Date()) => {
  return new Date(getUTCStartOfDay(date).getTime() + DAY_MS);
};

export const getUTCDayKey = (date = new Date()) => {
  const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return dayMap[shiftToAppTimezone(date).getUTCDay()];
};

export const getAppDateKey = (date = new Date()) => {
  const shifted = shiftToAppTimezone(date);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shifted.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
