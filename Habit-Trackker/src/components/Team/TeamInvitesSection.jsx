import { Check, X, Mail } from "lucide-react";

export default function TeamInvitesSection({ invites, onAccept, onReject }) {
  return (
    <section
      className="
        bg-white dark:bg-zinc-950
         dark:border-zinc-800
        rounded-xl
        px-5 py-4
        space-y-4
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <div
          className="
            w-9 h-9 rounded-lg
            flex items-center justify-center
            bg-indigo-50 dark:bg-indigo-500/10
            text-indigo-600 dark:text-indigo-400
          "
        >
          <Mail size={18} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Team invitations
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pending requests to join teams
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {invites.length === 0 ? (
        <div
          className="
            flex items-center justify-center
            min-h-[120px]
            rounded-lg
            border border-dashed border-zinc-200 dark:border-zinc-800
            text-sm text-zinc-500 dark:text-zinc-400
            bg-zinc-50 dark:bg-zinc-900
          "
        >
          No pending invitations
        </div>
      ) : (
        <div className="space-y-3">
          {invites.map((invite) => (
            <div
              key={invite._id}
              className="
                flex items-center justify-between
                rounded-lg
                border border-zinc-200 dark:border-zinc-800
                px-4 py-3
                bg-zinc-50 dark:bg-zinc-900
                hover:border-indigo-400/40
                transition
              "
            >
              {/* INFO */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {invite.team?.name || "Unknown team"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  You’ve been invited to join this team
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onAccept(invite._id)}
                  className="
                    inline-flex items-center gap-1.5
                    px-3 py-1.5 rounded-md
                    text-xs font-medium
                    bg-emerald-600 text-white
                    hover:bg-emerald-700
                    transition
                  "
                >
                  <Check size={14} />
                  Accept
                </button>

                <button
                  onClick={() => onReject(invite._id)}
                  className="
                    inline-flex items-center gap-1.5
                    px-3 py-1.5 rounded-md
                    text-xs font-medium
                    bg-zinc-200 dark:bg-zinc-800
                    text-zinc-700 dark:text-zinc-300
                    hover:bg-zinc-300 dark:hover:bg-zinc-700
                    transition
                  "
                >
                  <X size={14} />
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
