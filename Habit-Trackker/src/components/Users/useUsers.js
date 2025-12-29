import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

export function useUsers() {
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
        console.error("Fetch users error:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;

    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return {
    users: filteredUsers,
    search,
    setSearch,
    loading,
    error,
  };
}
