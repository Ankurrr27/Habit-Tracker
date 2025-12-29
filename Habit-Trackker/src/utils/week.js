/* =========================
   DATE UTILS (UTC SAFE)
   Dense + Scalable
========================= */

/**
 * Returns Monday of the week for a given date (UTC-safe)
 */
export const getStartOfWeek = (date = new Date()) => {
  const d = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));

  const day = d.getUTCDay(); // 0 = Sun
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);

  return d;
};

/**
 * Returns an array of dates starting from `start`
 * length = number of days (7, 14, 28, etc.)
 */
export const getDateRange = (start, length = 7) => {
  return Array.from({ length }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  });
};

/**
 * Compact key for backend + maps
 * YYYY-MM-DD (UTC)
 */
export const toDateKey = (date) =>
  date.toISOString().slice(0, 10);

/**
 * Metadata for dense UI rendering
 */
/**
 * Metadata for dense UI rendering (MONTH SAFE)
 */
export const getDateMeta = (date, windowStart) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const base =
    windowStart ??
    new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      1 // 👈 month start
    ));

  base.setUTCHours(0, 0, 0, 0);

  return {
    key: toDateKey(date),
    day: date.getUTCDate(),        // 1–31
    weekday: date.getUTCDay(),     // 0–6
    isToday: date.getTime() === today.getTime(),
    isPast: date.getTime() < today.getTime(),

    // ✅ week index INSIDE THE MONTH
    weekIndex: Math.floor(
      (date - base) / (7 * 86400000)
    ),
  };
};
