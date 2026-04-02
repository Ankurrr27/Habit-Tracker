import { useEffect, useState } from "react";
import api from "../../api/axios";

export function useTeamPage(teamId) {
  const [team, setTeam] = useState(null);
  const [invite, setInvite] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let isCancelled = false;

    api
      .get(`/teams/${teamId}`)
      .then((res) => {
        if (!isCancelled) {
          setTeam(res.data);
          setMeetingLink(res.data.meetingLink || "");
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setMsg("Failed to load team");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
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
    } catch (error) {
      setMsg(error.response?.data?.message || "Invite failed");
    }
  };

  const saveMeetingLink = async () => {
    try {
      setSaving(true);
      const res = await api.put(`/teams/${teamId}/meeting`, {
        meetingLink,
      });
      setTeam((prev) =>
        prev ? { ...prev, meetingLink: res.data.meetingLink } : prev
      );
      setMsg("Meeting link saved");
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to save meeting link");
    } finally {
      setSaving(false);
    }
  };

  const leaveTeam = async () => {
    await api.post(`/teams/${teamId}/leave`);
  };

  const deleteTeam = async () => {
    await api.delete(`/teams/${teamId}`);
  };

  return {
    state: {
      team,
      invite,
      meetingLink,
      loading,
      saving,
      msg,
    },
    actions: {
      setInvite,
      setMeetingLink,
      sendInvite,
      saveMeetingLink,
      leaveTeam,
      deleteTeam,
    },
  };
}
