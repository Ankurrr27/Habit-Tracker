import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";

export function useTodayTasks(enabled = true) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!enabled) { setTasks([]); setLoading(false); return; }
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async () => {
    const title = newTitle.trim();
    if (!title || adding) return;
    setAdding(true);
    try {
      const res = await api.post("/tasks", { title });
      setTasks((prev) => [res.data, ...prev]);
      setNewTitle("");
    } finally {
      setAdding(false);
    }
  };

  const toggleTask = async (id) => {
    // Optimistically update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t
      )
    );
    try {
      const res = await api.patch(`/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch {
      // rollback on error
      setTasks((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t
        )
      );
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await api.delete(`/tasks/${id}`);
    } catch {
      fetchTasks(); // rollback
    }
  };

  return { tasks, loading, newTitle, setNewTitle, addTask, toggleTask, deleteTask, adding };
}
