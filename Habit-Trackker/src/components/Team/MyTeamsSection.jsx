import { Link, useLocation } from "react-router-dom";
import { Crown, Users } from "lucide-react";

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
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Your teams
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Open a workspace, review role access, and jump back into collaboration.
        </p>
      </div>

      {teams.length === 0 ? (
        <div
          className="
            text-sm text-zinc-500 dark:text-zinc-400
            px-3 py-8
            rounded-xl
            bg-zinc-50 dark:bg-zinc-900
            border border-dashed border-zinc-200 dark:border-zinc-800
            text-center
          "
        >
          No teams yet. Create one to invite people and coordinate habits together.
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
                    block rounded-2xl border px-4 py-3 transition
                    ${
                      isActive
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700"
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{team.name}</div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {team.description || "No description yet."}
                      </div>
                    </div>

                    {isOwner && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                        <Crown size={11} />
                        Owner
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <Users size={13} />
                    <span>{team.membersCount || 0} members</span>
                    <span className="rounded-full bg-zinc-200 px-2 py-0.5 dark:bg-zinc-800">
                      {team.myRole}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
