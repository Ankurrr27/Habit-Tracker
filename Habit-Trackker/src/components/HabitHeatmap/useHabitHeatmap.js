import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { toDateKey, getDayKey } from "./heatmap.utils";
import { addAppDays, startOfAppDay } from "../../utils/date";
import { useSync } from "../../context/useSync";

export function useHabitHeatmap() {
  const { syncVersion } = useSync();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => {
    return startOfAppDay(new Date());
  }, []);

  const days = useMemo(() => {
    const start = addAppDays(today, -179);
    return Array.from({ length: 180 }, (_, index) => addAppDays(start, index));
  }, [today]);

  useEffect(() => {
    const startDate = toDateKey(
      new Date(today.getTime() - 179 * 24 * 60 * 60 * 1000)
    );
    let isCancelled = false;

    api
      .get("/activity/range", { params: { startDate } })
      .then((res) => {
        if (!isCancelled) {
          setHabits(res.data.habits || []);
          setLogs(res.data.logs || {});
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [today, syncVersion]);

  const getDailyIntensity = (dateKey) => {
    let scheduled = 0;
    let completed = 0;

    habits.forEach((habit) => {
      const isScheduled =
        habit.frequency === "daily" ||
        (habit.frequency === "weekly" &&
          habit.days?.includes(getDayKey(new Date(dateKey))));

      if (!isScheduled) return;

      scheduled += 1;
      if (logs[`${habit._id}_${dateKey}`]?.done) {
        completed += 1;
      }
    });

    return scheduled === 0 ? 0 : (completed / scheduled) * 100;
  };

  return { days, today, loading, getDailyIntensity };
}
