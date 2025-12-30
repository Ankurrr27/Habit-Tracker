export default function TeamInvitesSection({ invites, onAccept, onReject }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        Team Invites
      </h2>

      {invites.length === 0 ? (
        <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2">
          No pending invitations
        </div>
      ) : (
        <div className="space-y-2">
          {invites.map((invite) => (
            <div
              key={invite._id}
              className="
                flex items-center justify-between
                bg-white dark:bg-zinc-950
                border border-zinc-200 dark:border-zinc-800
                rounded-md px-3 py-2
              "
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {invite.team?.name || "Unknown team"}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Invitation to join
                </p>
              </div>

              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onAccept(invite._id)}
                  className="
                    px-2 py-1 text-xs rounded
                    bg-emerald-600 text-white
                    hover:bg-emerald-700
                  "
                >
                  Accept
                </button>

                <button
                  onClick={() => onReject(invite._id)}
                  className="
                    px-2 py-1 text-xs rounded
                    bg-zinc-100 dark:bg-zinc-800
                    text-zinc-700 dark:text-zinc-300
                    hover:bg-zinc-200 dark:hover:bg-zinc-700
                  "
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
