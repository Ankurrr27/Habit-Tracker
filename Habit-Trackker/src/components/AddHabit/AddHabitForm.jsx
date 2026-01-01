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

  const inputBase = `
    w-full p-2 rounded
    bg-bg text-text
    border border-black/20
    focus:outline-none focus:ring-2 focus:ring-primary/40
    disabled:opacity-60
  `;

  return (
    <>
      {/* TITLE */}
      <input
        className={`${inputBase} mb-3`}
        placeholder="Habit title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />

      {/* FREQUENCY */}
      <select
        className={`${inputBase} mb-3`}
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
                className={`
                  px-3 py-1 rounded-md border text-sm transition
                  ${
                    active
                      ? "bg-primary border-primary text-primary-contrast"
                      : `
                        bg-bg
                        border-black/20
                        text-text/70
                        hover:bg-primary/10
                      `
                  }
                `}
              >
                {day.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}

      {/* INTERVAL */}
      {frequency === "interval" && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={intervalDays}
            onChange={(e) => setIntervalDays(+e.target.value)}
            className={`${inputBase} w-20`}
          />
          <span className="text-sm opacity-70">
            days
          </span>
        </div>
      )}

      {/* DURATION */}
      <div className="mb-4">
        <select
          value={durationType}
          onChange={(e) => setDurationType(e.target.value)}
          className={`${inputBase} mb-2`}
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
            className={inputBase}
          />
        )}
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-2">
        <button
          onClick={submit}
          disabled={loading}
          className="
            px-4 py-2 rounded-md
            bg-primary text-primary-contrast
            hover:opacity-90
            disabled:opacity-60
          "
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
