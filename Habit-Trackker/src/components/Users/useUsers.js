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
        const usersRes = await api.get("/users");
        setUsers(usersRes.data);
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
    const query = search.toLowerCase().trim();
    if (!query) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
    );
  }, [users, search]);

  const toggleFollow = async (username) => {
    try {
      const res = await api.post(`/users/${username}/follow`);
      const { isFollowing } = res.data;
      
      setUsers((prev) =>
        prev.map((user) =>
          user.username === username
            ? { ...user, isFollowing }
            : user
        )
      );
    } catch (err) {
      console.error("Toggle follow failed", err);
    }
  };

  return {
    users: filteredUsers,
    search,
    setSearch,
    loading,
    error,
    toggleFollow,
  };
}

