import { DAYS } from "../../constants/days";

export default function AddHabitForm({ state, actions }) {
  const {
    title,
    frequency,
    days,
    intervalDays,
    durationType,
    durationDays,
    loading,
  } = state;

  const {
    setTitle,
    setFrequency,
    toggleDay,
    setIntervalDays,
    setDurationType,
    setDurationDays,
    submit,
  } = actions;

  return (
    <>
      <input
        className="w-full bg-zinc-800 border border-zinc-700 p-2 mb-3 rounded"
        placeholder="Habit title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />

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

      {frequency === "weekly" && (
        <div className="flex flex-wrap gap-2 mb-4">
          {DAYS.map((day) => {
            const active = days.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1 rounded-md border text-sm ${
                  active
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-300"
                }`}
              >
                {day.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}

      {frequency === "interval" && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={intervalDays}
            onChange={(e) => setIntervalDays(+e.target.value)}
            className="w-20 bg-zinc-800 border border-zinc-700 p-2 rounded"
          />
          <span className="text-sm text-zinc-300">days</span>
        </div>
      )}

      <div className="mb-4">
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
          />
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={submit}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 rounded-md"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
