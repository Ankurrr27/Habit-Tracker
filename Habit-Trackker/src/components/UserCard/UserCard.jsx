import { memo } from "react";
import { Shield, ArrowUpRight, Sparkles, Flame, UserPlus } from "lucide-react";
import { getAvatarColor, getInitial } from "./avatar.utils";
import { motion as Motion } from "framer-motion";

function UserCard({ user, compact = false, onClick, onAddFriend }) {
  if (!user) return null;

  const hasAvatar = Boolean(user.avatar);
  const color = getAvatarColor(user.name);
  const initial = getInitial(user.name);
  const Wrapper = onClick ? Motion.button : Motion.div;

  const friendshipLabelMap = {
    none: "Add friend",
    request_sent: "Request sent",
    request_received: "Requested you",
    friends: "Friends",
    self: "You",
  };

  const friendshipStyleMap = {
    none: "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700",
    request_sent:
      "border border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400",
    request_received:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    friends:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 font-extrabold",
    self:
      "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500",
  };

  const canSendFriendRequest =
    user.friendshipStatus === "none" && typeof onAddFriend === "function";

  const cardVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -4, borderColor: "rgba(99, 102, 241, 0.4)" },
  };

  return (
    <Wrapper
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
      onClick={onClick}
      className={`
        relative w-full text-left transition-all duration-300
        ${onClick ? "cursor-pointer" : "cursor-default"}
        ${
          compact
            ? "flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
            : "overflow-hidden rounded-[2rem] border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-[#030712] shadow-xl shadow-zinc-200/20 dark:shadow-none"
        }
      `}
    >
      {!compact && (
        <>
          {/* Accent mesh background */}
          <div className="absolute inset-x-0 top-0 h-24 overflow-hidden -z-0">
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl" />
          </div>

          <div className="relative z-10 p-6 flex flex-col gap-5">
            {/* Top Row: Avatar + Identity */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {hasAvatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-16 w-16 rounded-2xl object-cover shadow-lg shadow-black/10"
                    />
                  ) : (
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow-lg ${color}`}>
                      {initial}
                    </div>
                  )}
                  {/* Active status indicator if needed */}
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-[#030712] bg-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {user.name}
                  </h3>
                  <p className="text-sm font-medium text-zinc-400">@{user.username}</p>
                </div>
              </div>

              {user.friendshipStatus === "friends" && (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Sparkles size={18} />
                </div>
              )}
            </div>

            {/* Social Signal: Streak & Credibility */}
            <div className="flex items-center gap-4 border-y border-zinc-50 dark:border-zinc-800/50 py-4">
              <div className="flex-1 space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Streak</p>
                <div className="flex items-center gap-1.5 font-extrabold text-orange-500">
                   <Flame size={14} strokeWidth={3} />
                   <span className="text-lg tabular-nums tracking-tighter">
                     {user.currentStreak || 0}
                   </span>
                </div>
              </div>
              <div className="h-8 w-px bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex-1 space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Credibility</p>
                <div className="flex items-center gap-1.5 font-extrabold text-indigo-500">
                   <Shield size={14} strokeWidth={2.5} />
                   <span className="text-lg tabular-nums tracking-tighter">
                     {user.credibilityScore || 0}
                   </span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className={`flex items-center gap-3 ${onClick ? 'justify-between' : 'justify-start'}`}>
              {!onClick && user.friendshipStatus && (
                <button
                  type="button"
                  disabled={!canSendFriendRequest}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canSendFriendRequest) onAddFriend(user._id);
                  }}
                  className={`
                    flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold transition-all active:scale-95
                    ${friendshipStyleMap[user.friendshipStatus]}
                    ${canSendFriendRequest ? "" : "cursor-default opacity-80"}
                  `}
                >
                  {canSendFriendRequest && <UserPlus size={14} />}
                  {friendshipLabelMap[user.friendshipStatus]}
                </button>
              )}
              
              {onClick && (
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-auto">
                   View Profile
                   <ArrowUpRight size={12} strokeWidth={3} />
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
