import { memo } from "react";
import { Shield, ArrowUpRight, Sparkles, Flame, UserPlus } from "lucide-react";
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
        relative w-full text-left transition-all duration-300 flex flex-col hover:-translate-y-1
        ${onClick ? "cursor-pointer" : "cursor-default"}
        ${
          compact
            ? "flex-row items-center gap-3 rounded-2xl px-3 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
            : "overflow-hidden rounded-3xl bg-white dark:bg-[#080f26] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-800/80"
        }
      `}
    >
      {!compact && (
        <>
          <div className="flex items-center gap-5 p-5 w-full">
            {/* Avatar */}
            <div className="shrink-0 relative">
              <div className="rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800">
                {hasAvatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-16 w-16 object-cover"
                  />
                ) : (
                  <div className={`flex h-16 w-16 items-center justify-center text-xl font-bold text-white ${color}`}>
                    {initial}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Credentials Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                  {user.name}
                </h3>
                {user.credibilityScore > 50 && (
                   <div className="text-indigo-500">
                     <Sparkles size={12} />
                   </div>
                )}
              </div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
                @{user.username}
              </p>
              
              <div className="flex items-center gap-4 mt-2">
                 <div className="flex items-center gap-1">
                    <Flame size={12} className="text-orange-500" />
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">{user.currentStreak || 0}</span>
                 </div>
                 <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
                 <div className="flex items-center gap-1">
                    <Shield size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">{user.credibilityScore || 0}</span>
                 </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="shrink-0 pl-2">
              {!user.isSelf && typeof onToggleFollow === "function" && (
                <button
                  type="button"
                  onClick={handleFollowClick}
                  className={`
                    px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95
                    ${user.isFollowing 
                        ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700" 
                        : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-indigo-600/20"
                    }
                  `}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
              {user.isSelf && (
                <div className="px-5 py-2 rounded-xl text-xs font-bold bg-zinc-50 text-zinc-400 dark:bg-zinc-900/30 border border-transparent">
                  You
                </div>
              )}
            </div>
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
            <Sparkles size={12} className="text-indigo-400 ml-auto" />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default memo(UserCard);
