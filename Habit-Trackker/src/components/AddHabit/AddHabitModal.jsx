import { useAddHabit } from "./useAddHabit";
import AddHabitForm from "./AddHabitForm";

export default function AddHabitModal({ onClose, onAdded }) {
  const { state, actions } = useAddHabit({ onClose, onAdded });

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
      "
    >
      <div
        className="
          w-[28rem] max-w-[92vw]
          rounded-xl p-6
          bg-white dark:bg-zinc-950
          text-zinc-900 dark:text-zinc-100
          border border-zinc-200 dark:border-zinc-800
          shadow-xl
        "
      >
        <h2 className="text-lg font-semibold mb-1">
          Add Habit
        </h2>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Manual habits and auto-tracked coding hobbies both start here.
        </p>

        <AddHabitForm state={state} actions={actions} />

        <button
          onClick={onClose}
          className="
            mt-4 text-sm
            text-zinc-500 hover:text-zinc-800
            dark:text-zinc-400 dark:hover:text-zinc-200
            transition
          "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
