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
      await sendInvite();
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
        rounded-2xl px-5 py-5
        space-y-4
      "
    >
      <h2 className="text-sm font-semibold flex items-center gap-2">
        <Plus size={16} />
        Invite teammate
      </h2>

      <UserSearchInput
        value={invite}
        onChange={setInvite}
        onUserSelect={setInvite}
      />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-zinc-400">
          Search by username or email
        </span>

        <button
          onClick={handleInvite}
          disabled={!invite || sending}
          className="
            px-4 py-2 rounded-lg text-sm
            bg-indigo-600 text-white
            hover:bg-indigo-700
            disabled:opacity-50
          "
        >
          {sending ? "Sending..." : "Send invite"}
        </button>
      </div>

      {msg && (
        <p
          className={`text-xs ${
            msg.toLowerCase().includes("fail") ||
            msg.toLowerCase().includes("not")
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
