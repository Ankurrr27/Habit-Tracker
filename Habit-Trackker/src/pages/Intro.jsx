import { Link } from "react-router-dom";
import { Flame, Shield, Calendar, ArrowRight } from "lucide-react";

export default function IntroPage() {
  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* SOFT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div>
          <span className="inline-block mb-4 text-xs tracking-widest uppercase text-indigo-400">
            Habit discipline system
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Build habits that
            <br />
            <span className="text-indigo-400">don’t lie.</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-xl">
            HabTrack is not about motivation.  
            It’s about showing up daily, tracking proof, and earning credibility
            through consistency.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 transition font-medium"
            >
              Start Tracking
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 rounded-md border border-zinc-700 hover:bg-zinc-900 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT (VISUAL BLOCK) */}
        <div className="hidden lg:block">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-zinc-400 mb-3">
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
      <section className="relative z-10 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-semibold mb-12">
            Designed for long-term discipline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* FOOTNOTE */}
      <footer className="relative z-10 text-center py-10 text-xs text-zinc-500 border-t border-zinc-800">
        Built for people who value discipline over motivation.
      </footer>
    </div>
  );
}

/* ------------------ COMPONENTS ------------------ */

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/40 transition">
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function MockHabit({ title, streak }) {
  return (
    <div className="flex items-center justify-between bg-black/40 border border-zinc-800 rounded-lg px-4 py-3">
      <span className="text-sm">{title}</span>
      <span className="text-xs text-indigo-400">{streak} day streak</span>
    </div>
  );
}
