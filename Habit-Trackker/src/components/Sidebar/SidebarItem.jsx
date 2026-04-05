export default function SidebarItem({ icon, label, onClick, active, compact = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex w-full items-center gap-3 rounded-[1.25rem] px-3 py-3 text-[13px] font-bold uppercase tracking-widest transition-all duration-300
        ${compact ? "justify-center px-0 py-3 mx-auto w-12" : "px-4"}
        ${
          active
            ? `
              bg-indigo-600 text-white shadow-xl shadow-indigo-600/20
            `
            : `
              text-slate-400 hover:bg-white/5 hover:text-slate-100
            `
        }
      `}
    >
      <span
        className={`
          relative z-10 flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110
          ${compact ? "w-6" : "w-6"}
          ${active ? "text-white" : "text-slate-500 group-hover:text-indigo-400"}
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
