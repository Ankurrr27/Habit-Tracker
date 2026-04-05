import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import HabitHeatmap from "../components/HabitHeatmap";
import HabitByDay from "../components/HabitByDay";
import RollingHabitGrid from "../components/RollingHabitGrid/RollingHabitGrid";
import DailyTasks from "../components/DailyTasks/DailyTasks";
import ProgressChart from "../components/ProgressChart/ProgressChart";
import api from "../api/axios";
import { useSync } from "../context/SyncContext";

const Dashboard = () => {
  const { syncVersion, triggerSync } = useSync();
  const [activeTab, setActiveTab] = useState("habits");

  // Background auto-sync for LeetCode/Github
  useEffect(() => {
    const syncPlatforms = async () => {
      try {
        await api.get("/stats/today");
        // After platform sync, notify all components
        triggerSync();
      } catch (err) {
        console.error("Auto-sync failed", err);
      }
    };

    syncPlatforms();
    const intervalId = setInterval(syncPlatforms, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full h-auto lg:h-full lg:overflow-hidden bg-transparent">
      {/* LEFT: Habits + Tasks */}
      <aside className="lg:shrink-0 h-auto lg:h-full w-full lg:w-[350px] border-r border-zinc-100 dark:border-zinc-900/50 flex flex-col lg:overflow-hidden">
        {/* TAB HEADER */}
        <div className="flex bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-900/50 shrink-0">
          <button
            onClick={() => setActiveTab("habits")}
            className={`flex-1 px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all
              ${activeTab === "habits"
                ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-950 font-bold border-b-2 border-indigo-600 dark:border-indigo-400"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
          >
            Habits
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={`flex-1 px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all hidden lg:block
              ${activeTab === "goals"
                ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-950 font-bold border-b-2 border-indigo-600 dark:border-indigo-400"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
          >
            Efficiency
          </button>
        </div>

        {/* SCROLLABLE LIST */}
        <div className="flex-1 lg:overflow-y-auto lg:h-full p-6 pb-24 lg:pb-6">
          <AnimatePresence mode="wait">
            {activeTab === "habits" ? (
              <Motion.div
                key="habits"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <HabitByDay key={`habits-${syncVersion}`} />
              </Motion.div>
            ) : (
              <Motion.div
                key="goals"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <DailyTasks key={`tasks-${syncVersion}`} />
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* RIGHT: Visual Analytics */}
      <main className="flex-1 w-full h-auto lg:h-full lg:overflow-y-auto p-4 lg:py-12 lg:px-6">
        <div className="max-w-5xl lg:space-y-12 space-y-6">
          {/* key=syncVersion forces full remount on every sync — guaranteed fresh data */}
          <div className="hidden lg:block">
            <RollingHabitGrid key={`grid-${syncVersion}`} />
          </div>
          <div className="border-t border-zinc-100 dark:border-zinc-800/50" />
          <ProgressChart key={`chart-${syncVersion}`} />
          <div className="border-t border-zinc-100 dark:border-zinc-800/50" />
          <HabitHeatmap key={`heatmap-${syncVersion}`} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
