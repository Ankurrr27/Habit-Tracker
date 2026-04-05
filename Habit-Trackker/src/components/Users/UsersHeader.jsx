import { Search, Sparkles, Users2 } from "lucide-react";

export default function UsersHeader({ search, onSearch }) {
  return (
    <section className="relative w-full px-6 py-6 pb-2 shrink-0">
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-500">Social Space</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Discover and Connect
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Browse public profiles, send friend requests, and grow your accountability circle.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:max-w-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
            Search Community
          </label>
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
                w-full rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/50 py-3.5 pl-10 pr-4 text-sm font-medium
                text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-[#080f26]
                focus:ring-2 focus:ring-indigo-500/30 transition-all border border-transparent focus:border-indigo-500/20
                dark:text-white
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
