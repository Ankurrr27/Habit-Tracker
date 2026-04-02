import { DAYS } from "../../constants/days";
import { PLATFORM_OPTIONS } from "./addHabit.utils";

export default function AddHabitForm({ state, actions }) {
  const {
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
  } = state;

  const {
    setTitle,
    setType,
    setFrequency,
    toggleDay,
    setIntervalDays,
    setDurationType,
    setDurationDays,
    setVerificationRule,
    setPlatformSource,
    submit,
  } = actions;

  const inputBase = `
    w-full p-2 rounded-md
    bg-white dark:bg-zinc-900
    text-zinc-900 dark:text-zinc-100
    border border-zinc-300 dark:border-zinc-700
    focus:outline-none focus:ring-2 focus:ring-indigo-500/40
    disabled:opacity-60
  `;

  return (
    <>
      <input
        className={`${inputBase} mb-3`}
        placeholder="Habit title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={loading}
      />

      <select
        className={`${inputBase} mb-3`}
        value={type}
        onChange={(event) => setType(event.target.value)}
        disabled={loading || verificationRule === "platform"}
      >
        <option value="habit">Habit</option>
        <option value="hobby">Hobby</option>
      </select>

      <select
        className={`${inputBase} mb-3`}
        value={verificationRule}
        onChange={(event) => setVerificationRule(event.target.value)}
        disabled={loading}
      >
        <option value="manual">Manual tracking</option>
        <option value="platform">Auto-track from coding profile</option>
      </select>

      {verificationRule === "platform" && (
        <div className="mb-4 space-y-2">
          <select
            className={inputBase}
            value={platformSource}
            onChange={(event) => setPlatformSource(event.target.value)}
            disabled={loading}
          >
            {PLATFORM_OPTIONS.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            This will use the handle saved in your profile and mark today as
            done when activity is detected on that platform.
          </p>
        </div>
      )}

      <select
        className={`${inputBase} mb-3`}
        value={frequency}
        onChange={(event) => setFrequency(event.target.value)}
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
                className={`
                  px-3 py-1 rounded-md text-sm border transition
                  ${
                    active
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-zinc-800"
                  }
                `}
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
            onChange={(event) => setIntervalDays(+event.target.value)}
            className={`${inputBase} w-24`}
          />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            days
          </span>
        </div>
      )}

      <div className="mb-4">
        <select
          value={durationType}
          onChange={(event) => setDurationType(event.target.value)}
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
            onChange={(event) => setDurationDays(+event.target.value)}
            className={inputBase}
          />
        )}
      </div>

      {error && (
        <p className="mb-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={loading}
          className="
            px-4 py-2 rounded-md
            bg-indigo-600 text-white
            hover:bg-indigo-700
            disabled:opacity-60
          "
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
