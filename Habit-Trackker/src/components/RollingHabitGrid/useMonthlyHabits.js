import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useSync } from "../../context/SyncContext";

export function useWeeklyHabits(weekKey) {
  const { syncVersion, triggerSync } = useSync();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadWeeklyData = async () => {
      try {
        const res = await api.get("/activity/range", {
          params: { startDate: weekKey },
        });
        if (!isCancelled) {
          setHabits(res.data.habits || []);
          setLogs(res.data.logs || {});
        }
      } catch {
        if (!isCancelled) {
          setHabits([]);
          setLogs({});
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadWeeklyData();

    return () => { isCancelled = true; };
  }, [weekKey, syncVersion]);

  const toggleHabit = async (habitId, dateKey) => {
    const cellKey = `${habitId}_${dateKey}`;
    const isDone = !!logs[cellKey]?.done;

    // Optimistic update
    setLogs((prev) => ({
      ...prev,
      [cellKey]: { ...prev[cellKey], done: !isDone },
    }));

    try {
      await api.post("/activity/toggle", { habitId, date: dateKey });
      triggerSync();
    } catch {
      // Rollback on error
      setLogs((prev) => ({
        ...prev,
        [cellKey]: { ...prev[cellKey], done: isDone },
      }));
    }
  };

  return { habits, logs, loading, toggleHabit };
}
