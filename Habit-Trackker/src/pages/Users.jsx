import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import UserCard from "../components/UserCard.jsx";
import { Users } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white flex items-center gap-2">
            <Users className="text-indigo-400" />
            Users
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Discover people building real consistency
          </p>
        </div>

        {!loading && (
          <div className="text-xs text-zinc-500">
            {users.length} {users.length === 1 ? "user" : "users"}
          </div>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <LoadingState />
      ) : users.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
          "
        >
          {users.map((user) => (
            <UserCard
              key={user.username}
              user={user}
             
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =====================
   LOADING STATE
===================== */
function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="
            h-20
            bg-zinc-900
            border border-zinc-800
            rounded-xl
            animate-pulse
          "
        />
      ))}
    </div>
  );
}

/* =====================
   EMPTY STATE
===================== */
function EmptyState() {
  return (
    <div className="mt-20 text-center">
      <div className="text-4xl mb-3">👀</div>
      <p className="text-zinc-300 font-medium">
        No users yet
      </p>
      <p className="text-sm text-zinc-500 mt-1">
        Be the first to build credibility
      </p>
    </div>
  );
}
