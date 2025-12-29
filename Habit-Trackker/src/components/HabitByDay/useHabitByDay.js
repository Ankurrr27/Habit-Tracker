import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import { getNDays, toUTCDateKey } from "./habitByDay.utils";

export function useHabitByDay() {
  const weekDates = getNDays(30);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const todayIndex = weekDates.findIndex(
    (d) => toUTCDateKey(d) === toUTCDateKey(today)
  );

  const [selectedIndex, setSelectedIndex] = useState(
    todayIndex === -1 ? 0 : todayIndex
  );
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedDate = weekDates[selectedIndex];
  const selectedKey = toUTCDateKey(selectedDate);
  const isToday = selectedKey === toUTCDateKey(today);

  const fetchHabits = useCallback(() => {
    setLoading(true);

    const endpoint = isToday
      ? "/stats/today"
      : `/activity/status?date=${selectedKey}`;

    api
      .get(endpoint)
      .then((res) => {
        setHabits(
          res.data.map((h) => ({
            _id: h.habitId,
            title: h.title,
            done: h.done,
          }))
        );
      })
      .catch(() => setHabits([]))
      .finally(() => setLoading(false));
  }, [isToday, selectedKey]);

  useEffect(fetchHabits, [fetchHabits]);

  useEffect(() => {
    window.addEventListener("habits-updated", fetchHabits);
    return () =>
      window.removeEventListener("habits-updated", fetchHabits);
  }, [fetchHabits]);

  const completeHabit = async (habitId) => {
    if (!isToday) return;

    setHabits((prev) =>
      prev.map((h) =>
        h._id === habitId ? { ...h, done: !h.done } : h
      )
    );

    try {
      await api.post("/activity/toggle", {
        habitId,
        date: selectedKey,
      });
      window.dispatchEvent(new Event("habits-updated"));
    } catch {
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habitId ? { ...h, done: !h.done } : h
        )
      );
    }
  };

  const deleteHabit = async (habitId) => {
    if (!window.confirm("Delete this habit permanently?")) return;

    setHabits((prev) => prev.filter((h) => h._id !== habitId));

    try {
      await api.delete(`/habits/${habitId}`);
      window.dispatchEvent(new Event("habits-updated"));
    } catch {
      fetchHabits();
    }
  };

  return {
    weekDates,
    selectedIndex,
    setSelectedIndex,
    selectedDate,
    isToday,
    habits,
    loading,
    completeHabit,
    deleteHabit,
  };
}
