export default function SidebarItem({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full h-11
        flex items-center gap-3
        px-2 rounded-md
        text-sm
        transition

        ${
          active
            ? `
              bg-indigo-50 text-indigo-700
              dark:bg-emerald-500/10 dark:text-emerald-400
            `
            : `
              text-zinc-700 dark:text-zinc-300
              hover:bg-zinc-100 dark:hover:bg-zinc-800
            `
        }
      `}
    >
      {/* ICON */}
      <span
        className={`
          shrink-0 flex items-center justify-center w-8
          ${
            active
              ? `
                text-indigo-600
                dark:text-emerald-400
              `
              : `
                text-zinc-500
                dark:text-zinc-400
              `
          }
        `}
      >
        {icon}
      </span>

      {/* LABEL */}
      <span
        className="
          whitespace-nowrap overflow-hidden
          max-w-0 group-hover:max-w-xs
          transition-all duration-200
        "
      >
        {label}
      </span>
    </button>
  );
}
