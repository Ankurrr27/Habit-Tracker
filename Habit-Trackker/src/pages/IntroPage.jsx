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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 right-[-6rem] h-[36rem] w-[36rem] rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-[30rem] w-[30rem] rounded-full bg-sky-500/8 blur-3xl dark:bg-sky-500/10" />
      </div>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-24">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-400">
            <Sparkles size={10} className="text-indigo-500" />
            Daily habit system
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Build habits that{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              actually stick.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] font-medium leading-7 text-zinc-500 dark:text-zinc-400">
            One dashboard for daily habits, weekly scheduling, auto-tracked
            coding platforms, and progress you can actually see. Clear from day
            one.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary px-6 py-3">
              Get started
              <ArrowRight size={15} strokeWidth={3} />
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-3">
              Log in
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { value: "1 dashboard", label: "Daily clarity" },
              { value: "6 months", label: "Habit density" },
              { value: "5 platforms", label: "Auto-tracked" },
            ].map((s) => (
              <div key={s.label} className="stat-card px-4 py-4">
                <p className="text-lg font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-4"
        >
          <div className="surface-card-strong p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Today
                </p>
                <p className="mt-0.5 text-xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
                  4 of 5 done
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
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
            <div className="stat-card space-y-2 p-4">
              <Flame size={16} className="text-orange-500" />
              <p className="text-2xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
                14
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Day streak
              </p>
            </div>
            <div className="stat-card space-y-2 p-4">
              <BarChart2 size={16} className="text-indigo-500" />
              <p className="text-2xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
                92%
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Weekly rate
              </p>
            </div>
          </div>
        </Motion.div>
      </section>

      <section className="relative z-10 border-y border-zinc-100 bg-zinc-50/60 dark:border-zinc-800/60 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
              Everything in one place
            </h2>
            <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Built around your daily execution, not project management
              overhead.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: <Flame size={18} />,
                title: "Streak Tracking",
                desc: "Daily, weekly, and interval habits all surface in one consistent system.",
                color:
                  "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
              },
              {
                icon: <Calendar size={18} />,
                title: "Weekly Calendar",
                desc: "See what is planned every day instead of guessing what comes next.",
                color:
                  "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
              },
              {
                icon: <Globe size={18} />,
                title: "Platform Sync",
                desc: "Auto-detect activity from GitHub, LeetCode, Codeforces, CodeChef, and GFG.",
                color:
                  "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
              },
              {
                icon: <Shield size={18} />,
                title: "Credibility Score",
                desc: "Your consistency over time builds a trustworthy public record.",
                color:
                  "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
              },
            ].map((f, i) => (
              <Motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="surface-card p-5 transition-all hover:border-indigo-500/20"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[13px] font-medium leading-6 text-zinc-500 dark:text-zinc-400">
                  {f.desc}
                </p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mb-12 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
              Start in 60 seconds
            </h2>
            <p className="mt-0.5 text-sm font-medium text-zinc-400">
              No complicated setup. Add one habit and go.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              step: "01",
              icon: <CheckCircle2 size={18} />,
              title: "Add your first habit",
              desc: "Create a daily or weekly habit. It shows up on your dashboard immediately.",
            },
            {
              step: "02",
              icon: <Download size={18} />,
              title: "Install the extension",
              desc: "The browser side panel lets you tick habits and view your progress anywhere mid-focus.",
            },
            {
              step: "03",
              icon: <Globe size={18} />,
              title: "Connect your platforms",
              desc: "Link GitHub, LeetCode, or Codeforces and let the app auto-detect your coding activity.",
            },
          ].map((s, i) => (
            <Motion.div
              key={s.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="surface-card flex items-start gap-5 p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                {s.icon}
              </div>
              <div>
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-indigo-500">
                  Step {s.step}
                </p>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[13px] font-medium leading-6 text-zinc-500 dark:text-zinc-400">
                  {s.desc}
                </p>
              </div>
            </Motion.div>
          ))}
        </div>

        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Ready when you are
          </p>
          <Link to="/register" className="btn-primary px-8 py-3.5">
            Create your account
            <ArrowRight size={15} strokeWidth={3} />
          </Link>
          <Link
            to="/login"
            className="text-xs font-medium text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            Already have an account? Log in →
          </Link>
        </Motion.div>
      </section>
    </div>
  );
}

function MockHabit({ title, meta, done }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${
        done
          ? "border-emerald-100 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10"
          : "border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50"
      }`}
    >
      <div>
        <p
          className={`text-sm font-semibold ${
            done
              ? "text-emerald-700 line-through opacity-70 dark:text-emerald-400"
              : "text-zinc-800 dark:text-zinc-200"
          }`}
        >
          {title}
        </p>
        <p className="mt-0.5 text-[10px] font-medium text-zinc-400">{meta}</p>
      </div>
      <div
        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
          done
            ? "bg-emerald-600 text-white"
            : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
        }`}
      >
        {done ? "Done" : "Pending"}
      </div>
    </div>
  );
}
