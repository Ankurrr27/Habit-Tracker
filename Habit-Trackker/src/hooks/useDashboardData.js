import { useState, useEffect } from "react";
import api from "../api/axios";
import { useSync } from "../context/useSync";
import { startOfAppDay, addAppDays, toDateKey } from "../utils/date";

export function useDashboardData() {
  const { syncVersion, triggerSync } = useSync();
  const [data, setData] = useState({ habits: [], logs: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch 30 days to cover Grid (16 days), Heatmap (30 days), and Chart (30 days)
        const today = startOfAppDay(new Date());
        const startDate = toDateKey(addAppDays(today, -29));

        const res = await api.get("/activity/range", {
          params: { startDate },
        });

        if (!isCancelled) {
          setData({
            habits: res.data.habits || [],
            logs: res.data.logs || {},
          });
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [syncVersion]);

  const toggleHabit = async (habitId, dateKey) => {
    const cellKey = `${habitId}_${dateKey}`;
    const previousLogs = { ...data.logs };
    const isDone = !!data.logs[cellKey]?.done;

    // Optimistic update
    const newLogs = {
      ...data.logs,
      [cellKey]: { ...data.logs[cellKey], done: !isDone },
    };
    setData((prev) => ({ ...prev, logs: newLogs }));

    try {
      await api.post("/activity/toggle", { habitId, date: dateKey });
      triggerSync(); // Trigger sync for other components (sidebar, etc.)
    } catch {
      // Rollback on error
      setData((prev) => ({ ...prev, logs: previousLogs }));
    }
  };

  return { ...data, loading, error, toggleHabit };
}
