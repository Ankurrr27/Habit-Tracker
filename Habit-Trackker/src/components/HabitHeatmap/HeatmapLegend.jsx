export default function HeatmapLegend() {
  return (
    <div className="flex gap-1 items-center">
      <span className="text-[10px] text-zinc-700 dark:text-zinc-600 mr-2">
        Less
      </span>

      {/* 0% */}
      <div className="w-3 h-3 rounded-[2px] bg-zinc-200 dark:bg-zinc-900" />

      {/* 25% */}
      <div className="w-3 h-3 rounded-[2px] bg-blue-200 dark:bg-emerald-900" />

      {/* 50% */}
      <div className="w-3 h-3 rounded-[2px] bg-blue-300 dark:bg-emerald-700" />

      {/* 75% */}
      <div className="w-3 h-3 rounded-[2px] bg-blue-400 dark:bg-emerald-500" />

      {/* 100% */}
      <div className="w-3 h-3 rounded-[2px] bg-blue-500 dark:bg-emerald-400" />

      <span className="text-[10px] text-zinc-700 dark:text-zinc-600 ml-2">
        More
      </span>
    </div>
  );
}
