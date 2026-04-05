import UsersHeader from "./UsersHeader";
import UsersSkeleton from "./UsersSkeleton";
import UsersGrid from "./UsersGrid";
import { useUsers } from "./useUsers";
import { Users as UsersIcon, UserCheck } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const {
    users, search, setSearch,
    loading, error, toggleFollow,
  } = useUsers();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden bg-transparent">

      {/* LEFT: Search + Requests sidebar */}
      <aside className="lg:shrink-0 h-full w-full lg:w-[300px] border-r border-zinc-100 dark:border-zinc-900/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <UsersIcon size={12} className="text-indigo-500" />
            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-indigo-500">Community</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Find People</h1>
          <p className="text-[11px] text-zinc-400 mt-1">Search for users and connect.</p>
        </div>

        {/* Search input */}
        <div className="px-6 pb-4 shrink-0">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search username..."
            className="w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 px-4 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>


      </aside>

      {/* RIGHT: Results grid */}
      <main className="flex-1 overflow-y-auto px-4 lg:px-8 pt-8 pb-32 lg:pb-8">
        {loading && <UsersSkeleton />}

        {error && (
          <div className="rounded-2xl border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <UsersIcon size={32} className="text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm text-zinc-400">No users found</p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <UsersGrid users={users} onToggleFollow={toggleFollow} />
        )}
      </main>
    </div>
  );
}
