import { memo } from "react";
import { Shield } from "lucide-react";
import { getAvatarColor, getInitial } from "./avatar.utils";

function UserCard({ user, compact = false, onClick }) {
  if (!user) return null;

  const hasAvatar = Boolean(user.avatar);
  const color = getAvatarColor(user.name);
  const initial = getInitial(user.name);

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      aria-label={onClick ? `Open ${user.name}'s profile` : undefined}
      className={`
        w-full text-left transition-colors
        ${onClick ? "cursor-pointer" : "cursor-default"}
        ${
          compact
            ? `
              flex items-center gap-2 px-2 py-1.5 rounded-md
              hover:bg-zinc-200 dark:hover:bg-zinc-900
            `
            : `
              rounded-xl p-4
              bg-white dark:bg-zinc-900
              border border-zinc-200 dark:border-zinc-800
              hover:border-indigo-500/40
            `
        }
      `}
    >
      <div className={`flex items-center ${compact ? "gap-2" : "gap-4"}`}>
        {/* AVATAR */}
        {hasAvatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className={`
              rounded-full object-cover
              border border-zinc-300 dark:border-zinc-700
              ${compact ? "w-8 h-8" : "w-12 h-12"}
            `}
          />
        ) : (
          <div
            className={`
              rounded-full flex items-center justify-center
              font-semibold text-white
              ${color}
              ${compact ? "w-8 h-8 text-xs" : "w-12 h-12 text-lg"}
            `}
          >
            {initial}
          </div>
        )}

        {/* INFO */}
        <div className="flex-1 min-w-0">
          <p
            className={`
              truncate
              ${compact ? "text-xs font-medium" : "font-medium"}
              text-zinc-900 dark:text-white
            `}
          >
            {user.name}
          </p>
          <p
            className={`
              truncate
              ${compact ? "text-[10px]" : "text-xs"}
              text-zinc-600 dark:text-zinc-400
            `}
          >
            @{user.username}
          </p>
        </div>

        {/* SCORE */}
        <div
          className={`
            flex items-center gap-1
            ${compact ? "text-[10px]" : "text-sm"}
            text-indigo-600 dark:text-indigo-400
          `}
          title="Credibility score"
        >
          <Shield size={compact ? 10 : 14} />
          {user.credibilityScore ?? 0}
        </div>
      </div>
    </Wrapper>
  );
}

export default memo(UserCard);
