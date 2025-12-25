// components/Sidebar.jsx
import { useState } from "react";
import AddHabitModal from "./AddHabitModal";
import { Plus, Home, Flame } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside
        className="
          group
          h-full
          min-w-[4rem]
          bg-zinc-900
          border-r border-zinc-800
          transition-all duration-300 ease-in-out
          w-16 hover:w-56
          flex flex-col
        "
      >
        {/* NAV ITEMS */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          <SidebarItem icon={<Home />} label="Home" />
          <SidebarItem icon={<Flame />} label="Streaks" />
        </nav>

        {/* ADD HABIT */}
        <div className="p-2">
          <button
            onClick={() => setOpen(true)}
            className="
              w-full
              flex items-center justify-start gap-3
              bg-indigo-600 hover:bg-indigo-700
              text-white
              py-2 px-3
              rounded-md
              transition
            "
          >
            {/* ICON — HARD LOCKED */}
            <Plus className="w-5 h-5 min-w-[20px] min-h-[20px]" />

            {/* LABEL — COLLAPSIBLE */}
            <span
              className="
                whitespace-nowrap
                overflow-hidden
                max-w-0
                group-hover:max-w-xs
                transition-all duration-300
              "
            >
              Add Habit
            </span>
          </button>
        </div>
      </aside>

      {open && <AddHabitModal onClose={() => setOpen(false)} />}
    </>
  );
}

function SidebarItem({ icon, label }) {
  return (
    <div
      className="
        flex items-center justify-start gap-3
        text-zinc-300 hover:text-white
        hover:bg-zinc-800
        px-3 py-2 rounded-md
        cursor-pointer
        transition
      "
    >
      {/* ICON — HARD LOCKED */}
      <div className="min-w-[20px] min-h-[20px]">
        {icon}
      </div>

      {/* LABEL */}
      <span
        className="
          whitespace-nowrap
          overflow-hidden
          max-w-0
          group-hover:max-w-xs
          transition-all duration-300
        "
      >
        {label}
      </span>
    </div>
  );
}
