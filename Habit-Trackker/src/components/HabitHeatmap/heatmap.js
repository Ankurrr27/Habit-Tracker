export function getHeatColor(confidence = 0) {
  if (confidence >= 90) return "bg-emerald-600";
  if (confidence >= 60) return "bg-emerald-500";
  if (confidence >= 30) return "bg-emerald-400";
  return "bg-zinc-800";
}
