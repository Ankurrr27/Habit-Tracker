import { memo } from "react";
import { Shield, ArrowUpRight, Sparkles } from "lucide-react";
import { getAvatarColor, getInitial } from "./avatar.utils";

function UserCard({ user, compact = false, onClick, onAddFriend }) {
  if (!user) return null;

  const hasAvatar = Boolean(user.avatar);
  const color = getAvatarColor(user.name);
  const initial = getInitial(user.name);
  const Wrapper = onClick ? "button" : "div";

  const friendshipLabelMap = {
    none: "Add friend",
    request_sent: "Request sent",
    request_received: "Requested you",
    friends: "Friends",
    self: "You",
  };

  const friendshipStyleMap = {
    none: "bg-indigo-600 text-white hover:bg-indigo-700",
    request_sent:
      "border border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
    request_received:
      "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
    friends:
      "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    self:
      "border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400",
  };

  const canSendFriendRequest =
    user.friendshipStatus === "none" && typeof onAddFriend === "function";

  return (
    <Wrapper
      onClick={onClick}
      aria-label={onClick ? `Open ${user.name}'s profile` : undefined}
      className={`
        w-full text-left transition
        ${onClick ? "cursor-pointer" : "cursor-default"}
        ${
          compact
            ? `
              flex items-center gap-2 rounded-md px-2 py-1.5
              hover:bg-zinc-200 dark:hover:bg-zinc-900
            `
            : `
              overflow-hidden rounded-[1.75rem]
              border border-zinc-200 bg-white shadow-sm
              hover:-translate-y-0.5 hover:border-indigo-400/40
              dark:border-zinc-800 dark:bg-zinc-950
            `
        }
      `}
    >
      {!compact && (
        <div className="relative border-b border-zinc-200 bg-zinc-50 px-5 py-5 dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-20 rounded-full bg-sky-500/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {hasAvatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-16 w-16 rounded-2xl border border-zinc-300 object-cover dark:border-zinc-700"
                />
              ) : (
                <div
                  className={`
                    flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-semibold text-white
                    ${color}
                  `}
                >
                  {initial}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-zinc-900 dark:text-white">
                  {user.name}
                </p>
                <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                  @{user.username}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm dark:bg-zinc-950 dark:text-zinc-300">
              <Sparkles size={12} />
              Profile
            </div>
          </div>
        </div>
      )}

      <div className={compact ? "flex items-center gap-2" : "p-5"}>
        {compact && (
          <>
            {hasAvatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full border border-zinc-300 object-cover dark:border-zinc-700"
              />
            ) : (
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white
                  ${color}
                `}
              >
                {initial}
              </div>
            )}
          </>
        )}

        <div className="flex-1 min-w-0">
          {compact && (
            <>
              <p className="truncate text-xs font-medium text-zinc-900 dark:text-white">
                {user.name}
              </p>
              <p className="truncate text-[10px] text-zinc-600 dark:text-zinc-400">
                @{user.username}
              </p>
            </>
          )}

          {!compact && (
            <div className="flex items-center justify-between gap-3">
              <div
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400"
                title="Credibility score"
              >
                <Shield size={15} />
                {user.credibilityScore ?? 0} credibility
              </div>

              <div className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                View profile
                <ArrowUpRight size={12} />
              </div>
            </div>
          )}
        </div>
      </div>

      {!compact && user.friendshipStatus && (
        <div className="px-5 pb-5">
          <button
            type="button"
            disabled={!canSendFriendRequest}
            onClick={(event) => {
              event.stopPropagation();
              if (canSendFriendRequest) {
                onAddFriend(user._id);
              }
            }}
            className={`
              inline-flex items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold transition
              ${friendshipStyleMap[user.friendshipStatus]}
              ${canSendFriendRequest ? "" : "cursor-default"}
            `}
          >
            {friendshipLabelMap[user.friendshipStatus]}
          </button>
        </div>
      )}
    </Wrapper>
  );
}

export default memo(UserCard);
