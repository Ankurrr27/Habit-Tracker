import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTeamPage } from "../components/Team/useTeam";

import TeamHeader from "../components/Team/TeamHeader";
import TeamInviteCard from "../components/Team/TeamInviteCard";
import TeamMembers from "../components/Team/TeamMembers";
import TeamWorkspacePlaceholder from "../components/Team/TeamWorkspacePlaceholder";
import TeamManageToggle from "../components/Team/TeamManageToggle";

export default function TeamPage() {
  const { teamId } = useParams();
  const { state, actions } = useTeamPage(teamId);

  const { team, invite, loading, msg } = state;
  const { setInvite, sendInvite } = actions;

  const [inviteOpen, setInviteOpen] = useState(false);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-zinc-500">
        Loading team…
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-red-500">
        Team not found
      </div>
    );
  }

  const canManage = ["owner", "admin"].includes(team.myRole);

  return (
    <div className="max-w-9xl mx-auto px-6">
      {/* HEADER */}
      <div className="relative mt-4 mb-6">
        <TeamHeader
          name={team.name}
          membersCount={team.members.length}
        />

        {canManage && (
          <div className="absolute top-4 right-4">
            <TeamManageToggle
              canInvite
              onInviteOpen={() => {
                setInvite("");
                setInviteOpen(true);
              }}
              onLeave={() => console.log("Leave team")}
              onDelete={
                team.myRole === "owner"
                  ? () => console.log("Delete team")
                  : null
              }
            />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-10">
        <aside className="lg:col-span-1">
          <TeamMembers members={team.members} />
        </aside>

        <main className="lg:col-span-3 space-y-6">
          {inviteOpen && (
            <TeamInviteCard
              invite={invite}
              setInvite={setInvite}
              msg={msg}
              sendInvite={async () => {
                await sendInvite();

                // ✅ close AFTER user sees message
                setTimeout(() => {
                  setInviteOpen(false);
                }, 1200);
              }}
            />
          )}

          <TeamWorkspacePlaceholder />
        </main>
      </div>
    </div>
  );
}
