import { Shield } from "lucide-react";

const COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-purple-500",
];

function getColor(name = "") {
  const index = name.charCodeAt(0) % COLORS.length;
  return COLORS[index];
}

export default function UserCard({ user, compact = false, onClick }) {
  const hasAvatar = !!user.avatar;
  const firstLetter = user.name?.charAt(0).toUpperCase() || "?";
  const color = getColor(user.name);

  /* =====================
     COMPACT MODE
  ===================== */
  if (compact) {
    return (
      <button
        onClick={onClick}
        className="
          w-full
          flex items-center gap-2
          px-2 py-1.5
          rounded-md
          hover:bg-zinc-900
          transition
          text-left
        "
      >
        {/* AVATAR */}
        {hasAvatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-zinc-700"
          />
        ) : (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${color}`}
          >
            {firstLetter}
          </div>
        )}

        {/* NAME */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white truncate">
            {user.name}
          </p>
          <p className="text-[10px] text-zinc-500 truncate">
            @{user.username}
          </p>
        </div>

        {/* SCORE */}
        <div className="flex items-center gap-0.5 text-[10px] text-indigo-400">
          <Shield size={10} />
          {user.credibilityScore ?? 0}
        </div>
      </button>
    );
  }

  /* =====================
     NORMAL MODE
  ===================== */
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-zinc-900
        border border-zinc-800
        rounded-xl p-4
        text-left
        hover:border-indigo-500/40
        transition
      "
    >
      <div className="flex items-center gap-4">
        {hasAvatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-zinc-700"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold text-white ${color}`}
          >
            {firstLetter}
          </div>
        )}

        <div className="flex-1">
          <p className="font-medium text-white">{user.name}</p>
          <p className="text-xs text-zinc-400">@{user.username}</p>
        </div>

        <div className="flex items-center gap-1 text-indigo-400 text-sm">
          <Shield size={14} />
          {user.credibilityScore ?? 0}
        </div>
      </div>
    </button>
  );
}
