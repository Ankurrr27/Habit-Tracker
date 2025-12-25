import { useEffect, useState } from "react";
import api from "../api/axios";
import { getStartOfWeek } from "../utils/week";

/* =====================
   HELPERS (UTC SAFE)
===================== */
const toDateKey = (d) => d.toISOString().slice(0, 10);

function getNDays(start, n = 100) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  });
}

/* 🔥 FIXED SCHEDULING LOGIC */
function isHabitScheduledOnDate(habit, date) {
  const day = new Date(date);
  day.setUTCHours(0, 0, 0, 0);

  // startDate guard
  if (habit.startDate) {
    const start = new Date(habit.startDate);
    start.setUTCHours(0, 0, 0, 0);
    if (day < start) return false;
  }

  // endDate guard
  if (habit.endDate) {
    const end = new Date(habit.endDate);
    end.setUTCHours(0, 0, 0, 0);
    if (day > end) return false;
  }

  const weekday = day
    .toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "UTC",
    })
    .toLowerCase()
    .slice(0, 3); // mon, tue...

  const habitDays = Array.isArray(habit.days)
    ? habit.days.map((d) => d.toLowerCase().slice(0, 3))
    : [];

  if (habit.frequency === "daily") return true;

  if (habit.frequency === "weekly") {
    return habitDays.includes(weekday);
  }

  if (habit.frequency === "interval") {
    if (!habit.startDate || !habit.intervalDays) return false;

    const start = new Date(habit.startDate);
    start.setUTCHours(0, 0, 0, 0);

    const diff =
      (day.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    return diff >= 0 && diff % habit.intervalDays === 0;
  }

  return false;
}

function getHeatColor(confidence = 0) {
  if (confidence >= 90) return "bg-emerald-600";
  if (confidence >= 60) return "bg-emerald-500";
  if (confidence >= 30) return "bg-emerald-400";
  return "bg-zinc-800";
}

/* =====================
   COMPONENT
===================== */
export default function WeeklyHabitGrid() {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  const weekStart = getStartOfWeek(); // UTC Monday
  const days = getNDays(weekStart, 100);
  const weekKey = toDateKey(weekStart);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayKey = toDateKey(today);

  /* =====================
     FETCH DATA
  ===================== */
  const fetchWeeklyData = () => {
    setLoading(true);

    api
      .get("/activity/weekly", {
        params: { startDate: weekKey },
      })
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500">
        Loading habits…
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black overflow-x-auto overflow-y-hidden">
      <div
        className="grid gap-[6px] p-4"
        style={{
          gridTemplateColumns: `140px repeat(100, 28px)`,
          gridAutoRows: "32px",
        }}
      >
        {/* EMPTY CORNER */}
        <div />

        {/* DAY HEADERS */}
        {days.map((day) => {
          const isToday = toDateKey(day) === todayKey;
          return (
            <div
              key={day.toISOString()}
              className={`text-center text-[10px] font-medium ${
                isToday ? "text-violet-400" : "text-zinc-500"
              }`}
            >
              {day.getUTCDate()}
            </div>
          );
        })}

        {/* HABIT ROWS */}
        {habits.map((habit) => (
          <div key={habit._id} className="contents">
            <div className="flex items-center text-xs font-medium text-zinc-300 truncate pr-2">
              {habit.title}
            </div>

            {days.map((day) => {
  const dateKey = toDateKey(day);
  const cellKey = `${habit._id}_${dateKey}`;

  const rawLog = logs[cellKey];
  const log =
    typeof rawLog === "boolean"
      ? { done: rawLog, confidence: 30 }
      : rawLog;

  const isPast = dateKey < todayKey;
  const hasLog = !!log;

  // 🔥 FIX: show past stats even if not scheduled
  const isScheduled =
    hasLog || isHabitScheduledOnDate(habit, day);

  return (
    <div
      key={cellKey}
      className={`flex items-center justify-center ${
        !isScheduled
          ? "opacity-10"
          : isPast
          ? "opacity-40"
          : ""
      }`}
    >
      {isScheduled && (
        <div
          className={`w-4 h-4 rounded-sm border border-zinc-700 ${
            log?.done
              ? getHeatColor(log.confidence)
              : "bg-zinc-900"
          }`}
        />
      )}
    </div>
  );
})}

          </div>
        ))}
      </div>
    </div>
  );
}
