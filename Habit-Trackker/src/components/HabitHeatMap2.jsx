import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { getStartOfWeek } from "../utils/week";

const toDateKey = (d) => d.toISOString().slice(0, 10);

/* 🔥 DYNAMIC HEATMAP SCALER */
function getIntensityColor(percentage) {
  if (percentage === 0) return "bg-zinc-900";
  if (percentage <= 25) return "bg-emerald-900";
  if (percentage <= 50) return "bg-emerald-700";
  if (percentage <= 75) return "bg-emerald-500";
  return "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]";
}


const getDayKey = (date) =>
  ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][date.getUTCDay()];


export default function HabitHeatmap2() {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  const weekStart = getStartOfWeek();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Go back 364 days so today is included
  const startDate = new Date(today);
  startDate.setUTCDate(today.getUTCDate() - 364);

  const days = Array.from({ length: 365 }, (_, i) => {
    const d = new Date(startDate);
    d.setUTCDate(startDate.getUTCDate() + i);
    return d;
  });

  useEffect(() => {
    api
      .get("/activity/weekly", { params: { startDate: toDateKey(weekStart) } })
      .then((res) => {
        setHabits(res.data.habits || []);
        setLogs(res.data.logs || {});
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate global daily intensity
  const getDailyIntensity = (dateKey) => {
    const date = new Date(dateKey);
    const dayKey = getDayKey(date);

    let scheduledCount = 0;
    let completedCount = 0;

    habits.forEach((habit) => {
      // ✅ check if habit is scheduled for this day
      const isScheduled =
        habit.frequency === "daily" ||
        (habit.frequency === "weekly" && habit.days?.includes(dayKey));

      if (!isScheduled) return;

      scheduledCount++;

      const log = logs[`${habit._id}_${dateKey}`];
      if (log?.done) completedCount++;
    });

    if (scheduledCount === 0) return 0;
    return (completedCount / scheduledCount) * 100;
  };

  if (loading)
    return (
      <div className="p-10 text-zinc-800 text-xs">Generating Heatmap...</div>
    );

  return (
    <div className="w-full bg-black p-8 rounded-xl border border-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm font-semibold">Habit Density</h3>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest">
            Global completion rate across 365 days
          </p>
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-[10px] text-zinc-600 mr-2">Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-zinc-900" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-900" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-700" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-500" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-400" />
          <span className="text-[10px] text-zinc-600 ml-2">More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        {/* We use a flex-wrap or a multi-row grid like GitHub's actual contribution graph */}
        <div
          className="grid grid-flow-col grid-rows-7 gap-1.5"
          style={{ gridAutoColumns: "14px" }}
        >
          {days.map((day, i) => {
            const dateKey = toDateKey(day);
            const intensity = getDailyIntensity(dateKey);

            return (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.002 }}
                whileHover={{ scale: 1.3, zIndex: 10 }}
                className={`w-3.5 h-3.5 rounded-[2px] ${getIntensityColor(
                  intensity
                )} transition-colors`}
                title={`${dateKey}: ${Math.round(intensity)}% done`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
