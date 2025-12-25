// components/AddHabitModal.jsx
import { useState } from "react";
import api from "../api/axios";
import { DAYS } from "../constants/days";

export default function AddHabitModal({ onClose, onAdded }) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [days, setDays] = useState([]);
  const [intervalDays, setIntervalDays] = useState(1);

  // 🔥 NEW
  const [durationType, setDurationType] = useState("forever"); // forever | custom
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
    if (!title.trim()) {
      alert("Title required");
      return;
    }

    if (frequency === "weekly" && days.length === 0) {
      alert("Select at least one day");
      return;
    }

    if (frequency === "interval" && intervalDays < 1) {
      alert("Interval must be at least 1 day");
      return;
    }

    if (durationType === "custom" && durationDays < 1) {
      alert("Duration must be at least 1 day");
      return;
    }

    try {
      setLoading(true);

      await api.post("/habits", {
        title: title.trim(),
        frequency,
        days: frequency === "weekly" ? days : [],
        intervalDays: frequency === "interval" ? intervalDays : undefined,
        durationDays: durationType === "custom" ? durationDays : undefined,
      });

      // reset
      setTitle("");
      setFrequency("daily");
      setDays([]);
      setIntervalDays(1);
      setDurationType("forever");
      setDurationDays(3);

      onAdded?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl w-96 text-white shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Add Habit</h2>

        {/* TITLE */}
        <input
          className="w-full bg-zinc-800 border border-zinc-700 p-2 mb-3 rounded
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="Habit title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        {/* FREQUENCY */}
        <select
          className="w-full bg-zinc-800 border border-zinc-700 p-2 mb-3 rounded"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          disabled={loading}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="interval">Every N days</option>
        </select>

        {/* WEEKLY DAYS */}
        {frequency === "weekly" && (
          <div className="flex flex-wrap gap-2 mb-4">
            {DAYS.map((day) => {
              const active = days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  disabled={loading}
                  className={`px-3 py-1 rounded-md border text-sm transition
                    ${
                      active
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    }`}
                >
                  {day.toUpperCase()}
                </button>
              );
            })}
          </div>
        )}

        {/* INTERVAL */}
        {frequency === "interval" && (
          <div className="mb-4">
            <label className="block text-sm mb-1">Repeat every</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={1}
                value={intervalDays}
                onChange={(e) => setIntervalDays(+e.target.value)}
                className="w-20 bg-zinc-800 border border-zinc-700 p-2 rounded"
              />
              <span className="text-sm text-zinc-300">days</span>
            </div>
          </div>
        )}

        {/* 🔥 DURATION */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Duration</label>
          <select
            value={durationType}
            onChange={(e) => setDurationType(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded mb-2"
          >
            <option value="forever">Forever</option>
            <option value="custom">Only for X days</option>
          </select>

          {durationType === "custom" && (
            <input
              type="number"
              min={1}
              value={durationDays}
              onChange={(e) => setDurationDays(+e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded"
              placeholder="Number of days"
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-zinc-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
