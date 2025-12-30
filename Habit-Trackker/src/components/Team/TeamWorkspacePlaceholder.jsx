import { Plus } from "lucide-react";

export default function TeamWorkspacePlaceholder({ onStartProject }) {
  return (
    <section
      className="
        min-h-[240px]
        flex flex-col items-center justify-center
        text-center

        bg-zinc-50 dark:bg-zinc-950
        border border-dashed border-zinc-300 dark:border-zinc-800
        rounded-lg
        px-6 py-10
      "
    >
      <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
        No projects yet
      </h2>

      <button
        onClick={onStartProject}
        className="
          mt-4
          inline-flex items-center gap-2
          px-4 py-2 rounded-md
          bg-indigo-600 text-white
          hover:bg-indigo-700
          text-sm
        "
      >
        <Plus size={16} />
        Create project
      </button>
    </section>
  );
}
