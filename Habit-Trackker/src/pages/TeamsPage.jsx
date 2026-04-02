import { useMemo, useState } from "react";
import { Search, Users2, UserPlus, Workflow } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTeamsDashboard } from "../components/Team/useTeamsDashboard";
import { useCreateTeam } from "../components/Team/useCreateTeam";
import TeamInvitesSection from "../components/Team/TeamInvitesSection";
import MyTeamsSection from "../components/Team/MyTeamsSection";
import CreateTeamForm from "../components/Team/CreateTeamForm";

export default function TeamsPage() {
  const navigate = useNavigate();
  const { state, actions } = useTeamsDashboard();
  const { teams, invites, loading } = state;
  const { acceptInvite, rejectInvite } = actions;
  const create = useCreateTeam();

  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const filteredTeams = useMemo(
    () =>
      teams.filter((team) =>
        `${team.name} ${team.description || ""}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query, teams]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-sm text-zinc-500 sm:px-6">
        Loading teams...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm dark:bg-zinc-950">
        <div className="bg-zinc-50/80 px-5 py-6 dark:bg-zinc-900/70 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Team workspace
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                Teams
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Join a team, create a new one, or open an existing workspace without digging
                through cluttered controls.
              </p>
            </div>

            <button
              onClick={() => setShowCreate((value) => !value)}
              className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {showCreate ? "Close form" : "Create team"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:px-6 md:grid-cols-3">
          <TopTile icon={<Users2 size={18} />} label="Teams" value={teams.length} />
          <TopTile icon={<UserPlus size={18} />} label="Invites" value={invites.length} />
          <TopTile icon={<Workflow size={18} />} label="Ready to open" value={filteredTeams.length} />
        </div>

        {showCreate && (
          <div className="px-5 pb-6 sm:px-6">
            <div className="rounded-[1.5rem] bg-zinc-50 p-4 dark:bg-zinc-900">
              <CreateTeamForm state={create.state} actions={create.actions} />
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] bg-white px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            <UserPlus size={18} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Invites</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Review pending invites without leaving the teams area.
            </p>
          </div>
        </div>

        <TeamInvitesSection
          invites={invites}
          onAccept={async (inviteId) => {
            const result = await acceptInvite(inviteId);
            if (result?.teamId) {
              navigate(`/teams/${result.teamId}`);
            }
          }}
          onReject={rejectInvite}
        />
      </section>

      <section className="rounded-[1.75rem] bg-white px-5 py-6 shadow-sm dark:bg-zinc-950 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Your teams</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Open a workspace quickly or filter the list when your teams grow.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search team"
              className="
                w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm
                text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100
              "
            />
          </div>
        </div>

        <div className="mt-5">
          <MyTeamsSection teams={filteredTeams} />
        </div>
      </section>
    </div>
  );
}

function TopTile({ icon, label, value }) {
  return (
    <div className="rounded-3xl bg-white px-4 py-4 shadow-sm dark:bg-zinc-950">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
        {icon}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}
