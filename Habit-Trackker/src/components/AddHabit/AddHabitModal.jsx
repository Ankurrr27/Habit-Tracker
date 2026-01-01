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
        transition-colors
      "
    >
      <div
        className="
          w-96 max-w-[90vw]
          rounded-xl p-6
          bg-bg text-text
          border border-black/10
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
            opacity-70 hover:opacity-100
            transition
          "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
