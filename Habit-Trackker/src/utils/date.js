export const toDateKey = (d) => d.toISOString().slice(0, 10);

export function getNDays(start, n = 100) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  });
}
