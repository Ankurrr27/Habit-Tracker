import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import WeekCalendar from "./WeekCalendar";
import HabitItem from "./HabitItem";

/* ========= HELPERS ========= */
const toUTCDateKey = (d) =>
  `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;

function getNDays(count = 30) {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - now.getUTCDay()
    )
  );

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    return d;
  });
}

/* ========= COMPONENT ========= */
export default function HabitByDayList() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekDates = getNDays(30);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const todayIndex = weekDates.findIndex(
    (d) => toUTCDateKey(d) === toUTCDateKey(today)
  );

  const [selectedIndex, setSelectedIndex] = useState(
    todayIndex === -1 ? 0 : todayIndex
  );

  const selectedDate = weekDates[selectedIndex];
  const selectedKey = toUTCDateKey(selectedDate);
  const isToday = selectedKey === toUTCDateKey(today);

  /* =====================
     FETCH (CENTRALIZED)
  ===================== */
  const fetchHabits = useCallback(() => {
    setLoading(true);

    const endpoint = isToday
      ? "/activity/today"
      : `/activity?date=${selectedKey}`;

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

  /* 🔥 REAL-TIME SYNC */
  useEffect(() => {
    window.addEventListener("habits-updated", fetchHabits);
    return () =>
      window.removeEventListener("habits-updated", fetchHabits);
  }, [fetchHabits]);

  /* =====================
     TOGGLE (TODAY ONLY)
  ===================== */
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

  /* =====================
     DELETE HABIT (🔥 FIX)
  ===================== */
  const deleteHabit = async (habitId) => {
    if (!window.confirm("Delete this habit permanently?")) return;

    // optimistic remove
    setHabits((prev) => prev.filter((h) => h._id !== habitId));

    try {
      await api.delete(`/habits/${habitId}`);

      // 🔥 hard refresh everywhere
      window.dispatchEvent(new Event("habits-updated"));
    } catch (err) {
      console.error("Delete failed", err);
      fetchHabits(); // rollback
    }
  };

  return (
  <div className="space-y-4 md:space-y-5">
    {/* CALENDAR */}
    <WeekCalendar
      weekDates={weekDates}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      habitCounts={weekDates.map((_, i) =>
        i === selectedIndex ? habits.length : 0
      )}
    />

    {/* DATE LABEL */}
    <div className="text-sm md:text-sm text-zinc-400 px-1">
      {isToday ? "Today" : selectedDate.toDateString()}
    </div>

    {/* HABIT LIST */}
    <div
      className="
        space-y-2
        max-h-[50vh] md:max-h-[60vh]
        overflow-y-auto
        pr-1
        pb-24 md:pb-0
      "
    >
      {loading ? (
        <p className="text-zinc-500 text-sm px-1">Loading…</p>
      ) : habits.length === 0 ? (
        <p className="text-zinc-600 text-sm px-1">
          No habits
        </p>
      ) : (
        habits.map((habit) => (
          <HabitItem
            key={habit._id}
            habit={habit}
            onComplete={completeHabit}
            onDelete={deleteHabit}
            disabled={!isToday}
          />
        ))
      )}
    </div>
  </div>
);

}
