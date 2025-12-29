import { Search } from "lucide-react";

export default function UsersHeader({ search, onSearch }) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Community Members
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Discover and connect with people on the platform
        </p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="
            w-full bg-zinc-900 border border-zinc-800 rounded-lg
            pl-9 pr-3 py-2 text-sm text-white
            placeholder-zinc-500
            focus:outline-none focus:border-indigo-500/50
          "
        />
      </div>
    </div>
  );
}
