import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getNDays, toUTCDateKey } from "./habitByDay.utils";
import { startOfAppDay } from "../../utils/date";
import { useSync } from "../../context/SyncContext";

export function useHabitByDay() {
  const { syncVersion, triggerSync } = useSync();
  const weekDates = getNDays(30);

  const today = startOfAppDay(new Date());

  const todayIndex = weekDates.findIndex(
    (date) => toUTCDateKey(date) === toUTCDateKey(today)
  );

  const [selectedIndex, setSelectedIndex] = useState(
    todayIndex === -1 ? 0 : todayIndex
  );
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  // localTick is for manual self-refreshes (e.g. after delete), NOT syncVersion
  // syncVersion would cause an infinite loop since we call triggerSync here
  const [localTick, setLocalTick] = useState(0);

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
  }, [isToday, localTick, selectedKey]);

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
      triggerSync();
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
      triggerSync();
    } catch {
      // rollback: reload the list
      setLocalTick((t) => t + 1);
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
