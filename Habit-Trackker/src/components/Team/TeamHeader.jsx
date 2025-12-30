import { Users } from "lucide-react";

export default function TeamHeader({ name, membersCount }) {
  return (
    <section
      className="
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        rounded-lg
        px-6 py-5
      "
    >
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {name}
      </h1>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
        Shared workspace for habits and projects
      </p>

      <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Users size={14} />
        <span>{membersCount} members</span>
      </div>
    </section>
  );
}
