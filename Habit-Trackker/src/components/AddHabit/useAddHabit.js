import { useState } from "react";
import api from "../../api/axios";

export function useAddHabit({ onAdded, onClose }) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [days, setDays] = useState([]);
  const [intervalDays, setIntervalDays] = useState(1);
  const [durationType, setDurationType] = useState("forever");
  const [durationDays, setDurationDays] = useState(3);
  const [loading, setLoading] = useState(false);

  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const submit = async () => {
    if (!title.trim()) throw new Error("Title required");
    if (frequency === "weekly" && days.length === 0)
      throw new Error("Select at least one day");
    if (frequency === "interval" && intervalDays < 1)
      throw new Error("Interval must be at least 1 day");
    if (durationType === "custom" && durationDays < 1)
      throw new Error("Duration must be at least 1 day");

    setLoading(true);
    try {
      await api.post("/habits", {
        title: title.trim(),
        frequency,
        days: frequency === "weekly" ? days : [],
        intervalDays:
          frequency === "interval" ? intervalDays : undefined,
        durationDays:
          durationType === "custom" ? durationDays : undefined,
      });

      window.dispatchEvent(new Event("habits-updated"));
      onAdded?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      title,
      frequency,
      days,
      intervalDays,
      durationType,
      durationDays,
      loading,
    },
    actions: {
      setTitle,
      setFrequency,
      toggleDay,
      setIntervalDays,
      setDurationType,
      setDurationDays,
      submit,
    },
  };
}
