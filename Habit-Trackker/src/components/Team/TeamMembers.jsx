import { Crown } from "lucide-react";

export default function TeamMembers({ members }) {
  return (
    <section
      className="
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        rounded-2xl
        px-4 py-4
      "
    >
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Members
      </h2>

      <ul className="space-y-2">
        {members.map((member) => {
          const role = member.role;

          return (
            <li
              key={member._id || member.user?._id}
              className="
                flex items-center justify-between gap-3
                rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3
                dark:border-zinc-800 dark:bg-zinc-900
              "
            >
              <div className="min-w-0 flex items-center gap-3">
                {member.user?.avatar ? (
                  <img
                    src={member.user.avatar}
                    alt={member.user?.name || "member"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                    {(member.user?.name || member.user?.username || "?")[0].toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {member.user?.name || "Unknown"}
                    </span>
                    {role === "owner" && (
                      <Crown size={12} className="shrink-0 text-amber-500" />
                    )}
                  </div>
                  <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    @{member.user?.username || "unknown"}
                  </div>
                </div>
              </div>

              <span
                className={`
                  rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wide
                  ${
                    role === "owner"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                      : role === "admin"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }
                `}
              >
                {role}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
