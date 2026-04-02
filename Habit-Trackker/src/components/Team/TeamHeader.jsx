import { Users, Link2 } from "lucide-react";

export default function TeamHeader({
  name,
  description,
  membersCount,
  myRole,
  meetingLink,
}) {
  return (
    <section
      className="
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        rounded-2xl
        px-6 py-6
      "
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            {myRole}
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            {name}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {description || "Shared workspace for habits, planning, and accountability."}
          </p>
        </div>

        {meetingLink && (
          <a
            href={meetingLink}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center gap-2 rounded-xl
              border border-zinc-200 px-4 py-2 text-sm font-medium
              text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900
            "
          >
            <Link2 size={15} />
            Open meeting link
          </a>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Users size={15} />
        <span>{membersCount} members in this workspace</span>
      </div>
    </section>
  );
}
