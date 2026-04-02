import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getNDays, toUTCDateKey } from "./habitByDay.utils";

export function useHabitByDay() {
  const weekDates = getNDays(30);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const todayIndex = weekDates.findIndex(
    (date) => toUTCDateKey(date) === toUTCDateKey(today)
  );

  const [selectedIndex, setSelectedIndex] = useState(
    todayIndex === -1 ? 0 : todayIndex
  );
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  const selectedDate = weekDates[selectedIndex];
  const selectedKey = toUTCDateKey(selectedDate);
  const isToday = selectedKey === toUTCDateKey(today);

  useEffect(() => {
    let isCancelled = false;
    const endpoint = isToday
      ? "/stats/today"
      : `/activity/status?date=${selectedKey}`;

    const loadHabits = async () => {
      try {
        const res = await api.get(endpoint);
        if (!isCancelled) {
          setHabits(
            res.data.map((habit) => ({
              _id: habit.habitId,
              title: habit.title,
              done: habit.done,
            }))
          );
        }
      } catch {
        if (!isCancelled) {
          setHabits([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadHabits();

    return () => {
      isCancelled = true;
    };
  }, [isToday, refreshTick, selectedKey]);

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

  const completeHabit = async (habitId) => {
    if (!isToday) return;

    setHabits((prev) =>
      prev.map((habit) =>
        habit._id === habitId
          ? { ...habit, done: !habit.done }
          : habit
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
        prev.map((habit) =>
          habit._id === habitId
            ? { ...habit, done: !habit.done }
            : habit
        )
      );
    }
  };

  const deleteHabit = async (habitId) => {
    if (!window.confirm("Delete this habit permanently?")) return;

    setHabits((prev) => prev.filter((habit) => habit._id !== habitId));

    try {
      await api.delete(`/habits/${habitId}`);
      window.dispatchEvent(new Event("habits-updated"));
    } catch {
      setRefreshTick((tick) => tick + 1);
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
