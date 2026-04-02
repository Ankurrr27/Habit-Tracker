import { useEffect, useState } from "react";
import api from "../../api/axios";

export function useTeamsDashboard() {
  const [teams, setTeams] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/teams/my"), api.get("/team-invites/my")])
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
    const res = await api.post(`/team-invites/${inviteId}/accept`);
    setInvites((prev) => prev.filter((invite) => invite._id !== inviteId));
    return res.data;
  };

  const rejectInvite = async (inviteId) => {
    await api.post(`/team-invites/${inviteId}/reject`);
    setInvites((prev) => prev.filter((invite) => invite._id !== inviteId));
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
