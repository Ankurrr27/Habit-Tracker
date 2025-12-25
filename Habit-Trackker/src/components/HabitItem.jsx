import { Trash2 } from "lucide-react";
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

    // ❌ cancel or wrong input
    if (!confirmation || confirmation.trim() !== habit.title) {
      alert("Habit name did not match. Deletion cancelled.");
      return;
    }

    // ✅ confirmed
    onDelete(habit._id);
  };

  return (
    <div className="flex items-center justify-between rounded-md bg-black border border-zinc-700 px-3 py-2">
      {/* LEFT: CHECK + TITLE */}
      <label className="flex items-center gap-3 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={habit.done}
          disabled={disabled || habit.done}
          onChange={() => onComplete(habit._id)}
          className="accent-indigo-500 disabled:opacity-40"
        />

        <span
          className={`text-sm truncate ${
            habit.done
              ? "line-through text-zinc-500"
              : "text-white"
          }`}
        >
          {habit.title}
        </span>
      </label>

      {/* RIGHT: STREAK + DELETE */}
      <div className="flex items-center gap-2 ml-2">
        <StreakBadge habitId={habit._id} />

        {onDelete && (
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 transition"
            title="Delete habit"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
