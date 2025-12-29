import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { toDateKey, getDayKey } from "./heatmap.utils";
import { getStartOfWeek } from "../../utils/week";

export function useHabitHeatmap() {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }, []);

  const days = useMemo(() => {
    const start = new Date(today);
    start.setUTCDate(today.getUTCDate() - 364);
    return Array.from({ length: 365 }, (_, i) => {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      return d;
    });
  }, [today]);

  useEffect(() => {
  const startDate = toDateKey(
    new Date(today.getTime() - 364 * 24 * 60 * 60 * 1000)
  );

  api
    .get("/activity/range", { params: { startDate } })
    .then((res) => {
      setHabits(res.data.habits || []);
      setLogs(res.data.logs || {});
    })
    .finally(() => setLoading(false));
}, [today]);


  const getDailyIntensity = (dateKey) => {
    let scheduled = 0;
    let completed = 0;

    habits.forEach((habit) => {
      const isScheduled =
        habit.frequency === "daily" ||
        (habit.frequency === "weekly" &&
          habit.days?.includes(getDayKey(new Date(dateKey))));

      if (!isScheduled) return;

      scheduled++;
      if (logs[`${habit._id}_${dateKey}`]?.done) completed++;
    });

    return scheduled === 0 ? 0 : (completed / scheduled) * 100;
  };

  return { days, today, loading, getDailyIntensity };
}
