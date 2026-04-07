import { Trash2, Check } from "lucide-react";
import { motion as Motion } from "framer-motion";
import StreakBadge from "./StreakBadge";
import { useAuth } from "../../context/useAuth";

export default function HabitItem({
  habit,
  onComplete,
  onDelete,
  disabled,
}) {
  const { user } = useAuth();
  const accentColor = user?.accentColor || "indigo";

  const accentMap = {
    indigo: {
      border: "hover:border-indigo-100 dark:hover:border-indigo-500/20",
      bg: "hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5",
      check: "bg-indigo-500 border-indigo-400 focus:ring-indigo-500/50 group-hover:border-indigo-500",
      text: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
    },
    pink: {
      border: "hover:border-pink-100 dark:hover:border-pink-500/20",
      bg: "hover:bg-pink-50/50 dark:hover:bg-pink-500/5",
      check: "bg-pink-500 border-pink-400 focus:ring-pink-500/50 group-hover:border-pink-500",
      text: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
    },
    rose: {
      border: "hover:border-rose-100 dark:hover:border-rose-500/20",
      bg: "hover:bg-rose-50/50 dark:hover:bg-rose-500/5",
      check: "bg-rose-500 border-rose-400 focus:ring-rose-500/50 group-hover:border-rose-500",
      text: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
    },
    sky: {
      border: "hover:border-sky-100 dark:hover:border-sky-500/20",
      bg: "hover:bg-sky-50/50 dark:hover:bg-sky-500/5",
      check: "bg-sky-500 border-sky-400 focus:ring-sky-500/50 group-hover:border-sky-500",
      text: "group-hover:text-sky-600 dark:group-hover:text-sky-400",
    },
    emerald: {
      border: "hover:border-emerald-100 dark:hover:border-emerald-500/20",
      bg: "hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5",
      check: "bg-emerald-500 border-emerald-400 focus:ring-emerald-500/50 group-hover:border-emerald-500",
      text: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    },
    cyan: {
      border: "hover:border-cyan-100 dark:hover:border-cyan-500/20",
      bg: "hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5",
      check: "bg-cyan-500 border-cyan-400 focus:ring-cyan-500/50 group-hover:border-cyan-500",
      text: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
    },
    orange: {
      border: "hover:border-orange-100 dark:hover:border-orange-500/20",
      bg: "hover:bg-orange-50/50 dark:hover:bg-orange-500/5",
      check: "bg-orange-500 border-orange-400 focus:ring-orange-500/50 group-hover:border-orange-500",
      text: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    },
    violet: {
      border: "hover:border-violet-100 dark:hover:border-violet-500/20",
      bg: "hover:bg-violet-50/50 dark:hover:bg-violet-500/5",
      check: "bg-violet-500 border-violet-400 focus:ring-violet-500/50 group-hover:border-violet-500",
      text: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
    },
  };

  const theme = accentMap[accentColor] || accentMap.indigo;

  const handleDelete = () => {
    const confirmation = window.prompt(
      `Type the habit name to delete:\n\n"${habit.title}"`
    );

    if (!confirmation || confirmation.trim() !== habit.title) {
      alert("Habit name did not match. Deletion cancelled.");
      return;
    }

    onDelete(habit._id);
  };

  const canToggle = !disabled && !habit.done;

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`
        group
        flex items-center justify-between
        px-3 py-2.5
        rounded-2xl
        border border-transparent
        hover:border-[rgba(var(--primary),0.2)]
        hover:bg-[rgba(var(--primary),0.05)]
        transition-all duration-300
      `}
    >
      {/* LEFT: STATUS + TITLE */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* STATUS TOGGLE */}
        <button
          onClick={() => canToggle && onComplete(habit._id)}
          disabled={!canToggle}
          aria-label={
            habit.done ? "Habit completed" : "Mark habit as completed"
          }
          className={`
            w-5 h-5 rounded-md border
            flex items-center justify-center
            transition
            focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary),0.4)]
            ${
              habit.done
                ? "bg-[rgb(var(--primary))] border-[rgba(var(--primary),0.8)]"
                : "border-zinc-400 dark:border-zinc-600 group-hover:border-[rgb(var(--primary))]"
            }
            ${!canToggle ? "opacity-40 cursor-not-allowed" : ""}
          `}
        >
          {habit.done && (
            <Check size={12} className="text-white" />
          )}
        </button>

        {/* TITLE */}
        <span
          className={`
            text-sm truncate
            transition-colors
            ${
              habit.done
                ? "line-through text-zinc-500"
                : "text-zinc-800 dark:text-zinc-100 group-hover:text-[rgb(var(--primary))]"
            }
          `}
          title={habit.title}
        >
          {habit.title}
        </span>
      </div>

      {/* RIGHT: STREAK + DELETE */}
      <div className="flex items-center gap-2 ml-3">
        <StreakBadge habitId={habit._id} />

        {onDelete && (
          <button
            onClick={handleDelete}
            aria-label="Delete habit"
            className="
              opacity-0 group-hover:opacity-100
              text-zinc-500 hover:text-red-500
              transition
              focus:opacity-100
            "
            title="Delete habit"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </Motion.div>
  );
}
