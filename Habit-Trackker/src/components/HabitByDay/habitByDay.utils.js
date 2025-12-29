export const toUTCDateKey = (d) =>
  `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;

export function getNDays(count = 30) {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - now.getUTCDay()
    )
  );

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    return d;
  });
}
