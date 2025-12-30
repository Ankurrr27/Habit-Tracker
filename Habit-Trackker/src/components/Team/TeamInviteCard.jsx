import { Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";

export default function TeamInviteCard({
  invite,
  setInvite,
  sendInvite,
  msg,
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  /* =====================
     CLOSE ON OUTSIDE CLICK
  ===================== */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* =====================
     SEARCH USERS (DEBOUNCED)
  ===================== */
  useEffect(() => {
    if (!invite || invite.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    // debounce
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      api
        .get(`/users/search?q=${invite}`)
        .then((res) => setResults(res.data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [invite]);

  return (
    <div
      ref={wrapperRef}
      className="
        relative overflow-visible
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        rounded-md px-4 py-3
        space-y-3
      "
    >
      {/* HEADER */}
      <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
        <Plus size={14} />
        Invite teammate
      </h2>

      {/* INPUT */}
      <div className="relative overflow-visible">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          value={invite}
          onChange={(e) => setInvite(e.target.value)}
          placeholder="Search by name, username or email"
          className="
            w-full pl-8 pr-2.5 py-1.5 text-sm
            rounded
            bg-zinc-50 dark:bg-zinc-900
            border border-zinc-300 dark:border-zinc-700
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400
            focus:outline-none focus:ring-1 focus:ring-indigo-500
          "
        />

        {/* RESULTS DROPDOWN */}
        {results.length > 0 && (
          <ul
            className="
              absolute z-[9999] mt-1 w-full
              bg-white dark:bg-zinc-950
              border border-zinc-200 dark:border-zinc-800
              rounded-md shadow-lg
              max-h-52 overflow-y-auto
            "
          >
            {results.map((u) => (
              <li
                key={u._id}
                onClick={() => {
                  setInvite(u.username);
                  setResults([]);
                }}
                className="
                  px-3 py-2 text-sm
                  cursor-pointer
                  hover:bg-zinc-100 dark:hover:bg-zinc-900
                "
              >
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {u.name}
                </div>
                <div className="text-xs text-zinc-500">
                  @{u.username}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ACTION */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">
          {loading ? "Searching…" : "Select a user or enter email"}
        </span>

        <button
          onClick={() => {
            sendInvite();
            setResults([]);
          }}
          className="
            px-3 py-1.5 text-sm rounded
            bg-indigo-600 text-white
            hover:bg-indigo-700
          "
        >
          Invite
        </button>
      </div>

      {/* MESSAGE */}
      {msg && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {msg}
        </p>
      )}
    </div>
  );
}
