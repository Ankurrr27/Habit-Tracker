import { useAddHabit } from "./useAddHabit";
import AddHabitForm from "./AddHabitForm";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AddHabitModal({ onClose, onAdded }) {
  const { state, actions } = useAddHabit({ onClose, onAdded });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* BACKGROUND OVERLAY */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md"
      />

      {/* MODAL CONTAINER */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="
          relative w-full max-w-lg
          bg-white/90 dark:bg-zinc-950/90
          backdrop-blur-2xl
          rounded-[2.5rem] p-8 md:p-10
          border border-white/20 dark:border-zinc-800/50
          shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)]
          overflow-hidden
        "
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-400"
        >
          <X size={20} />
        </button>

        <header className="mb-8">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-zinc-900 dark:text-zinc-100 mb-1">
            Add Habit
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-500/80">
            Design your new routine
          </p>
        </header>

        <AddHabitForm state={state} actions={actions} />
      </Motion.div>
    </div>
  );
}
