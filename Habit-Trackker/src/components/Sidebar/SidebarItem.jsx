export default function SidebarItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3
        px-3 py-2 rounded-md transition
        ${
          danger
            ? "text-red-400 hover:bg-zinc-800"
            : "text-zinc-300 hover:text-white hover:bg-zinc-800"
        }
      `}
    >
      <div className="min-w-[20px]">{icon}</div>

      <span className="
        whitespace-nowrap overflow-hidden
        max-w-0 group-hover:max-w-xs
        transition-all duration-300
      ">
        {label}
      </span>
    </button>
  );
}
