import { useEffect, useState } from "react";
import api from "../api/axios";

export default function StreakBadge({ habitId }) {
  const [streak, setStreak] = useState(null);

  const fetchStreak = async () => {
    if (!habitId) return;

    try {
      const res = await api.get(`/activity/streak/${habitId}`);
      setStreak(res.data.streak);
    } catch {
      setStreak(0);
    }
  };

  useEffect(() => {
    fetchStreak();
  }, [habitId]);

  // 🔥 REAL-TIME UPDATE
  useEffect(() => {
    const handler = () => fetchStreak();

    window.addEventListener("habits-updated", handler);
    return () =>
      window.removeEventListener("habits-updated", handler);
  }, [habitId]);

  if (streak === null) {
    return (
      <span className="text-xs text-zinc-500">…</span>
    );
  }

  return (
    <span className="
      text-xs px-2 py-0.5 rounded-full
      border border-emerald-600/30
      bg-emerald-600/10
      text-emerald-400
      font-medium
    ">
      🔥 {streak}
    </span>
  );
}
