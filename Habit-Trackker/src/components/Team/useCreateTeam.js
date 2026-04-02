import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export function useCreateTeam() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    if (!name.trim()) {
      setError("Team name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/teams", {
        name: name.trim(),
        description: description.trim(),
      });

      navigate(`/teams/${res.data._id}`);
    } catch (err) {
      console.error("Create team error:", err);
      setError(err.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      name,
      description,
      loading,
      error,
    },
    actions: {
      setName,
      setDescription,
      submit,
    },
  };
}
