import { motion as Motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Info, Code2, Globe, ShieldCheck, HelpCircle, Download, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "howto", label: "How to Use" },
];

const paradigms = [
  {
    icon: <Code2 size={20} />,
    title: "Unboxed UI",
    description: "A flush, glassmorphism design language that removes aesthetic friction, keeping visuals pristine.",
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
  {
    icon: <Globe size={20} />,
    title: "Ecosystem Sync",
    description: "Seamlessly connect your Codeforces, GitHub, LeetCode, and custom platforms automatically.",
    color: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Elite Operations",
    description: "Built strictly for professionals aiming for absolute consistency and deep collaborative focus.",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
];

const steps = [
  {
    id: 1,
    icon: <Download size={18} />,
    title: "Initialize Extension",
    description: "Download and pin the browser extension. Add your external profiles (GitHub, LeetCode) to set up the sync pipeline.",
  },
  {
    id: 2,
    icon: <CheckCircle2 size={18} />,
    title: "Log Core Habits",
    description: "Head to the Dashboard. Use the Add Habit button to define daily objectives. Consistency metrics update automatically.",
  },
  {
    id: 3,
    icon: <Sparkles size={18} />,
    title: "Track Progress",
    description: "Use the Habit Density heatmap, Progress Chart, and Rolling Grid to visualize your consistency over time.",
  },
  {
    id: 4,
    icon: <Globe size={18} />,
    title: "Connect Community",
    description: "Go to Search to find and connect with other users. View public habit streaks and credibility scores.",
  },
];

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("about");

  return (
    <div className="flex flex-col w-full min-h-full lg:h-full lg:overflow-hidden bg-transparent">

      {/* Tab header — same style as Dashboard */}
      <div className="flex bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-900/50 shrink-0">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all
              ${activeSection === s.id
                ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-950 font-bold border-b-2 border-indigo-600 dark:border-indigo-400"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 h-auto lg:h-full lg:overflow-y-auto px-8 py-10">
        <AnimatePresence mode="wait">

          {activeSection === "about" && (
            <Motion.div
              key="about"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl space-y-12"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Info size={12} className="text-indigo-500" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-indigo-500">Protocol</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Engineered for Velocity.
                </h1>
                <p className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xl">
                  A high-performance workspace designed to sync your focus, align your habits, and amplify your collective momentum.
                </p>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800/50" />

              <div className="space-y-6">
                <h2 className="text-base font-extrabold uppercase tracking-[0.2em] text-zinc-400">Core Paradigms</h2>
                <div className="grid gap-5 sm:grid-cols-3">
                  {paradigms.map((item, i) => (
                    <Motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="space-y-4 py-2 border-l-2 border-transparent hover:border-indigo-500/30 pl-4 -ml-4 transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 rounded-r-2xl"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>{item.icon}</div>
                      <div>
                        <h3 className="font-extrabold text-zinc-900 dark:text-zinc-100 text-sm">{item.title}</h3>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">{item.description}</p>
                      </div>
                    </Motion.div>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800/50 pt-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                  Habit Tracker · Elite Edition · v2.0
                </span>
              </div>
            </Motion.div>
          )}

          {activeSection === "howto" && (
            <Motion.div
              key="howto"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl space-y-10"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle size={12} className="text-indigo-500" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-indigo-500">Manual</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Quick Start Guide</h1>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Follow these steps to set up your workspace and start tracking with precision.
                </p>
              </div>

              <div className="relative space-y-4">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-indigo-500/15 z-0" />

                {steps.map((step, idx) => (
                  <Motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative z-10 flex gap-5 items-start"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                      {step.icon}
                    </div>
                    <div className="flex-1 py-1 hover:translate-x-1 transition-transform">
                      <div className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-indigo-500 mb-1">Step 0{step.id}</div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">{step.description}</p>
                    </div>
                  </Motion.div>
                ))}
              </div>

              <div className="flex items-center gap-3 py-4 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={18} className="shrink-0" />
                <div>
                  <p className="text-sm font-bold">You're all set!</p>
                  <p className="text-[11px] opacity-70">Start tracking from the Dashboard.</p>
                </div>
                <ArrowRight size={16} className="ml-auto" />
              </div>
            </Motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
