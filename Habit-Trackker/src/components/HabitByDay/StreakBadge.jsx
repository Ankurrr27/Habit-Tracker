import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useSync } from "../../context/useSync";
import { useAuth } from "../../context/useAuth";
import { Flame } from "lucide-react";

export default function StreakBadge({ habitId }) {
  const { syncVersion } = useSync();
  const { user } = useAuth();
  const accentColor = user?.accentColor || "indigo";
  const [streak, setStreak] = useState(null);

  const accentMap = {
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
    pink: "bg-pink-500/10 text-pink-500 border-pink-500/30",
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    sky: "bg-sky-500/10 text-sky-500 border-sky-500/30",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/30",
  };

  useEffect(() => {
    if (!habitId) return undefined;
    let isCancelled = false;
    const loadStreak = async () => {
      try {
        const res = await api.get(`/streak/${habitId}`);
        if (!isCancelled) setStreak(res.data.streak);
      } catch {
        if (!isCancelled) setStreak(0);
      }
    };
    loadStreak();
    return () => { isCancelled = true; };
  }, [habitId, syncVersion]);

  const displayStreak = habitId ? streak : 0;

  if (displayStreak === null) {
    return <span className="text-xs text-zinc-600 dark:text-zinc-500">...</span>;
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border transition-colors ${accentMap[accentColor]}`}>
      <Flame size={10} className="fill-current" />
      {displayStreak}
    </span>
  );
}
