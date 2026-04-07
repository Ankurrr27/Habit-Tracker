import { DAYS } from "../../constants/days";
import { PLATFORM_OPTIONS } from "./addHabit.utils";
import { useAuth } from "../../context/useAuth";

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

  const { user } = useAuth();
  const accentColor = user?.accentColor || "indigo";

  const accentBgMap = {
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20",
    pink: "bg-pink-600 hover:bg-pink-700 shadow-pink-500/20",
    rose: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20",
    sky: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/20",
    emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
    cyan: "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/20",
    orange: "bg-orange-600 hover:bg-orange-700 shadow-orange-500/20",
    violet: "bg-violet-600 hover:bg-violet-700 shadow-violet-500/20",
  };

  const accentRingMap = {
    indigo: "focus:ring-indigo-500/20 focus:border-indigo-500/50",
    pink: "focus:ring-pink-500/20 focus:border-pink-500/50",
    rose: "focus:ring-rose-500/20 focus:border-rose-500/50",
    sky: "focus:ring-sky-500/20 focus:border-sky-500/50",
    emerald: "focus:ring-emerald-500/20 focus:border-emerald-500/50",
    cyan: "focus:ring-cyan-500/20 focus:border-cyan-500/50",
    orange: "focus:ring-orange-500/20 focus:border-orange-500/50",
    violet: "focus:ring-violet-500/20 focus:border-violet-500/50",
  };

  const dayActiveMap = {
    indigo: "bg-indigo-600 border-indigo-600",
    pink: "bg-pink-600 border-pink-600",
    rose: "bg-rose-500 border-rose-500",
    sky: "bg-sky-500 border-sky-500",
    emerald: "bg-emerald-600 border-emerald-600",
    cyan: "bg-cyan-600 border-cyan-600",
    orange: "bg-orange-600 border-orange-600",
    violet: "bg-violet-600 border-violet-600",
  };

  const inputBase = `
    w-full px-5 py-3 rounded-2xl
    bg-zinc-100/50 dark:bg-zinc-900/50
    text-zinc-900 dark:text-zinc-100
    border border-transparent
    transition-all duration-200
    placeholder:text-zinc-500
    focus:outline-none focus:ring-4
    ${accentRingMap[accentColor]}
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
                  px-3 py-2 rounded-xl text-[10px] font-black tracking-widest border transition-all duration-300
                  ${
                    active
                      ? `${dayActiveMap[accentColor]} text-white border-transparent shadow-md`
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
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

      <div className="flex justify-end pt-4">
        <button
          onClick={submit}
          disabled={loading}
          className={`
            px-8 py-3 rounded-2xl
            text-white font-black uppercase tracking-widest text-[11px]
            transition-all duration-300 shadow-lg
            disabled:opacity-60
            ${accentBgMap[accentColor]}
          `}
        >
          {loading ? "Saving..." : "Save Habit"}
        </button>
      </div>
    </>
  );
}
