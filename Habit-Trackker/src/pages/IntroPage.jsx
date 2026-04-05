import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Flame,
  Shield,
  Sparkles,
  Globe,
  Download,
  BarChart2,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function IntroPage() {
  return (
    <div className="relative overflow-hidden bg-white text-zinc-900 dark:bg-[#030712] dark:text-white">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 right-[-6rem] h-[36rem] w-[36rem] rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-[30rem] w-[30rem] rounded-full bg-sky-500/8 blur-3xl dark:bg-sky-500/10" />
      </div>

      {/* HERO */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 pb-28 pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-400">
            <Sparkles size={10} className="text-indigo-500" />
            Daily habit system
          </div>

          <h1 className="mt-6 max-w-2xl text-5xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
            Build habits that{" "}
            <span className="text-indigo-600 dark:text-indigo-400">actually stick.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            One dashboard for daily habits, weekly scheduling, auto-tracked coding platforms, and progress you can actually see. Clear from day one.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-95"
            >
              Get started
              <ArrowRight size={15} strokeWidth={3} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-6 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Log in
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { value: "1 dashboard", label: "Daily clarity" },
              { value: "6 months", label: "Habit density" },
              { value: "4 platforms", label: "Auto-tracked" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-zinc-100 bg-white/80 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950/80">
                <p className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">{s.value}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>
        </Motion.div>

        {/* Hero card preview */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-4"
        >
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400">Today</p>
                <p className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">4 of 5 done</p>
              </div>
              <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 px-3 py-2 text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                80%
              </div>
            </div>
            <div className="space-y-2.5">
              <MockHabit title="Morning workout" meta="Daily habit" done />
              <MockHabit title="LeetCode daily" meta="Auto-tracked · Codeforces" done />
              <MockHabit title="Read 30 pages" meta="Daily habit" done={false} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-2">
              <Flame size={16} className="text-orange-500" />
              <p className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">14</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Day streak</p>
            </div>
            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-2">
              <BarChart2 size={16} className="text-indigo-500" />
              <p className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">92%</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Weekly rate</p>
            </div>
          </div>
        </Motion.div>
      </section>

      {/* FEATURES STRIP */}
      <section className="relative z-10 border-y border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/60 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Everything in one place</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Built around your daily execution, not project management overhead.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: <Flame size={18} />, title: "Streak Tracking", desc: "Daily, weekly, and interval habits all surface in one consistent system.", color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
              { icon: <Calendar size={18} />, title: "Weekly Calendar", desc: "See what's planned every day instead of guessing what comes next.", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
              { icon: <Globe size={18} />, title: "Platform Sync", desc: "Auto-detect activity from GitHub, LeetCode, Codeforces, and GFG.", color: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400" },
              { icon: <Shield size={18} />, title: "Credibility Score", desc: "Your consistency over time builds a trustworthy public record.", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
            ].map((f, i) => (
              <Motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 hover:border-indigo-500/20 transition-all"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>{f.icon}</div>
                <h3 className="mt-4 text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">{f.desc}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Start in 60 seconds</h2>
            <p className="text-sm text-zinc-400 mt-0.5">No complicated setup. Add one habit and go.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { step: "01", icon: <CheckCircle2 size={18} />, title: "Add your first habit", desc: "Create a daily or weekly habit. It shows up on your dashboard immediately." },
            { step: "02", icon: <Download size={18} />, title: "Install the extension", desc: "The browser side panel lets you tick habits and view your progress anywhere mid-focus." },
            { step: "03", icon: <Globe size={18} />, title: "Connect your platforms", desc: "Link GitHub, LeetCode, or Codeforces and let the app auto-detect your coding activity." },
          ].map((s, i) => (
            <Motion.div
              key={s.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 items-start rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                {s.icon}
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-indigo-500 mb-1">Step {s.step}</p>
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{s.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">{s.desc}</p>
              </div>
            </Motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Ready when you are</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/25 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Create your account
            <ArrowRight size={15} strokeWidth={3} />
          </Link>
          <Link to="/login" className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
            Already have an account? Log in →
          </Link>
        </Motion.div>
      </section>
    </div>
  );
}

function MockHabit({ title, meta, done }) {
  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 border transition
      ${done
        ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20"
        : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800"
      }`}
    >
      <div>
        <p className={`text-sm font-bold ${done ? "line-through text-emerald-700 dark:text-emerald-400 opacity-70" : "text-zinc-800 dark:text-zinc-200"}`}>{title}</p>
        <p className="text-[10px] font-medium text-zinc-400 mt-0.5">{meta}</p>
      </div>
      <div className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider
        ${done
          ? "bg-emerald-600 text-white"
          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
        }`}
      >
        {done ? "Done" : "Pending"}
      </div>
    </div>
  );
}
