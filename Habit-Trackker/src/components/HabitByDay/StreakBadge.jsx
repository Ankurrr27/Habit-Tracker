import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useSync } from "../../context/SyncContext";

export default function StreakBadge({ habitId }) {
  const { syncVersion } = useSync();
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    if (!habitId) {
      return undefined;
    }

    let isCancelled = false;

    const loadStreak = async () => {
      try {
        const res = await api.get(`/streak/${habitId}`);
        if (!isCancelled) {
          setStreak(res.data.streak);
        }
      } catch {
        if (!isCancelled) {
          setStreak(0);
        }
      }
    };

    void loadStreak();

    return () => {
      isCancelled = true;
    };
  }, [habitId, syncVersion]);

  const displayStreak = habitId ? streak : 0;

  if (displayStreak === null) {
    return (
      <span className="text-xs text-zinc-600 dark:text-zinc-500">
        ...
      </span>
    );
  }

  return (
    <span
      className="
        text-xs px-2 py-0.5 rounded-full
        font-medium
        border
        bg-blue-600/10 text-blue-600 border-blue-600/30
        dark:bg-emerald-600/10 dark:text-emerald-400 dark:border-emerald-600/30
      "
    >
      Fire {displayStreak}
    </span>
  );
}
