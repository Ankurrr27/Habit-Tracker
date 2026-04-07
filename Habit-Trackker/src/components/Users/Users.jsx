import UsersHeader from "./UsersHeader";
import UsersSkeleton from "./UsersSkeleton";
import UsersGrid from "./UsersGrid";
import { useUsers } from "./useUsers";
import { Users as UsersIcon, UserCheck } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UserDashboardHeader from "../UserDashboardHeader";

export default function Users() {
  const {
    users, search, setSearch,
    loading, error, toggleFollow,
  } = useUsers();

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-transparent">
      {/* Sticky top strip: title + search */}
      <div className="shrink-0 px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-900/50">
        <div className="flex items-center gap-2 mb-1">
          <UsersIcon size={12} className="text-indigo-500" />
          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-indigo-500">Community</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">Find People</h1>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search username…"
            className="w-full max-w-xs rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Scrollable results (Left) - 50% width */}
        <main className="flex-1 lg:w-1/2 overflow-y-auto px-6 lg:px-12 pt-10 pb-32 lg:pb-12 border-r border-zinc-100 dark:border-zinc-900/50">
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

        {/* Sticky Profile Sidebar (Right) - 50% width */}
        <aside className="flex-1 lg:w-1/2 h-full overflow-y-auto bg-zinc-50/30 dark:bg-zinc-950/20 p-8 lg:p-16">
          <div className="sticky top-0 max-w-xl mx-auto">
             {/* Note the isSidebar variant for vertical layout */}
             <UserDashboardHeader variant="sidebar" />
             
             {/* Subtitle / Footer-like text for the sidebar */}
             <div className="mt-12 px-6 text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  Connecting experts worldwide.<br/>
                  Keep growing together.
                </p>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
