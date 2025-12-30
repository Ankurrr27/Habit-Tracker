import { Plus } from "lucide-react";
import { useState } from "react";
import UserSearchInput from "./UserSearchInput";

export default function TeamInviteCard({
  invite,
  setInvite,
  sendInvite,
  msg,
}) {
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!invite || sending) return;

    setSending(true);

    try {
      await sendInvite(); // hook handles msg internally

      // UX: clear input after success (not instantly)
      setTimeout(() => {
        setInvite("");
      }, 800);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        rounded-xl px-5 py-4
        space-y-4
      "
    >
      {/* HEADER */}
      <h2 className="text-sm font-semibold flex items-center gap-2">
        <Plus size={16} />
        Invite teammate
      </h2>

      {/* SEARCH */}
      <UserSearchInput
        value={invite}
        onChange={setInvite}
        onUserSelect={setInvite}
      />

      {/* ACTION */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">
          Select a user, then send invite
        </span>

        <button
          onClick={handleInvite}
          disabled={!invite || sending}
          className="
            px-4 py-1.5 rounded-md text-sm
            bg-indigo-600 text-white
            hover:bg-indigo-700
            disabled:opacity-50
          "
        >
          {sending ? "Sending…" : "Invite"}
        </button>
      </div>

      {/* MESSAGE (FROM HOOK STATE) */}
      {msg && (
        <p
          className={`text-xs ${
            msg.toLowerCase().includes("fail")
              ? "text-red-500"
              : "text-emerald-600"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
