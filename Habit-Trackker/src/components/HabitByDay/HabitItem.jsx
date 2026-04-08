import { Trash2, Check } from "lucide-react";
import { motion as Motion } from "framer-motion";
import StreakBadge from "./StreakBadge";

export default function HabitItem({
  habit,
  onComplete,
  onDelete,
  disabled,
}) {
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
