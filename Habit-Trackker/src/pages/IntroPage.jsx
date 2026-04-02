import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Flame,
  Shield,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

export default function IntroPage() {
  return (
    <div className="relative overflow-hidden bg-white text-zinc-900 dark:bg-black dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-indigo-500/12 blur-3xl dark:bg-indigo-500/18" />
        <div className="absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/12" />
      </div>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
            Simple habit system for people who want structure
          </div>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
            Build routines, plan your week, and keep your team moving without a confusing setup.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            HabTrack gives you one place for daily habits, a proper weekly calendar, auto-tracked
            coding hobbies, team tasks, and progress you can actually see. It is designed to feel
            clear from day one, even if you are not used to productivity apps.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="
                inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white
                shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700
              "
            >
              Start in a minute
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/login"
              className="
                inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700
                transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900
              "
            >
              Log in
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MiniStat label="Daily clarity" value="1 dashboard" />
            <MiniStat label="Weekly planning" value="Calendar + schedule" />
            <MiniStat label="Auto-tracking" value="4 coding platforms" />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <QuickPoint
              icon={<CheckCircle2 size={16} />}
              title="Easy first step"
              description="Add one habit, one coding hobby, or one team task and the app starts making sense immediately."
            />
            <QuickPoint
              icon={<Clock3 size={16} />}
              title="Less mental load"
              description="See what is due today, what is planned this week, and what your team still needs without digging."
            />
          </div>
        </div>

        <div className="grid gap-5">
          <HeroCard />
          <div className="grid gap-5 md:grid-cols-2">
            <SmallCard
              icon={<Workflow size={18} />}
              title="Personal + team flow"
              description="Use it alone first, then invite a team later without learning a second system."
            />
            <SmallCard
              icon={<CheckCircle2 size={18} />}
              title="Manual and automatic proof"
              description="Tick habits yourself or let coding activity mark the work for you."
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold">More than a streak counter</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              The app works best when your habits, schedule, proof, and teamwork all live in one
              place.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Feature
              icon={<Flame size={18} />}
              title="Streak-driven discipline"
              desc="Daily, weekly, and interval habits all surface in one consistent system."
            />
            <Feature
              icon={<Calendar size={18} />}
              title="Weekly schedule view"
              desc="Open the calendar to see what is planned on each day instead of guessing what comes next."
            />
            <Feature
              icon={<Shield size={18} />}
              title="Credibility over hype"
              desc="Progress compounds into something more trustworthy than motivation talk."
            />
            <Feature
              icon={<Users size={18} />}
              title="Teams that stay lightweight"
              desc="Create a team, invite members, assign work, and keep the process readable for everyone."
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">How people usually use it</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Start small, then expand into calendar planning and team work when you need it.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <Step
            index="01"
            title="Define the routine"
            desc="Create manual habits or coding hobbies with daily, weekly, or interval schedules."
          />
          <Step
            index="02"
            title="Capture the proof"
            desc="Mark progress yourself or let platform activity fill in today's work automatically."
          />
          <Step
            index="03"
            title="Stay aligned"
            desc="Use teams, projects, and assigned tasks to keep accountability visible without making the workflow heavy."
          />
        </div>
      </section>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Today overview
          </div>
          <div className="mt-2 text-2xl font-semibold">4 of 5 completed</div>
        </div>
        <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          80%
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <MockHabit title="Ship focused work block" meta="Manual habit" status="Done" />
        <MockHabit title="Solve LeetCode daily" meta="Auto-tracked hobby" status="Detected" />
        <MockHabit title="Team standup" meta="Shared workspace" status="Planned" />
      </div>
    </div>
  );
}

function MockHabit({ title, meta, status }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-black/30">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{meta}</div>
      </div>
      <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
        {status}
      </div>
    </div>
  );
}

function SmallCard({ icon, title, description }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{desc}</p>
    </div>
  );
}

function Step({ index, title, desc }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">{index}</div>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{desc}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}

function QuickPoint({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
