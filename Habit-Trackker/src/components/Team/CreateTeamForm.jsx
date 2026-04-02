export default function CreateTeamForm({ state, actions }) {
  const { name, description, loading, error } = state;
  const { setName, setDescription, submit } = actions;

  return (
    <div className="space-y-4">
      {error && (
        <div
          className="
            text-sm text-red-600 dark:text-red-400
            bg-red-50 dark:bg-red-500/10
            border border-red-200 dark:border-red-500/20
            rounded-md px-4 py-2
          "
        >
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
          Team name
        </label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Design crew"
          className="
            w-full px-3 py-2 text-sm
            rounded-lg
            bg-white dark:bg-zinc-950
            border border-zinc-300 dark:border-zinc-700
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400
            focus:outline-none focus:ring-1 focus:ring-indigo-500
          "
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
          Short description
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What the team is for, how you work together, or what you are building."
          rows={4}
          className="
            w-full px-3 py-2 text-sm
            rounded-lg
            bg-white dark:bg-zinc-950
            border border-zinc-300 dark:border-zinc-700
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400
            focus:outline-none focus:ring-1 focus:ring-indigo-500
          "
        />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="
          w-full py-2.5 text-sm rounded-lg
          bg-indigo-600 text-white
          hover:bg-indigo-700
          disabled:opacity-60
        "
      >
        {loading ? "Creating..." : "Create team"}
      </button>
    </div>
  );
}
