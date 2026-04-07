import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { startOfAppDay, addAppDays } from "../../utils/date";
import { toDateKey } from "../HabitHeatmap/heatmap.utils";
import { motion as Motion } from "framer-motion";
import { useDashboard } from "../../context/DashboardContext";

export default function ProgressChart() {
  const { habits, logs, loading, getDailyIntensity } = useDashboard();
  const [data, setData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const today = useMemo(() => startOfAppDay(new Date()), []);
  const daysArr = useMemo(() => {
    const start = addAppDays(today, -29);
    return Array.from({ length: 30 }, (_, index) => addAppDays(start, index));
  }, [today]);

  useEffect(() => {
    if (loading) return;

    const chartData = daysArr.map((dateObj) => {
      const dateKey = toDateKey(dateObj);
      const intensity = getDailyIntensity(dateKey);
      
      return {
        date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        progress: Math.round(intensity),
      };
    });

    setData(chartData);
    setInitialLoading(false);
  }, [loading, daysArr, getDailyIntensity]);

  if (initialLoading || loading) {
    return (
      <div className="w-full h-full p-8 animate-pulse">
        <div className="flex items-center justify-between mb-8 pb-4">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-zinc-100 dark:bg-zinc-900 rounded-md" />
            <div className="h-3 w-40 bg-zinc-50 dark:bg-zinc-900/40 rounded-md" />
          </div>
        </div>
        <div className="h-80 w-full bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl flex items-end px-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-t-lg" 
              style={{ height: `${20 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Motion.div
      className="w-full h-full p-5 sm:p-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="-mx-5 mb-5 px-5 sm:-mx-8 sm:mb-6 sm:px-8 pb-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Your Progress</h3>
        <p className="text-[10px] uppercase tracking-wide text-zinc-500">Last 30 Days completion rate (%)</p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" stopOpacity={0.7} />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "10px", border: "1px solid #e4e4e7", backgroundColor: "#fff" }}
              itemStyle={{ color: "#6366f1", fontWeight: "600" }}
            />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="url(#colorProgress)"
              strokeWidth={4}
              fillOpacity={0.2}
              fill="url(#colorProgress)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Motion.div>
  );
}
