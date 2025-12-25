import StreakBadge from "./StreakBadge";

export default function HabitItem({ habit, onComplete, disabled }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-black border border-zinc-700 px-3 py-2">
      <label className="flex items-center gap-3">
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

      <StreakBadge habitId={habit._id} />
    </div>
  );
}
