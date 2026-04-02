import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [usersRes, requestsRes] = await Promise.all([
          api.get("/users"),
          api.get("/users/friend-requests"),
        ]);

        setUsers(usersRes.data);
        setRequests(requestsRes.data);
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

  const sendFriendRequest = async (userId) => {
    await api.post("/users/friend-requests", { userId });
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? { ...user, friendshipStatus: "request_sent" }
          : user
      )
    );
  };

  const acceptRequest = async (requestId, senderId) => {
    await api.post(`/users/friend-requests/${requestId}/accept`);
    setRequests((prev) => prev.filter((request) => request._id !== requestId));
    setUsers((prev) =>
      prev.map((user) =>
        user._id === senderId
          ? { ...user, friendshipStatus: "friends" }
          : user
      )
    );
  };

  const rejectRequest = async (requestId, senderId) => {
    await api.post(`/users/friend-requests/${requestId}/reject`);
    setRequests((prev) => prev.filter((request) => request._id !== requestId));
    setUsers((prev) =>
      prev.map((user) =>
        user._id === senderId ? { ...user, friendshipStatus: "none" } : user
      )
    );
  };

  return {
    users: filteredUsers,
    requests,
    search,
    setSearch,
    loading,
    error,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
  };
}
