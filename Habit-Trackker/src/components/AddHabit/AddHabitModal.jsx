import { useAddHabit } from "./useAddHabit";
import AddHabitForm from "./AddHabitForm";

export default function AddHabitModal({ onClose, onAdded }) {
  const { state, actions } = useAddHabit({ onClose, onAdded });

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 dark:bg-black/70
        transition-colors
      "
    >
      <div
        className="
          w-96 max-w-[90vw]
          rounded-xl p-6
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-700
          text-zinc-900 dark:text-white
          shadow-xl
        "
      >
        <h2 className="text-lg font-semibold mb-4">
          Add Habit
        </h2>

        <AddHabitForm state={state} actions={actions} />

        <button
          onClick={onClose}
          className="
            mt-4 text-sm
            text-zinc-600 hover:text-zinc-900
            dark:text-zinc-400 dark:hover:text-white
          "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
