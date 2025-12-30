import { useEffect, useState } from "react";
import api from "../../api/axios";

export function useTeamsDashboard() {
  const [teams, setTeams] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  Promise.all([
    api.get("/teams/my"),          // ✅ my teams
    api.get("/team-invites/my"),   // ✅ my invites
  ])
    .then(([teamsRes, invitesRes]) => {
      setTeams(teamsRes.data || []);
      setInvites(invitesRes.data || []);
    })
    .catch((err) => {
      console.error("Teams dashboard error:", err);
    })
    .finally(() => setLoading(false));
}, []);


const acceptInvite = async (inviteId) => {
  await api.post(`/team-invites/${inviteId}/accept`);
  setInvites((prev) => prev.filter((i) => i._id !== inviteId));
};

const rejectInvite = async (inviteId) => {
  await api.post(`/team-invites/${inviteId}/reject`);
  setInvites((prev) => prev.filter((i) => i._id !== inviteId));
};


  return {
    state: {
      teams,
      invites,
      loading,
    },
    actions: {
      acceptInvite,
      rejectInvite,
    },
  };
}
