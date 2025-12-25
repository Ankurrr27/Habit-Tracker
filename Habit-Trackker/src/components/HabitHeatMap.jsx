import React, { useEffect, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import api from "../api/axios";

const HabitHeatmap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  const theme = {
    dark: [
      "#0d1117",
      "#1e7f43",
      "#2ea043",
      "#3fb950",
      "#56d364",
    ],
  };

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await api.get("/activity/heatmap", {
          params: { year },
        });

        setData(res.data?.length ? res.data : null);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmap();
  }, [year]);

  if (loading) return <div className="text-zinc-500">Loading…</div>;

  if (!data) {
    return (
      <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl text-zinc-500">
        No activity yet.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 p-10 rounded-3xl">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Yearly Habit Activity
        </h2>
        <span className="text-zinc-500 font-mono">{year}</span>
      </div>

      <ActivityCalendar
        data={data}
        theme={theme}
        colorScheme="dark"
        maxLevel={4}
        blockSize={20}
        blockMargin={5}
        fontSize={14}
        labels={{
          totalCount: "{{count}} habits completed in " + year,
        }}
      />

      <div className="flex items-center gap-3 mt-6 text-xs text-zinc-400">
        <span>Less</span>
        {theme.dark.map((c, i) => (
          <span key={i} className="w-4 h-4 rounded" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default HabitHeatmap;
