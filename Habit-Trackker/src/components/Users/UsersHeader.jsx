import { Search } from "lucide-react";

export default function UsersHeader({ search, onSearch }) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Community Members
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Discover and connect with people on the platform
        </p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2
                     text-zinc-500 dark:text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="
            w-full rounded-lg
            pl-9 pr-3 py-2 text-sm
            bg-white dark:bg-zinc-900
            text-zinc-900 dark:text-white
            border border-zinc-300 dark:border-zinc-800
            placeholder-zinc-400 dark:placeholder-zinc-500
            focus:outline-none
            focus:ring-2 focus:ring-indigo-500/30
            focus:border-indigo-500
          "
        />
      </div>
    </div>
  );
}
