export default function SidebarItem({ icon, label, onClick, active, compact = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
        ${compact ? "justify-center px-1.5 py-2.5" : ""}
        ${
          active
            ? `
              bg-indigo-50 text-indigo-700 shadow-sm
              dark:bg-indigo-500/10 dark:text-indigo-300
            `
            : `
              text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900
              dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white
            `
        }
      `}
    >
      {active && <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />}

      <span
        className={`
          relative z-10 flex shrink-0 items-center justify-center
          ${compact ? "w-7" : "w-9"}
          ${active ? "text-indigo-600 dark:text-indigo-300" : "text-zinc-400 dark:text-zinc-500"}
        `}
      >
        {icon}
      </span>

      {!compact && <span className="truncate">{label}</span>}
    </button>
  );
}
