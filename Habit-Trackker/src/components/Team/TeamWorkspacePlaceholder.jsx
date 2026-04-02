import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function TeamWorkspacePlaceholder() {
  return (
    <section
      className="
        min-h-[280px]
        flex flex-col items-start justify-between
        bg-zinc-50 dark:bg-zinc-950
        border border-dashed border-zinc-300 dark:border-zinc-800
        rounded-2xl
        px-6 py-6
      "
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
          <Sparkles size={13} />
          Workspace preview
        </div>
        <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Team space is ready for the next layer
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          You can already invite people, share meeting links, and organize ownership.
          Projects are still lightweight here, so use this space as a coordination hub
          while the deeper project workflow catches up.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/projects"
          className="
            inline-flex items-center gap-2 rounded-xl
            bg-indigo-600 px-4 py-2 text-sm font-medium text-white
            hover:bg-indigo-700
          "
        >
          <Plus size={15} />
          Open projects
        </Link>
        <Link
          to="/dashboard"
          className="
            inline-flex items-center gap-2 rounded-xl
            border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700
            hover:bg-white dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900
          "
        >
          Back to dashboard
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
