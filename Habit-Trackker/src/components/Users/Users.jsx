import UsersHeader from "./UsersHeader";
import UsersSkeleton from "./UsersSkeleton";
import UsersGrid from "./UsersGrid";
import { useUsers } from "./useUsers";

export default function Users() {
  const { users, search, setSearch, loading, error } = useUsers();

  return (
    <div
      className="
        max-w-7xl mx-auto px-4 sm:px-6 py-6
        bg-white dark:bg-black
      "
    >
      <UsersHeader search={search} onSearch={setSearch} />

      {loading && <UsersSkeleton />}

      {error && (
        <div
          className="
            rounded-lg p-4 mt-4
            bg-red-100 dark:bg-red-500/10
            border border-red-200 dark:border-red-500/20
            text-red-700 dark:text-red-400
          "
        >
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div
          className="
            rounded-lg p-4 mt-4
            bg-zinc-100 dark:bg-zinc-900
            border border-zinc-200 dark:border-zinc-800
            text-zinc-700 dark:text-zinc-400
          "
        >
          No matching users found
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <UsersGrid users={users} />
      )}
    </div>
  );
}
