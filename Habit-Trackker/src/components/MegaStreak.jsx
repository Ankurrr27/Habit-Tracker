import { Flame } from "lucide-react";

export default function MegaStreak({ streak = 0 }) {
  return (
    <div className="relative bg-black border border-zinc-800 rounded-2xl p-8 overflow-hidden">

      {/* GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[400px] h-[400px] bg-orange-500/20 blur-[120px]" />
      </div>

      <div className="flex items-center justify-between">
        
        {/* LEFT TEXT */}
        <div>
          <p className="text-sm text-zinc-400 uppercase tracking-wide">
            Current Streak
          </p>

          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-5xl sm:text-6xl font-extrabold text-white">
              {streak}
            </span>
            <span className="text-lg text-zinc-400">
              days
            </span>
          </div>

          <p className="mt-3 text-sm text-zinc-500">
            Don’t break the chain.
          </p>
        </div>

        {/* ICON */}
        <div className="flex items-center justify-center w-16 h-16 rounded-xl 
                        bg-orange-500/10 border border-orange-500/30">
          <Flame className="w-8 h-8 text-orange-400" />
        </div>

      </div>
    </div>
  );
}
