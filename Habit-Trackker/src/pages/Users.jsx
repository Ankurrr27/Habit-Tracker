import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import UserCard from "../components/UserCard";
import { Search } from "lucide-react";

function UsersSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-xl bg-zinc-900 animate-pulse border border-zinc-800"
        />
      ))}
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Fetch users error:", err.response || err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔥 REAL-TIME FILTER (no re-fetch)
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;

    return users.filter((u) =>
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Community Members
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Discover and connect with people on the platform
          </p>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-zinc-900
              border border-zinc-800
              rounded-lg
              pl-9 pr-3 py-2
              text-sm text-white
              placeholder-zinc-500
              focus:outline-none
              focus:border-indigo-500/50
            "
          />
        </div>
      </div>

      {/* STATES */}
      {loading && <UsersSkeleton />}

      {error && (
        <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          {error}
        </div>
      )}

      {!loading && !error && filteredUsers.length === 0 && (
        <div className="text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          No matching users found
        </div>
      )}

      {!loading && !error && filteredUsers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user, index) => (
            <UserCard
              key={`${user.username}-${index}`}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
