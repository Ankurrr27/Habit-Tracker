import { useEffect, useState } from "react";
import api from "../../api/axios";

export function useWeeklyHabits(weekKey) {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchWeeklyData = () => {
    setLoading(true);
    api
      .get("/activity/weekly", { params: { startDate: weekKey } })
      .then((res) => {
        setHabits(res.data.habits || []);
        setLogs(res.data.logs || {});
      })
      .catch(() => {
        setHabits([]);
        setLogs({});
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchWeeklyData, [weekKey]);

  useEffect(() => {
    window.addEventListener("habits-updated", fetchWeeklyData);
    return () =>
      window.removeEventListener("habits-updated", fetchWeeklyData);
  }, [weekKey]);

  return { habits, logs, loading };
}
