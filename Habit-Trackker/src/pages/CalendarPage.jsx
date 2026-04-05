import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function startOfWeek(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}
function getWeekDates(anchor) {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function CalendarPage() {
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0); return t;
  });
  const [selectedDayHabits, setSelectedDayHabits] = useState([]);
  const [weeklyCounts, setWeeklyCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const weekDates = useMemo(() => getWeekDates(weekAnchor), [weekAnchor]);
  const todayKey = toDateKey(new Date());
  const selectedKey = toDateKey(selectedDate);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(weekDates.map(d => api.get("/activity/status", { params: { date: toDateKey(d) } })))
      .then(responses => {
        if (cancelled) return;
        const counts = {};
        responses.forEach((r, i) => {
          const key = toDateKey(weekDates[i]);
          counts[key] = { total: r.data.length, completed: r.data.filter(h => h.done).length };
          if (key === selectedKey) setSelectedDayHabits(r.data);
        });
        setWeeklyCounts(counts);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selectedKey, weekDates]);

  useEffect(() => {
    if (!weekDates.some(d => toDateKey(d) === selectedKey)) setSelectedDate(weekDates[0]);
  }, [selectedKey, weekDates]);

  const weekLabel = useMemo(() => {
    const opts = { month: "short", day: "numeric" };
    return `${weekDates[0].toLocaleDateString(undefined, opts)} – ${weekDates[6].toLocaleDateString(undefined, opts)}, ${weekDates[6].getFullYear()}`;
  }, [weekDates]);

  const goToToday = () => {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    setWeekAnchor(t); setSelectedDate(t);
  };
  const shiftWeek = (dir) => {
    const next = new Date(weekAnchor); next.setDate(next.getDate() + dir * 7); setWeekAnchor(next);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-transparent">

      {/* TOP: Week navigation bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-zinc-100 dark:border-zinc-900/50 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <CalendarDays size={12} className="text-indigo-500" />
            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-indigo-500">Weekly Schedule</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{weekLabel}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => shiftWeek(-1)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
            <ChevronLeft size={15} />
          </button>
          <button onClick={goToToday} className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20">
            Today
          </button>
          <button onClick={() => shiftWeek(1)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* BODY: Split layout */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

        {/* LEFT: Week strip */}
        <aside className="lg:shrink-0 h-full w-full lg:w-[300px] border-r border-zinc-100 dark:border-zinc-900/50 overflow-y-auto px-5 py-6">
          <div className="flex flex-col gap-2">
            {weekDates.map(date => {
              const key = toDateKey(date);
              const isSelected = key === selectedKey;
              const isToday = key === todayKey;
              const count = weeklyCounts[key] || { total: 0, completed: 0 };
              const pct = count.total > 0 ? Math.round((count.completed / count.total) * 100) : 0;

              return (
                <Motion.button
                  key={key}
                  onClick={() => setSelectedDate(date)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition w-full
                    ${isSelected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : isToday
                      ? "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    }`}
                >
                  <div className={`text-center w-10 shrink-0`}>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? "text-indigo-200" : "text-zinc-400"}`}>
                      {date.toLocaleDateString(undefined, { weekday: "short" })}
                    </p>
                    <p className={`text-2xl font-extrabold tracking-tight leading-none mt-0.5 ${isSelected ? "text-white" : "text-zinc-900 dark:text-zinc-100"}`}>
                      {date.getDate()}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-[10px] font-bold ${isSelected ? "text-indigo-200" : "text-zinc-400"}`}>{count.completed}/{count.total} done</span>
                      {isToday && !isSelected && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                    </div>
                    <div className={`h-1 w-full rounded-full overflow-hidden ${isSelected ? "bg-indigo-400/30" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                      <div className={`h-full rounded-full transition-all ${isSelected ? "bg-white" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </Motion.button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT: Day detail */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {weeklyCounts[selectedKey]?.completed ?? 0} of {weeklyCounts[selectedKey]?.total ?? 0} habits completed
            </p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />)}
            </div>
          ) : selectedDayHabits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <CalendarDays size={32} className="text-zinc-300 dark:text-zinc-700" />
              <p className="text-sm text-zinc-400">Nothing scheduled for this day</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <Motion.div key={selectedKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                {selectedDayHabits.map((habit, i) => (
                  <Motion.div
                    key={habit.habitId}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition
                      ${habit.done
                        ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20"
                        : "bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800"
                      }`}
                  >
                    {habit.done
                      ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                      : <Circle size={18} className="text-zinc-300 dark:text-zinc-600 shrink-0" />
                    }
                    <div>
                      <p className={`text-sm font-bold ${habit.done ? "line-through text-emerald-700 dark:text-emerald-400 opacity-70" : "text-zinc-800 dark:text-zinc-200"}`}>
                        {habit.title}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{habit.frequency}</p>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
