export function getHeatColor(confidence = 0) {
  if (confidence >= 90)
    return "bg-blue-600 dark:bg-emerald-600";

  if (confidence >= 60)
    return "bg-blue-500 dark:bg-emerald-500";

  if (confidence >= 30)
    return "bg-blue-400 dark:bg-emerald-400";

  return "bg-zinc-200 dark:bg-zinc-800";
}
