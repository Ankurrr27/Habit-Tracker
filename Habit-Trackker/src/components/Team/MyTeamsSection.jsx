import { Link, useLocation } from "react-router-dom";
import { Crown } from "lucide-react";

export default function MyTeamsSection({ teams }) {
  const location = useLocation();

  return (
    <section
      className="
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        rounded-2xl
        px-4 py-4
      "
    >
      {/* HEADER */}
      <div className="mb-3">
        <h2 className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
          Your teams
        </h2>
      </div>

      {/* EMPTY STATE */}
      {teams.length === 0 ? (
        <div
          className="
            text-sm text-zinc-500 dark:text-zinc-400
            px-3 py-6
            rounded-xl
            bg-zinc-50 dark:bg-zinc-900
            border border-dashed border-zinc-200 dark:border-zinc-800
            text-center
          "
        >
          No teams yet
        </div>
      ) : (
        <ul className="space-y-1.5">
          {teams.map((team) => {
            const isActive =
              location.pathname === `/teams/${team._id}`;
            const isOwner = team.myRole === "owner";

            return (
              <li key={team._id}>
                <Link
                  to={`/teams/${team._id}`}
                  className={`
                    group relative
                    flex items-center justify-between
                    px-3 py-2.5
                    rounded-xl
                    text-sm
                    transition-all
                    ${
                      isActive
                        ? `
                          bg-indigo-50 text-indigo-700
                          dark:bg-emerald-500/10 dark:text-emerald-400
                        `
                        : `
                          text-zinc-700 dark:text-zinc-300
                          hover:bg-zinc-100 dark:hover:bg-zinc-900
                        `
                    }
                  `}
                >
                  {/* LEFT ACCENT */}
                  {isActive && (
                    <span
                      className="
                        absolute left-0 top-1/2 -translate-y-1/2
                        w-1 h-6
                        rounded-r-full
                        bg-indigo-500 dark:bg-emerald-400
                      "
                    />
                  )}

                  {/* TEAM NAME */}
                  <span
                    className={`
                      truncate
                      ${isOwner ? "font-semibold" : "font-medium"}
                    `}
                  >
                    {team.name}
                  </span>

                  {/* OWNER BADGE */}
                  {isOwner && (
                    <span
                      className="
                        ml-2
                        flex items-center gap-1
                        text-[10px]
                        text-amber-600 dark:text-amber-400
                        bg-amber-100 dark:bg-amber-500/10
                        px-2 py-0.5
                        rounded-full
                        shrink-0
                      "
                      title="You own this team"
                    >
                      <Crown size={12} />
                      Owner
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
