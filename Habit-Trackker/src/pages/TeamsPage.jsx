import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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
        `${team.name} ${team.description || ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, teams]
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-sm text-zinc-500">
        Loading teams...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Teams
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Join a team, create a team, or open one you already have.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => setShowCreate((value) => !value)}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {showCreate ? "Cancel" : "Create team"}
          </button>
          <span className="self-center text-sm text-zinc-500 dark:text-zinc-400">
            {teams.length} teams • {invites.length} invites
          </span>
        </div>

        {showCreate && (
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <CreateTeamForm state={create.state} actions={create.actions} />
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
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

      <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative mb-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search team"
            className="
              w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm
              text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500
              dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100
            "
          />
        </div>

        <MyTeamsSection teams={filteredTeams} />
      </section>
    </div>
  );
}
