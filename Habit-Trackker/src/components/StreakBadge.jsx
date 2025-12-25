// components/StreakBadge.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function StreakBadge({ habitId }) {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    if (!habitId) return;

    api
      .get(`/activity/streak/${habitId}`)
      .then((res) => setStreak(res.data.streak))
      .catch(() => setStreak(0));
  }, [habitId]);

  if (streak === null) {
    return (
      <span className="text-xs text-zinc-500">…</span>
    );
  }

  return (
    <span className="text-xs px-2 py-0.5 rounded-full border border-indigo-600/30 bg-indigo-600/10 text-indigo-400">
      🔥 {streak}
    </span>
  );
}
