import UsersSkeleton from "./UsersSkeleton";
import UsersGrid from "./UsersGrid";
import { useUsers } from "./useUsers";
import { Users as UsersIcon } from "lucide-react";
import UserDashboardHeader from "../UserDashboardHeader";

export default function Users() {
  const {
    users,
    search,
    setSearch,
    loading,
    error,
    toggleFollow,
  } = useUsers();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-transparent">
      <div className="shrink-0 border-b border-white/30 dark:border-white/5 page-shell pb-4">
        <div className="page-header">
          <div className="page-header-copy">
            <div className="mb-1 flex items-center gap-2">
              <UsersIcon size={12} className="accent-text" />
              <span className="page-kicker">Community</span>
            </div>
            <h1 className="page-title">Find People</h1>
            <p className="page-subtitle">
              Search by username, manage requests, and explore the Verlocity
              community in a cleaner, more readable layout.
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username..."
            className="field-input w-full sm:max-w-xs"
          />
        </div>
      </div>

      <div className="flex h-full flex-1 flex-col overflow-hidden lg:flex-row">
        <main className="page-shell flex-1 overflow-y-auto border-r border-white/30 pb-32 dark:border-white/5 lg:w-1/2 lg:pb-12">
          {loading && <UsersSkeleton />}

          {error && (
            <div className="surface-card rounded-[20px] border border-red-100 bg-red-50/80 px-5 py-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="empty-state">
              <UsersIcon size={32} className="text-zinc-300 dark:text-zinc-700" />
              <p className="text-sm text-zinc-400">No users found</p>
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <UsersGrid users={users} onToggleFollow={toggleFollow} />
          )}
        </main>

        <aside className="h-full flex-1 overflow-y-auto bg-zinc-50/20 p-6 dark:bg-zinc-950/20 lg:w-1/2 lg:p-10">
          <div className="sticky top-0 mx-auto max-w-xl">
            <UserDashboardHeader variant="sidebar" />

            <div className="mt-10 px-6 text-center">
              <p className="mx-auto max-w-xs text-[11px] font-semibold uppercase tracking-[0.22em] leading-relaxed text-zinc-400">
                Connecting experts worldwide.
                <br />
                Keep growing together.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
