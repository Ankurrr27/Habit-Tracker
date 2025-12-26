import { Shield } from "lucide-react";

/* =====================
   COLOR POOL (STABLE)
===================== */
const COLORS = [
  "bg-indigo-600",
  "bg-pink-600",
  "bg-emerald-600",
  "bg-purple-600",
  "bg-blue-600",
  "bg-orange-600",
  "bg-rose-600",
];

/* deterministic color (same user → same color) */
function getColorFromName(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function UserCard({ user, onClick }) {
  const hasAvatar = Boolean(user.avatar);
  const letter = user.name?.charAt(0)?.toUpperCase() || "?";
  const bgColor = getColorFromName(user.name);

  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-zinc-900 border border-zinc-800
        rounded-xl p-4 text-left
        hover:border-indigo-500
        transition
      "
    >
      <div className="flex items-center gap-4">
        {/* AVATAR */}
        {hasAvatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-zinc-700"
          />
        ) : (
          <div
            className={`
              w-12 h-12 rounded-full
              flex items-center justify-center
              text-white font-semibold text-lg
              ${bgColor}
            `}
          >
            {letter}
          </div>
        )}

        {/* INFO */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">
            {user.name}
          </p>
          <p className="text-xs text-zinc-400 truncate">
            @{user.username}
          </p>
        </div>

        {/* SCORE (PUBLIC USERS ONLY) */}
        {typeof user.credibilityScore === "number" && (
          <div className="flex items-center gap-1 text-indigo-400 text-sm">
            <Shield size={14} />
            {user.credibilityScore}
          </div>
        )}
      </div>
    </button>
  );
}
