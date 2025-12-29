import { useAddHabit } from "./useAddHabit";
import AddHabitForm from "./AddHabitForm";

export default function AddHabitModal({ onClose, onAdded }) {
  const { state, actions } = useAddHabit({ onClose, onAdded });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl w-96 text-white">
        <h2 className="text-lg font-semibold mb-4">Add Habit</h2>
        <AddHabitForm state={state} actions={actions} />
        <button
          onClick={onClose}
          className="mt-4 text-zinc-400 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
