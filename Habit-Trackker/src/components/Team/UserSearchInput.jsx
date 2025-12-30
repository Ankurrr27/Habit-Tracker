import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import InviteEmptyState from "./InviteEmptyState";

export default function UserSearchInput({
  value = "",
  onChange = () => {},
  onUserSelect = () => {},
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
    const q = value.trim();

    // reset cleanly
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(
          `/users/search?q=${encodeURIComponent(q)}`
        );
        setResults(res.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [value]);

  const showDropdown = loading || results.length > 0;

  return (
    <div ref={wrapperRef} className="relative">
      {/* ICON */}
      <Search
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
      />

      {/* INPUT */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, username or email"
        autoComplete="off"
        className="
          w-full pl-8 pr-3 py-2 text-sm
          rounded-md
          bg-zinc-50 dark:bg-zinc-900
          border border-zinc-300 dark:border-zinc-700
          text-zinc-900 dark:text-zinc-100
          focus:outline-none focus:ring-1 focus:ring-indigo-500
        "
      />

      {/* DROPDOWN */}
      {showDropdown && (
        <div
          className="
            absolute z-[9999] mt-1 w-full
            bg-white dark:bg-zinc-950
            border border-zinc-200 dark:border-zinc-800
            rounded-lg shadow-lg
            max-h-60 overflow-y-auto
          "
        >
          {loading ? (
            <InviteEmptyState text="Searching users…" />
          ) : results.length === 0 ? (
            <InviteEmptyState text="No users found" />
          ) : (
            <ul>
              {results.map((u) => (
                <li
                  key={u._id}
                  onClick={() => {
                    onUserSelect(u.username);
                    setResults([]); // 🔥 close dropdown cleanly
                  }}
                  className="
                    px-3 py-2 cursor-pointer
                    hover:bg-zinc-100 dark:hover:bg-zinc-900
                  "
                >
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-zinc-500">
                    @{u.username}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
