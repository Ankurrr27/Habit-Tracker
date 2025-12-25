import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddHabitModal from "./AddHabitModal";
import { Plus, Home, Flame, User, LogOut } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <aside
        className="
          group
          h-full
          min-w-[4rem]
          bg-black
          border-r border-zinc-800
          transition-all duration-300 ease-in-out
          w-16 hover:w-56
          flex flex-col
        "
      >
        {/* TOP NAV ITEMS */}
        <nav className="px-2 py-4 space-y-2">
          <SidebarItem
            icon={<Home />}
            label="Home"
            onClick={() => navigate("/")}
          />

          <SidebarItem
            icon={<Flame />}
            label="Streaks"
            onClick={() => navigate("/")}
          />

          <SidebarItem
            icon={<User />}
            label="Profile"
            onClick={() => navigate("/profile")}
          />
        </nav>

        {/* 🔥 PUSH EVERYTHING BELOW TO BOTTOM */}
        <div className="mt-auto p-2 space-y-2">
          
          {/* ADD HABIT */}
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
            <Plus className="w-5 h-5 min-w-[20px] min-h-[20px]" />
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

function SidebarItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        flex items-center justify-start gap-3
        text-zinc-300 hover:text-white
        hover:bg-zinc-800
        px-3 py-2 rounded-md
        transition
      "
    >
      <div className="min-w-[20px] min-h-[20px]">{icon}</div>

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
    </button>
  );
}
