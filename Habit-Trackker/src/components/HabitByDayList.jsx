import { useEffect, useState } from "react";
import api from "../api/axios";
import WeekCalendar from "./WeekCalendar";
import HabitItem from "./HabitItem";

/* ========= HELPERS ========= */
const toUTCDateKey = (d) =>
  `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;

function getWeekDates() {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - now.getUTCDay()
    )
  );

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    return d;
  });
}

/* ========= COMPONENT ========= */
export default function HabitByDayList() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekDates = getWeekDates();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const todayIndex = today.getUTCDay();
  const [selectedIndex, setSelectedIndex] = useState(todayIndex);

  const selectedDate = weekDates[selectedIndex];
  const selectedKey = toUTCDateKey(selectedDate);
  const isToday = selectedKey === toUTCDateKey(today);

  /* ===== FETCH ===== */
  useEffect(() => {
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
  }, [selectedIndex]);

  /* ===== COMPLETE (SAME API AS GRID) ===== */
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

  return (
    <div className="space-y-5">
      <WeekCalendar
        weekDates={weekDates}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        habitCounts={weekDates.map((_, i) =>
          i === selectedIndex ? habits.length : 0
        )}
      />

      <div className="text-sm text-zinc-400">
        {isToday ? "Today" : selectedDate.toDateString()}
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {loading ? (
          <p className="text-zinc-500 text-sm">Loading…</p>
        ) : habits.length === 0 ? (
          <p className="text-zinc-600 text-sm">No habits</p>
        ) : (
          habits.map((habit) => (
            <HabitItem
              key={habit._id}
              habit={habit}
              onComplete={completeHabit}
              disabled={!isToday}
            />
          ))
        )}
      </div>
    </div>
  );
}
