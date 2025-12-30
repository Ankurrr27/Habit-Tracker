import { Crown } from "lucide-react";

export default function TeamMembers({ members }) {
  return (
    <section
      className="
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        rounded-md
        px-3 py-3
      "
    >
      <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
        Members
      </h2>

      <ul className="space-y-1.5">
        {members.map((m) => {
          const role = m.role;

          return (
            <li
              key={m._id || m.user?._id}
              className="
                flex items-center justify-between
                px-2 py-1.5 rounded
                hover:bg-zinc-100 dark:hover:bg-zinc-900
              "
            >
              {/* LEFT: NAME */}
              <div className="min-w-0 flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {m.user?.name || "Unknown"}
                </span>

                {/* OWNER CROWN */}
                {role === "owner" && (
                  <Crown
                    size={12}
                    className="text-amber-500 shrink-0"
                  />
                )}
              </div>

              {/* RIGHT: ROLE */}
              <span
                className={`
                  text-[10px] uppercase tracking-wide shrink-0
                  ${
                    role === "owner"
                      ? "text-amber-600"
                      : role === "admin"
                      ? "text-indigo-600"
                      : "text-zinc-400"
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
