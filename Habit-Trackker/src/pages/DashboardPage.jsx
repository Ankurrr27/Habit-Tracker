import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import HabitHeatmap from "../components/HabitHeatmap";
import HabitByDay from "../components/HabitByDay";
import RollingHabitGrid from "../components/RollingHabitGrid/RollingHabitGrid";
import DailyTasks from "../components/DailyTasks/DailyTasks";
import ProgressChart from "../components/ProgressChart/ProgressChart";
import api from "../api/axios";
import { useSync } from "../context/useSync";

const Dashboard = () => {
  const { triggerSync } = useSync();
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
  }, [triggerSync]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-auto lg:h-full min-h-0 lg:overflow-hidden bg-transparent">
      {/* LEFT: Habits + Tasks */}
      <aside className="lg:shrink-0 h-auto lg:h-full w-full lg:w-[360px] border-r border-white/30 dark:border-white/5 flex flex-col lg:overflow-hidden">
        {/* TAB HEADER */}
        <div className="shrink-0 px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="segmented-control flex w-full">
          <button
            onClick={() => setActiveTab("habits")}
            className={`segmented-tab flex-1 !py-2 !text-[10px] tracking-[0.14em] ${activeTab === "habits" ? "segmented-tab-active" : ""}`}
          >
            Habits
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={`segmented-tab flex-1 !py-2 !text-[10px] tracking-[0.14em] ${activeTab === "goals" ? "segmented-tab-active" : ""}`}
          >
            Tasks
          </button>
          </div>
        </div>

        {/* SCROLLABLE LIST */}
        <div className="flex-1 lg:overflow-y-auto lg:h-full p-4 pb-24 sm:p-5 lg:pb-6">
          <AnimatePresence mode="wait">
            {activeTab === "habits" ? (
              <Motion.div
                key="habits"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <HabitByDay />
              </Motion.div>
            ) : (
              <Motion.div
                key="goals"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <DailyTasks />
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* RIGHT: Visual Analytics */}
      <main className="flex-1 w-full h-auto lg:h-full lg:overflow-y-auto page-shell">
        <div className="page-stack max-w-5xl space-y-0">
          <div className="hidden lg:block">
            <RollingHabitGrid />
          </div>
          <div className="divider-soft" />
          <ProgressChart />
          <div className="divider-soft" />
          <HabitHeatmap />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
