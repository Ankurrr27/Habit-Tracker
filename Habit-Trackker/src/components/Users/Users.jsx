import UsersHeader from "./UsersHeader";
import UsersSkeleton from "./UsersSkeleton";
import UsersGrid from "./UsersGrid";
import { useUsers } from "./useUsers";

export default function Users() {
  const { users, search, setSearch, loading, error } = useUsers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <UsersHeader search={search} onSearch={setSearch} />

      {loading && <UsersSkeleton />}

      {error && (
        <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          No matching users found
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <UsersGrid users={users} />
      )}
    </div>
  );
}
