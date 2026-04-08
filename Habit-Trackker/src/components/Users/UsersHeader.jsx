import { Search, Sparkles } from "lucide-react";

export default function UsersHeader({ search, onSearch }) {
  return (
    <section className="relative w-full px-6 py-6 pb-2 shrink-0">
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles size={14} className="accent-text" />
            <span className="page-kicker">Social Space</span>
          </div>
          <h1 className="page-title text-2xl sm:text-3xl">
            Discover and Connect
          </h1>
          <p className="page-subtitle mt-2 max-w-xl">
            Browse public profiles, send friend requests, and grow your accountability circle.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:max-w-sm">
          <label className="field-label ml-1">
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
              className="field-input py-3.5 pl-10 pr-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
