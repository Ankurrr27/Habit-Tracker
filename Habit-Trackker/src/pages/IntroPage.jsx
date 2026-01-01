import { Link } from "react-router-dom";
import { Flame, Shield, Calendar, ArrowRight } from "lucide-react";

export default function IntroPage() {
  return (
    <div className="relative bg-white text-zinc-900 dark:bg-black dark:text-white overflow-hidden">
      {/* BACKGROUND ACCENTS */}
      <div className="absolute inset-0 pointer-events-none">
        {/* LIGHT */}
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl dark:hidden" />
        <div className="absolute top-1/3 -left-48 w-[520px] h-[520px] rounded-full bg-purple-500/10 blur-3xl dark:hidden" />

        {/* DARK */}
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-3xl hidden dark:block" />
        <div className="absolute top-1/3 -left-48 w-[520px] h-[520px] rounded-full bg-purple-500/15 blur-3xl hidden dark:block" />
      </div>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-36 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* LEFT */}
        <div>
          <span className="inline-flex items-center gap-2 mb-5 text-xs tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            Habit discipline system
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            Build habits that
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">
              don’t lie.
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
            HabTrack is not about motivation.
            It’s about showing up daily, tracking proof,
            and earning credibility through consistency.
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-wrap gap-5">
            {/* PRIMARY */}
            <Link
              to="/register"
              className="
                group inline-flex items-center gap-2
                px-7 py-3.5 rounded-xl
                bg-indigo-600 text-white
                shadow-lg shadow-indigo-600/30
                hover:bg-indigo-500
                hover:shadow-indigo-500/40
                transition
                font-medium
              "
            >
              Start Tracking
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>

            {/* SECONDARY */}
            <Link
              to="/login"
              className="
                inline-flex items-center
                px-7 py-3.5 rounded-xl
                border border-zinc-300 dark:border-zinc-700
                text-zinc-700 dark:text-zinc-200
                hover:bg-zinc-100 dark:hover:bg-zinc-900
                transition
              "
            >
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hidden lg:block">
          <div
            className="
              bg-white dark:bg-zinc-900
              rounded-3xl p-7
              border border-zinc-200 dark:border-zinc-800
              shadow-2xl
            "
          >
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
              Today’s progress
            </div>

            <div className="space-y-4">
              <MockHabit title="Workout" streak={18} />
              <MockHabit title="Reading" streak={42} />
              <MockHabit title="Meditation" streak={7} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-28">
          <h2 className="text-3xl font-semibold mb-14">
            Designed for long-term discipline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Feature
              icon={<Flame />}
              title="Streak-Driven Habits"
              desc="Miss a day and the streak breaks. No excuses. Just truth."
            />

            <Feature
              icon={<Calendar />}
              title="Daily Proof System"
              desc="Every habit is logged day by day. Consistency is visible."
            />

            <Feature
              icon={<Shield />}
              title="Credibility Score"
              desc="Your discipline compounds into a public credibility signal."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-12 text-xs text-zinc-500 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
        Built for people who value discipline over motivation.
      </footer>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Feature({ icon, title, desc }) {
  return (
    <div
      className="
        bg-white dark:bg-zinc-900
        rounded-2xl p-7
        border border-zinc-200 dark:border-zinc-800
        shadow-sm
        hover:border-indigo-500/40
        transition
      "
    >
      <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function MockHabit({ title, streak }) {
  return (
    <div
      className="
        flex items-center justify-between
        bg-zinc-50 dark:bg-black/40
        border border-zinc-200 dark:border-zinc-800
        rounded-xl px-5 py-3
      "
    >
      <span className="text-sm">{title}</span>
      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
        {streak} day streak
      </span>
    </div>
  );
}
