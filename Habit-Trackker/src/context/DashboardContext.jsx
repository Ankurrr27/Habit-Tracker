import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useSync } from "./SyncContext";
import { startOfAppDay, addAppDays, toDateKey } from "../utils/date";
import idbStorage from "../utils/idbStorage";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const { syncVersion, triggerSync } = useSync();
  const [data, setData] = useState({ habits: [], logs: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Only show full loading state if we have no data at all
      if (!data.habits.length) setLoading(true);
      
      const today = startOfAppDay(new Date());
      const startDate = toDateKey(addAppDays(today, -29));

      const res = await api.get("/activity/range", {
        params: { startDate },
      });

      const newData = {
        habits: res.data.habits || [],
        logs: res.data.logs || {},
      };
      
      setData(newData);
      idbStorage.setItem("dashboard-cache", newData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data.habits.length]);

  useEffect(() => {
    let mounted = true;
    
    // Load from cache first
    idbStorage.getItem("dashboard-cache").then((cached) => {
      if (mounted && cached) {
        setData(cached);
        setLoading(false);
      }
    });

    fetchDashboardData();
    
    return () => { mounted = false; };
  }, [fetchDashboardData, syncVersion]);

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

  const syncPlatforms = async () => {
    try {
      await api.post("/activity/sync");
      triggerSync(); // This will trigger a re-fetch of the dashboard data
    } catch (err) {
      console.error("Sync failed", err);
    }
  };

  const getDayKey = (date) => {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return days[date.getDay()];
  };

  const getDailyIntensity = useCallback((dateKey) => {
    let scheduled = 0;
    let completed = 0;

    const targetDate = new Date(dateKey);
    const targetTime = targetDate.getTime();

    data.habits.forEach((habit) => {
      // 1. Lifecycle Check: Only count habits that existed on this date and haven't ended
      const startDay = new Date(habit.startDate || habit.createdAt);
      startDay.setHours(0, 0, 0, 0);
      
      if (targetTime < startDay.getTime()) return;
      
      if (habit.endDate) {
        const endDay = new Date(habit.endDate);
        endDay.setHours(23, 59, 59, 999);
        if (targetTime > endDay.getTime()) return;
      }

      // 2. Frequency Check
      const isScheduled =
        habit.frequency === "daily" ||
        (habit.frequency === "weekly" && habit.days?.includes(getDayKey(targetDate)));

      if (!isScheduled) return;

      scheduled += 1;
      if (data.logs[`${habit._id}_${dateKey}`]?.done) {
        completed += 1;
      }
    });

    return scheduled === 0 ? 0 : (completed / scheduled) * 100;
  }, [data.habits, data.logs]);

  const value = {
    ...data,
    loading,
    error,
    toggleHabit,
    syncPlatforms,
    getDailyIntensity,
    refresh: fetchDashboardData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
