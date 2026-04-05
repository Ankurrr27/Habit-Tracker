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
    <div className="flex flex-col w-full h-auto lg:h-full lg:overflow-hidden bg-transparent">

       {/* TOP: Week navigation bar */}
       <header className="flex items-center justify-between px-8 py-6 shrink-0 bg-transparent">
         <div>
           <div className="flex items-center gap-2 mb-1">
             <CalendarDays size={14} className="text-indigo-500" />
             <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-500">Weekly Schedule</span>
           </div>
           <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{weekLabel}</h1>
         </div>

         <div className="flex items-center gap-2.5">
           <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-1 gap-1 border border-zinc-100/50 dark:border-zinc-800/30">
             <button onClick={() => shiftWeek(-1)} className="p-2.5 rounded-xl text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 transition hover:text-zinc-900 dark:hover:text-white">
               <ChevronLeft size={16} />
             </button>
             <button onClick={goToToday} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm hover:shadow-md transition">
               Today
             </button>
             <button onClick={() => shiftWeek(1)} className="p-2.5 rounded-xl text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 transition hover:text-zinc-900 dark:hover:text-white">
               <ChevronRight size={16} />
             </button>
           </div>
         </div>
       </header>

      {/* BODY: Split layout */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 lg:overflow-hidden">

        {/* LEFT: Week strip */}
        <aside className="lg:shrink-0 h-auto lg:h-full w-full lg:w-[350px] bg-zinc-50/30 dark:bg-zinc-900/20 lg:overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-1.5">
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
                  className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition w-full relative group hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 `}
                >
                  {isSelected && (
                    <Motion.div 
                      layoutId="activeDay"
                      className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-full" 
                    />
                  )}
                  
                  <div className="text-center w-8 shrink-0">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`}>
                      {date.toLocaleDateString(undefined, { weekday: "short" })}
                    </p>
                    <p className={`text-2xl font-extrabold tracking-tight leading-none mt-1 ${isSelected ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-400"}`}>
                      {date.getDate()}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-[10px] font-semibold ${isSelected ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
                        {count.completed}/{count.total} Completion
                      </span>
                      {isToday && !isSelected && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <Motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className={`h-full rounded-full transition-all ${isSelected ? "bg-indigo-600 dark:bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-600"}`} 
                      />
                    </div>
                  </div>
                </Motion.button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT: Day detail */}
        <main className="flex-1 h-auto lg:h-full lg:overflow-y-auto px-8 py-10 lg:pl-12">
          <div className="mb-10 flex flex-col gap-1">
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {weeklyCounts[selectedKey]?.completed ?? 0} of {weeklyCounts[selectedKey]?.total ?? 0} habits completed
              </p>
              <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${weeklyCounts[selectedKey]?.total > 0 ? (weeklyCounts[selectedKey].completed / weeklyCounts[selectedKey].total) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
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
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-5 px-6 py-5 transition-all
                      ${habit.done
                        ? "opacity-60 grayscale-[0.5]"
                        : "bg-white dark:bg-zinc-900/50"
                      }`}
                  >
                    <div className="flex-shrink-0">
                      {habit.done ? (
                        <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                          <CheckCircle2 size={16} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold tracking-tight ${habit.done ? "line-through text-zinc-500" : "text-zinc-900 dark:text-white"}`}>
                        {habit.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-md">
                          {habit.frequency}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-zinc-200 dark:border-zinc-800" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Habit</span>
                      </div>
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
