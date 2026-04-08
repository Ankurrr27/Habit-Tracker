import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { startOfAppDay, addAppDays } from "../../utils/date";
import { toDateKey } from "../HabitHeatmap/heatmap.utils";
import { motion as Motion } from "framer-motion";
import { useDashboard } from "../../context/useDashboard";

const SKELETON_BAR_HEIGHTS = [24, 38, 46, 58, 42, 67, 55, 40, 61, 48, 34, 52];

export default function ProgressChart() {
  const { loading, getDailyIntensity } = useDashboard();

  const today = useMemo(() => startOfAppDay(new Date()), []);
  const daysArr = useMemo(() => {
    const start = addAppDays(today, -29);
    return Array.from({ length: 30 }, (_, index) => addAppDays(start, index));
  }, [today]);

  const data = useMemo(() => {
    if (loading) {
      return [];
    }

    return daysArr.map((dateObj) => {
      const dateKey = toDateKey(dateObj);
      const intensity = getDailyIntensity(dateKey);

      return {
        date: dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        progress: Math.round(intensity),
      };
    });
  }, [loading, daysArr, getDailyIntensity]);

  if (loading) {
    return (
      <div className="h-full w-full animate-pulse p-8">
        <div className="mb-8 flex items-center justify-between pb-4">
          <div className="space-y-4">
            <div className="h-6 w-48 rounded-md bg-zinc-100 dark:bg-zinc-900" />
            <div className="h-3 w-40 rounded-md bg-zinc-50 dark:bg-zinc-900/40" />
          </div>
        </div>
        <div className="flex h-80 w-full items-end gap-2 rounded-2xl bg-zinc-50 px-4 dark:bg-zinc-900/40">
          {SKELETON_BAR_HEIGHTS.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-lg bg-zinc-100 dark:bg-zinc-800"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Motion.div
      className="h-full w-full p-5 sm:p-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="-mx-5 mb-5 px-5 pb-4 sm:-mx-8 sm:mb-6 sm:px-8">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Your Progress
        </h3>
        <p className="text-[10px] uppercase tracking-wide text-zinc-500">
          Last 30 Days completion rate (%)
        </p>
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
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#71717a" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#71717a" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e4e4e7",
                backgroundColor: "#fff",
              }}
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
