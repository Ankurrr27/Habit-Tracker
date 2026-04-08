import { memo } from "react";
import { Shield, Sparkles, Flame } from "lucide-react";
import { getAvatarColor, getInitial } from "./avatar.utils";
import { motion as Motion } from "framer-motion";

function UserCard({ user, compact = false, onClick, onToggleFollow }) {
  if (!user) return null;

  const hasAvatar = Boolean(user.avatar);
  const color = getAvatarColor(user.name);
  const initial = getInitial(user.name);
  const Wrapper = onClick ? Motion.button : Motion.div;

  const handleFollowClick = (e) => {
    if (onClick) {
       // if clicking is required prevent it
       e.stopPropagation();
    }
    if (onToggleFollow) onToggleFollow(user.username);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -2, borderColor: "rgba(99, 102, 241, 0.3)" },
  };

  return (
    <Wrapper
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
      onClick={onClick}
      className={`
        relative w-full max-w-xl text-left transition-all duration-300
        border border-[rgba(var(--primary),0.12)]
        bg-[rgba(var(--primary),0.02)] backdrop-blur-sm
        shadow-[0_4px_20px_-4px_rgba(var(--primary),0.05)]
        hover:shadow-[0_20px_40px_-12px_rgba(var(--primary),0.1)]
        ${compact
          ? "flex flex-row items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer"
          : "flex flex-row items-center gap-5 px-5 py-4 rounded-3xl"
        }
      `}
    >
      {!compact && (
        <>
          {/* Avatar */}
          <div className="shrink-0">
            <div className="rounded-full overflow-hidden">
              {hasAvatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-12 w-12 object-cover"
                />
              ) : (
                <div className={`flex h-12 w-12 items-center justify-center text-lg font-extrabold text-white ${color} rounded-full`}>
                  {initial}
                </div>
              )}
            </div>
          </div>

          {/* Name & Stats — flex-1 fills all available space */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                {user.name}
              </h3>
              {user.credibilityScore > 50 && (
                <Sparkles size={11} className="accent-text shrink-0" />
              )}
            </div>
            <p className="text-[11px] font-medium text-zinc-400 truncate mb-1.5">
              @{user.username}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Flame size={11} className="text-orange-500" />
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">{user.currentStreak || 0}d</span>
              </div>
              <div className="h-2.5 w-px bg-zinc-300 dark:bg-zinc-700" />
              <div className="flex items-center gap-1">
                <Shield size={11} className="accent-text" />
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">{user.credibilityScore || 0}</span>
              </div>
            </div>
          </div>

          {/* Follow / Unfollow button — pinned right */}
          <div className="shrink-0">
            {!user.isSelf && typeof onToggleFollow === "function" && (
              <button
                type="button"
                onClick={handleFollowClick}
                className={`
                  px-4 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95
                  ${user.isFollowing
                    ? "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-red-400 hover:text-red-500 dark:hover:text-red-400"
                    : "bg-[rgb(var(--primary))] text-white hover:opacity-90"
                  }
                `}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            {user.isSelf && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">You</span>
            )}
          </div>
        </>
      )}

      {compact && (
        <>
          {hasAvatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-xl object-cover"
            />
          ) : (
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white ${color}`}>
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">{user.name}</p>
            <p className="truncate text-[11px] text-zinc-400">@{user.username}</p>
          </div>
          {user.friendshipStatus === "friends" && (
            <Sparkles size={12} className="accent-text-soft ml-auto" />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default memo(UserCard);
