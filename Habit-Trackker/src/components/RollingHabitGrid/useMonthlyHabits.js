import { useEffect, useState } from "react";
import api from "../../api/axios";

export function useWeeklyHabits(weekKey) {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

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

    void loadWeeklyData();

    return () => {
      isCancelled = true;
    };
  }, [refreshTick, weekKey]);

  useEffect(() => {
    const handleHabitsUpdated = () => {
      setRefreshTick((tick) => tick + 1);
    };

    window.addEventListener("habits-updated", handleHabitsUpdated);
    return () => {
      window.removeEventListener(
        "habits-updated",
        handleHabitsUpdated
      );
    };
  }, []);

  return { habits, logs, loading };
}
