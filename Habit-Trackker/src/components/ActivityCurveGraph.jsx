import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ActivityCurveGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);

    api
      .get("/activity/heatmap") // 👈 already exists
      .then((res) => {
        // normalize for recharts
        const formatted = res.data.map((d) => ({
          date: d.date.slice(5), // MM-DD for compact axis
          count: d.count,
        }));
        setData(formatted);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(fetchData, [fetchData]);

  // 🔥 REAL-TIME SYNC
  useEffect(() => {
    window.addEventListener("habits-updated", fetchData);
    return () =>
      window.removeEventListener("habits-updated", fetchData);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-zinc-500">
        Loading activity…
      </div>
    );
  }

  return (
    <div className="w-full border-t border-zinc-800 px-6 py-4">
      <h3 className="text-sm font-medium text-zinc-300 mb-3">
        Daily Activity
      </h3>

      {data.length === 0 ? (
        <p className="text-sm text-zinc-600">
          No activity yet
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
            />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              fontSize={10}
            />
            <YAxis
              allowDecimals={false}
              stroke="#71717a"
              fontSize={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid #27272a",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#a1a1aa" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
