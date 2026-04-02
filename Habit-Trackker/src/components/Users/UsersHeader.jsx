import { Search, Sparkles, Users2 } from "lucide-react";

export default function UsersHeader({ search, onSearch }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-zinc-50 px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
            <Sparkles size={13} />
            Social space
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Discover people, send requests, and build your circle
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Browse public profiles, send friend requests, and keep track of who is
            already connected with you.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:max-w-sm">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <Users2 size={14} />
            Search community
          </div>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
            />
            <input
              type="text"
              placeholder="Search by name or username"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              className="
                w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm
                text-zinc-900 placeholder:text-zinc-400 focus:outline-none
                focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                dark:border-zinc-800 dark:bg-zinc-900 dark:text-white
                dark:placeholder-zinc-500
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
