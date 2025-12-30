import { UserPlus } from "lucide-react";

export default function InviteEmptyState({ text }) {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        py-10 px-4
        text-center
        text-zinc-500 dark:text-zinc-400
        animate-fade-in
      "
    >
      {/* ICON BUBBLE */}
      <div
        className="
          relative
          w-16 h-16 rounded-2xl
          flex items-center justify-center
          bg-gradient-to-br from-indigo-500/10 to-purple-500/10
          text-indigo-600 dark:text-indigo-400
          mb-4
        "
      >
        <UserPlus size={28} />

        {/* subtle glow */}
        <span
          className="
            absolute inset-0 rounded-2xl
            bg-indigo-500/10 blur-xl
            -z-10
          "
        />
      </div>

      {/* TEXT */}
      <p className="text-sm font-medium">
        {text}
      </p>

      {/* SUBTLE HINT */}
      <p className="text-xs mt-1 text-zinc-400 dark:text-zinc-500">
        Try searching by username or email
      </p>
    </div>
  );
}
