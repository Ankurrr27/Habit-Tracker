import { useState } from "react";
import { Plus } from "lucide-react";

import { useTeamsDashboard } from "../components/Team/useTeamsDashboard";
import { useCreateTeam } from "../components/Team/useCreateTeam";

import TeamInvitesSection from "../components/Team/TeamInvitesSection";
import MyTeamsSection from "../components/Team/MyTeamsSection";
import CreateTeamForm from "../components/Team/CreateTeamForm";

export default function TeamsPage() {
  const { state, actions } = useTeamsDashboard();
  const { teams, invites, loading } = state;
  const { acceptInvite, rejectInvite } = actions;

  const create = useCreateTeam();

  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-zinc-500">
        Loading teams…
      </div>
    );
  }

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-9xl mx-auto px-6 py-6 space-y-6">
      {/* ===== PAGE SEARCH (TOP, GLOBAL) ===== */}
      <div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teams…"
          className="
            w-full max-w-md
            px-4 py-2.5 text-sm
            rounded-md
            bg-white dark:bg-zinc-950
            border border-zinc-300 dark:border-zinc-700
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400
            focus:outline-none focus:ring-1 focus:ring-indigo-500
          "
        />
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ===== LEFT: TEAMS LIST ===== */}
        <aside className="lg:col-span-1">
          <MyTeamsSection teams={filteredTeams} />
        </aside>

        {/* ===== RIGHT: INVITES + CREATE ===== */}
        <main className="lg:col-span-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* TEAM INVITES */}
            <section
              className="
                min-h-[260px]
                bg-white dark:bg-zinc-950
                border border-zinc-200 dark:border-zinc-800
                rounded-xl
                px-6 py-5
              "
            >
              <TeamInvitesSection
                invites={invites}
                onAccept={acceptInvite}
                onReject={rejectInvite}
              />
            </section>

            {/* CREATE TEAM */}
            <section
              className="
                min-h-[260px]
                bg-white dark:bg-zinc-950
                border border-zinc-200 dark:border-zinc-800
                rounded-xl
                px-6 py-5
                flex flex-col
              "
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Create a team
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Start collaborating with others.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreate((v) => !v)}
                  className="
                    flex items-center gap-2
                    px-3 py-2 rounded-md
                    text-sm font-medium
                    bg-indigo-600 text-white
                    hover:bg-indigo-700
                  "
                >
                  <Plus size={16} />
                  New
                </button>
              </div>

              {showCreate ? (
                <CreateTeamForm
                  state={create.state}
                  actions={create.actions}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
                  Create a new team to get started
                </div>
              )}
            </section>

            {/* RESERVED / FUTURE */}
            <section
              className="
                min-h-[260px]
                bg-zinc-50 dark:bg-zinc-950
                border border-dashed border-zinc-300 dark:border-zinc-800
                rounded-xl
                flex items-center justify-center
                text-sm text-zinc-500 dark:text-zinc-400
              "
            >
              Team workspace overview
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
