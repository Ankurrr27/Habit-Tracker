import { Check, X } from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function TaskItem({ task, onToggle, onDelete }) {
  const isDone = task.status === "done";

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="
        group
        flex items-center justify-between
        px-3 py-2.5
        rounded-2xl
        border border-transparent
        hover:border-amber-100 dark:hover:border-amber-500/20
        hover:bg-amber-50/50 dark:hover:bg-amber-500/5
        transition-all duration-300
      "
    >
      {/* LEFT: checkbox + title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Amber checkbox */}
        <button
          onClick={() => onToggle(task._id)}
          aria-label={isDone ? "Mark incomplete" : "Mark complete"}
          className={`
            w-5 h-5 rounded-md border flex items-center justify-center shrink-0
            transition focus:outline-none focus:ring-2 focus:ring-amber-400/50
            ${isDone
              ? "bg-amber-500 border-amber-400"
              : "border-amber-400 dark:border-amber-600 group-hover:border-amber-500"
            }
          `}
        >
          {isDone && <Check size={12} className="text-white" />}
        </button>

        {/* Title */}
        <span
          className={`
            text-sm truncate transition-colors
            ${isDone
              ? "line-through text-zinc-400 dark:text-zinc-600"
              : "text-zinc-800 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400"
            }
          `}
          title={task.title}
        >
          {task.title}
        </span>
      </div>

      {/* RIGHT: rollover hint + delete */}
      <div className="flex items-center gap-2 ml-3 shrink-0">
        {!isDone && (
          <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400/70 hidden group-hover:block">
            rolls over
          </span>
        )}
        <button
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
          className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition focus:opacity-100"
        >
          <X size={14} />
        </button>
      </div>
    </Motion.div>
  );
}
