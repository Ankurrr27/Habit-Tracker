import { useState, useEffect } from "react";
import { Check, Clock, Plus, Trash2 } from "lucide-react";
import api from "../../api/axios";

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await api.post("/tasks", { title: newTask.trim() });
      setTasks([res.data, ...tasks]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/tasks/${id}/toggle`);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          Daily Goals
        </h3>
        <span className="text-[10px] font-bold text-zinc-400/80">
          {tasks.filter(t => t.status === "done").length}/{tasks.length}
        </span>
      </div>
      
      <form onSubmit={handleAdd} className="group flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl px-4 py-1.5 focus-within:border-indigo-500/30 focus-within:bg-zinc-50 dark:focus-within:bg-zinc-900/50 transition-all duration-300">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New goal..."
          className="w-full bg-transparent py-2 text-sm outline-none text-zinc-600 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />
        <button
          type="submit"
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all duration-200"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </form>

      {loading ? (
        <div className="animate-pulse h-20 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
      ) : tasks.length === 0 ? (
        <p className="text-sm text-zinc-500">No active goals. Add one above!</p>
      ) : (
        <div className="flex flex-col gap-2">
          {[...tasks].sort((a, b) => (a.status === "done" ? 1 : b.status === "done" ? -1 : 0)).map((task) => (
            <div
              key={task._id}
              className={`group flex items-center gap-3 px-3 py-3 rounded-2xl border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all duration-200 ${
                task.status === "done" ? "opacity-60" : ""
              }`}
            >
              <button
                onClick={() => handleToggle(task._id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                  task.status === "done"
                    ? "border-emerald-500 bg-emerald-500 text-white scale-95"
                    : "border-zinc-300 dark:border-zinc-700 group-hover:border-indigo-500/50"
                }`}
              >
                <Check size={12} strokeWidth={3} className={task.status === "done" ? "block scale-110" : "hidden"} />
              </button>
              
              <div className="flex-1 min-w-0">
                <p
                  className={`truncate text-sm font-medium ${
                    task.status === "done"
                      ? "text-zinc-400 line-through"
                      : "text-zinc-700 dark:text-zinc-200"
                  }`}
                >
                  {task.title}
                </p>
              </div>

              <div className="flex items-center gap-1 transition">
                <button
                  onClick={() => handleDelete(task._id)}
                  className="lg:opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 transition rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
