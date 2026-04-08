export default function SidebarItem({ icon, label, onClick, active, compact = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex w-full items-center gap-3 rounded-[18px] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300
        ${compact ? "justify-center px-0 py-2.5 mx-auto w-11" : "px-4"}
        ${
          active
            ? `
              bg-[rgb(var(--primary))] text-white shadow-lg shadow-[rgba(var(--primary),0.22)]
            `
            : `
              text-slate-400 hover:bg-white/6 hover:text-slate-100
            `
        }
      `}
    >
      <span
        className={`
          relative z-10 flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110
          ${compact ? "w-5" : "w-5"}
          ${active ? "text-white" : "text-slate-500 group-hover:text-[rgb(var(--primary))]"}
        `}
      >
        {icon}
      </span>

      {!compact && <span className="truncate">{label}</span>}
      
      {active && !compact && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
      )}
    </button>
  );
}
