import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Install via: npm install framer-motion
import api from "../api/axios";
import { getStartOfWeek } from "../utils/week";

/* =====================
    HELPERS & LOGIC
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

function isHabitScheduledOnDate(habit, date) {
  const day = new Date(date);
  day.setUTCHours(0, 0, 0, 0);
  if (habit.startDate && day < new Date(habit.startDate).setUTCHours(0,0,0,0)) return false;
  if (habit.endDate && day > new Date(habit.endDate).setUTCHours(0,0,0,0)) return false;

  const weekday = day.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }).toLowerCase().slice(0, 3);
  const habitDays = Array.isArray(habit.days) ? habit.days.map((d) => d.toLowerCase().slice(0, 3)) : [];

  if (habit.frequency === "daily") return true;
  if (habit.frequency === "weekly") return habitDays.includes(weekday);
  if (habit.frequency === "interval") {
    const start = new Date(habit.startDate);
    const diff = (day.getTime() - start.setUTCHours(0,0,0,0)) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff % habit.intervalDays === 0;
  }
  return false;
}

function getHeatColor(confidence = 0) {
  if (confidence >= 90) return "bg-emerald-400";
  if (confidence >= 60) return "bg-emerald-500";
  if (confidence >= 30) return "bg-emerald-600";
  return "bg-zinc-800";
}

/* =====================
    COMPONENT
===================== */
export default function WeeklyHabitGrid() {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  const weekStart = getStartOfWeek();
  const days = getNDays(weekStart, 100);
  const todayKey = toDateKey(new Date());

  useEffect(() => {
    setLoading(true);
    api.get("/activity/weekly", { params: { startDate: toDateKey(weekStart) } })
      .then((res) => {
        setHabits(res.data.habits || []);
        setLogs(res.data.logs || {});
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full h-full bg-black text-zinc-400 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* 🟢 TOP NAV: Glassmorphism & Fixed */}
      <div className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 bg-black/80 backdrop-blur-xl sticky top-0 z-30">
        <div>
          <h1 className="text-white font-semibold text-sm tracking-tight">Consistency Matrix</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">100 Day Projection</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-medium uppercase tracking-tighter">Live Sync</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="inline-grid p-10 pt-6" style={{ gridTemplateColumns: `220px repeat(${days.length}, 34px)` }}>
          
          {/* HEADER: DATES */}
          <div className="sticky left-0 bg-black z-20" />
          {days.map((day, i) => {
            const isToday = toDateKey(day) === todayKey;
            return (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.005 }}
                key={day.toISOString()} 
                className="flex flex-col items-center mb-6"
              >
                <span className="text-[9px] font-black text-zinc-800 uppercase tracking-tighter mb-1">
                  {day.getUTCDate() === 1 ? day.toLocaleDateString('en-US', { month: 'short' }) : ""}
                </span>
                <div className={`text-[11px] font-mono ${isToday ? "text-emerald-400 font-bold" : "text-zinc-600"}`}>
                  {day.getUTCDate().toString().padStart(2, '0')}
                </div>
              </motion.div>
            );
          })}

          {/* ROWS */}
          <AnimatePresence mode="popLayout">
            {habits.map((habit, rowIndex) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                key={habit._id} 
                className="contents group"
              >
                {/* HABIT LABEL */}
                <div className="sticky left-0 bg-black z-10 flex items-center h-10 pr-8 border-r border-transparent group-hover:border-emerald-500/20 transition-all duration-500">
                  <span className="text-xs font-medium text-zinc-500 group-hover:text-white truncate transition-colors duration-300">
                    {habit.title}
                  </span>
                </div>

                {/* CELLS */}
                {days.map((day, colIndex) => {
                  const dateKey = toDateKey(day);
                  const cellKey = `${habit._id}_${dateKey}`;
                  const log = logs[cellKey];
                  const isScheduled = !!log || isHabitScheduledOnDate(habit, day);
                  const isPast = dateKey < todayKey;

                  if (!isScheduled) return <div key={cellKey} className="w-8 h-10" />;

                  return (
                    <div key={cellKey} className="flex items-center justify-center w-8 h-10 group/cell">
                      <motion.div
                        whileHover={{ scale: 1.4, borderRadius: "50%" }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20,
                          delay: (rowIndex * 0.01) + (colIndex * 0.002) 
                        }}
                        className={`
                          w-[22px] h-[22px] rounded-[4px] relative cursor-help
                          ${log?.done ? getHeatColor(log.confidence) : "bg-zinc-900"}
                          ${!log?.done && isPast ? "opacity-20 bg-zinc-800" : "opacity-100"}
                          ${dateKey === todayKey ? "ring-2   z-10" : ""}
                        `}
                      >
                        {/* Subtle inner shadow for 'Done' items */}
                        {log?.done && (
                          <div className="absolute inset-0 bg-white/10 rounded-[inherit] pointer-events-none" />
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}