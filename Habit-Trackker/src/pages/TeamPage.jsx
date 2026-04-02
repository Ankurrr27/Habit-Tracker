import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarRange, Link2, LogOut, Trash2, UserPlus, Users2 } from "lucide-react";
import { useTeamPage } from "../components/Team/useTeam";
import TeamInviteCard from "../components/Team/TeamInviteCard";
import TeamMembers from "../components/Team/TeamMembers";

export default function TeamPage() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const { state, actions } = useTeamPage(teamId);
  const { team, invite, meetingLink, loading, saving, msg } = state;
  const {
    setInvite,
    setMeetingLink,
    sendInvite,
    saveMeetingLink,
    leaveTeam,
    deleteTeam,
  } = actions;

  const [showInvite, setShowInvite] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 text-sm text-zinc-500">
        Loading team...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 text-sm text-red-500">
        Team not found
      </div>
    );
  }

  const canManage = ["owner", "admin"].includes(team.myRole);
  const isOwner = team.myRole === "owner";

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <Link
        to="/teams"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        Back to teams
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 bg-zinc-50/80 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Team workspace
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                {team.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {team.description ||
                  "Use this space to invite members, share one meeting link, and keep everyone working from the same page."}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              {team.members.length} members · Your role: {team.myRole}
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-3">
          <SummaryTile
            icon={<Users2 size={18} />}
            title="People"
            value={`${team.members.length} teammates`}
            description="Everyone in the team is listed below."
          />
          <SummaryTile
            icon={<CalendarRange size={18} />}
            title="Shared rhythm"
            value={canManage ? "Invite and coordinate" : "Follow team updates"}
            description="Keep planning simple and visible."
          />
          <SummaryTile
            icon={<Link2 size={18} />}
            title="Meeting link"
            value={team.meetingLink ? "Saved" : "Not set"}
            description="One shared place for calls or quick check-ins."
          />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-3">
            {canManage && (
              <button
                onClick={() => setShowInvite((value) => !value)}
                className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                {showInvite ? "Hide invite form" : "Invite teammate"}
              </button>
            )}

            <Link
              to="/projects"
              className="rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Open projects
            </Link>

            {isOwner ? (
              <button
                onClick={async () => {
                  if (!window.confirm("Delete this team permanently?")) return;
                  await deleteTeam();
                  navigate("/teams");
                }}
                className="rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <Trash2 size={15} className="mr-2 inline" />
                Delete team
              </button>
            ) : (
              <button
                onClick={async () => {
                  if (!window.confirm("Leave this team?")) return;
                  await leaveTeam();
                  navigate("/teams");
                }}
                className="rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                <LogOut size={15} className="mr-2 inline" />
                Leave team
              </button>
            )}
          </div>
        </div>
      </section>

      {msg && (
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          {msg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[1.75rem] border border-zinc-200 bg-white px-6 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Link2 size={18} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Meeting link
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Save one shared link so nobody has to ask where the meeting is.
              </p>
            </div>
          </div>

          {canManage ? (
            <>
              <input
                value={meetingLink}
                onChange={(event) => setMeetingLink(event.target.value)}
                placeholder="https://meet.google.com/..."
                className="
                  mt-4 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm
                  text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500
                  dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
                "
              />

              <button
                onClick={saveMeetingLink}
                disabled={saving}
                className="mt-3 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save meeting link"}
              </button>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              {team.meetingLink ? (
                <a
                  href={team.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Open team meeting link
                </a>
              ) : (
                "The team owner has not added a meeting link yet."
              )}
            </div>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-zinc-200 bg-white px-6 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <UserPlus size={18} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Invite teammates
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Keep invites simple so people can join without confusion.
              </p>
            </div>
          </div>

          {showInvite && canManage ? (
            <div className="mt-4">
              <TeamInviteCard
                invite={invite}
                setInvite={setInvite}
                msg={msg}
                sendInvite={sendInvite}
              />
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              {canManage
                ? "Use the invite teammate button above when you want to add someone."
                : "Only team owners and admins can send invites."}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-[1.75rem] border border-zinc-200 bg-white px-6 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <Users2 size={18} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Team members
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Everyone currently inside this workspace.
            </p>
          </div>
        </div>

        <TeamMembers members={team.members} />
      </section>
    </div>
  );
}

function SummaryTile({ icon, title, value, description }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
        {icon}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        {title}
      </p>
      <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}
