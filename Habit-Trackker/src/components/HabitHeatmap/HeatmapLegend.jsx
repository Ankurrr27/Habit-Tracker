import { useAuth } from "../../context/useAuth";
import { getIntensityColor } from "./heatmap.utils";

export default function HeatmapLegend() {
  const { user } = useAuth();
  const accentColor = user?.accentColor || "indigo";

  return (
    <div className="flex gap-1 items-center">
      <span className="text-[10px] text-zinc-700 dark:text-zinc-600 mr-2 font-bold uppercase tracking-widest">
        Less
      </span>

      {/* 0% */}
      <div className="w-3.5 h-3.5 rounded-[4px] bg-zinc-200 dark:bg-zinc-900" />

      {/* 25% */}
      <div className={`w-3.5 h-3.5 rounded-[4px] ${getIntensityColor(25, accentColor)}`} />

      {/* 50% */}
      <div className={`w-3.5 h-3.5 rounded-[4px] ${getIntensityColor(50, accentColor)}`} />

      {/* 75% */}
      <div className={`w-3.5 h-3.5 rounded-[4px] ${getIntensityColor(75, accentColor)}`} />

      {/* 100% */}
      <div className={`w-3.5 h-3.5 rounded-[4px] ${getIntensityColor(100, accentColor)}`} />

      <span className="text-[10px] text-zinc-700 dark:text-zinc-600 ml-2 font-bold uppercase tracking-widest">
        More
      </span>
    </div>
  );
}
