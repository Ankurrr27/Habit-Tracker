import { Link, useLocation } from "react-router-dom";
import { Crown, Plus } from "lucide-react";

export default function MyTeamsSection({ teams }) {
  const location = useLocation();

  return (
    <section
      className="
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        rounded-xl
        px-4 py-4
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-600 dark:text-zinc-400 uppercase">
          Teams
        </h2>

        
      </div>

      {/* EMPTY STATE */}
      {teams.length === 0 ? (
        <div
          className="
            text-sm text-zinc-500 dark:text-zinc-400
            px-3 py-4
            rounded-lg
            bg-zinc-50 dark:bg-zinc-900
            border border-dashed border-zinc-200 dark:border-zinc-800
          "
        >
          You’re not part of any team yet
        </div>
      ) : (
        <ul className="space-y-2">
          {teams.map((team) => {
            const isActive = location.pathname === `/teams/${team._id}`;
            const isOwner = team.myRole === "owner";

            return (
              <li key={team._id}>
                <Link
                  to={`/teams/${team._id}`}
                  className={`
                    group relative
                    flex items-center justify-between
                    px-3 py-2.5
                    rounded-lg
                    text-sm font-medium
                    transition
                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }
                  `}
                >
                  {/* ACTIVE INDICATOR */}
                  {isActive && (
                    <span
                      className="
                        absolute left-0 top-1/2 -translate-y-1/2
                        w-1.5 h-6
                        rounded-r
                        bg-indigo-500
                      "
                    />
                  )}

                  {/* NAME */}
                  <span
                    className={`
                      truncate
                      ${isOwner ? "font-semibold" : ""}
                    `}
                  >
                    {team.name}
                  </span>

                  {/* OWNER ICON */}
                  {isOwner && (
                    <Crown
                      size={14}
                      className="
                        text-amber-500
                        opacity-80 group-hover:opacity-100
                        shrink-0
                      "
                      title="You own this team"
                    />
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
