import { useEffect, useState } from "react";
import api from "../../api/axios";

export function useTeamPage(teamId) {
  const [team, setTeam] = useState(null);
  const [invite, setInvite] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setLoading(true);

    api
      .get(`/teams/${teamId}`)
      .then((res) => setTeam(res.data))
      .catch(() => setMsg("Failed to load team"))
      .finally(() => setLoading(false));
  }, [teamId]);

  const sendInvite = async () => {
    if (!invite.trim()) return;

    try {
      await api.post("/team-invites/user", {
        teamId,
        identifier: invite,
      });
      setMsg("Invite sent");
      setInvite("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Invite failed");
    }
  };

  return {
    state: {
      team,
      invite,
      loading,
      msg,
    },
    actions: {
      setInvite,
      sendInvite,
    },
  };
}
