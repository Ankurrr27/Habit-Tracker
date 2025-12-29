import { Trash2, Check } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="
        group
        flex items-center justify-between
        rounded-lg
        bg-zinc-950
        border border-zinc-800
        px-3 py-2.5
        transition
        hover:border-zinc-700
      "
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
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            ${
              habit.done
                ? "bg-emerald-500 border-emerald-400"
                : "border-zinc-600 group-hover:border-indigo-500"
            }
            ${!canToggle ? "opacity-40 cursor-not-allowed" : ""}
          `}
        >
          {habit.done && (
            <Check size={12} className="text-black" />
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
                : "text-zinc-100 group-hover:text-white"
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
              text-zinc-500 hover:text-red-400
              transition
              focus:opacity-100
            "
            title="Delete habit"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
