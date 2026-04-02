import { useState } from "react";
import api from "../../api/axios";
import { validateHabit } from "./addHabit.utils";

export function useAddHabit({ onAdded, onClose }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("habit");
  const [frequency, setFrequency] = useState("daily");
  const [days, setDays] = useState([]);
  const [intervalDays, setIntervalDays] = useState(1);
  const [durationType, setDurationType] = useState("forever");
  const [durationDays, setDurationDays] = useState(3);
  const [verificationRule, setVerificationRule] = useState("manual");
  const [platformSource, setPlatformSource] = useState("github");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day)
        ? prev.filter((value) => value !== day)
        : [...prev, day]
    );
  };

  const handleSetType = (value) => {
    setType(value);
    if (value !== "hobby" && verificationRule === "platform") {
      setVerificationRule("manual");
    }
  };

  const handleSetVerificationRule = (value) => {
    setVerificationRule(value);
    if (value === "platform") {
      setType("hobby");
    }
  };

  const submit = async () => {
    const validationError = validateHabit({
      title,
      type,
      frequency,
      days,
      intervalDays,
      durationType,
      durationDays,
      verificationRule,
      platformSource,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/habits", {
        title: title.trim(),
        type,
        frequency,
        days: frequency === "weekly" ? days : [],
        intervalDays:
          frequency === "interval" ? intervalDays : undefined,
        durationDays:
          durationType === "custom" ? durationDays : undefined,
        verificationRule,
        platformSource:
          verificationRule === "platform" ? platformSource : undefined,
      });

      window.dispatchEvent(new Event("habits-updated"));
      onAdded?.();
      onClose();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to save this item"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      title,
      type,
      frequency,
      days,
      intervalDays,
      durationType,
      durationDays,
      verificationRule,
      platformSource,
      loading,
      error,
    },
    actions: {
      setTitle,
      setType: handleSetType,
      setFrequency,
      toggleDay,
      setIntervalDays,
      setDurationType,
      setDurationDays,
      setVerificationRule: handleSetVerificationRule,
      setPlatformSource,
      submit,
    },
  };
}
