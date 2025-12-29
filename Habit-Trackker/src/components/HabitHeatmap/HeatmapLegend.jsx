export default function HeatmapLegend() {
  return (
    <div className="flex gap-1 items-center">
      <span className="text-[10px] text-zinc-600 mr-2">Less</span>
      <div className="w-3 h-3 rounded-[2px] bg-zinc-900" />
      <div className="w-3 h-3 rounded-[2px] bg-emerald-900" />
      <div className="w-3 h-3 rounded-[2px] bg-emerald-700" />
      <div className="w-3 h-3 rounded-[2px] bg-emerald-500" />
      <div className="w-3 h-3 rounded-[2px] bg-emerald-400" />
      <span className="text-[10px] text-zinc-600 ml-2">More</span>
    </div>
  );
}
