import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Home,
  Flame,
  User,
  Users,
  Group,
  Calendar1Icon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AddHabitModal from "./../AddHabit";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <aside
        className="
          group
          w-16 hover:w-56
          transition-all flex flex-col

          bg-white dark:bg-black
          border-r border-zinc-200 dark:border-zinc-800
        "
      >
        {/* NAV */}
        <nav className="px-2 py-4 space-y-2">
          <SidebarItem
            icon={<Home />}
            label="Home"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={<Flame />}
            label="Streaks"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={<Group />}
            label="Team"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={<Calendar1Icon />}
            label="Week Planner"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={<Users />}
            label="Users"
            onClick={() => navigate("/users")}
          />

          <SidebarItem
            icon={<User />}
            label="Profile"
            onClick={() =>
              user?.username && navigate(`/u/${user.username}`)
            }
          />
        </nav>

        {/* ADD HABIT */}
        <div className="mt-auto p-2">
          <button
            onClick={() => setOpen(true)}
            className="
              w-full flex gap-3 items-center
              rounded-md
              transition-colors

              bg-indigo-600 hover:bg-indigo-700
              text-white
            "
          >
            <Plus className="w-5 h-5 mx-2 my-2" />
            <span
              className="
                whitespace-nowrap overflow-hidden
                max-w-0 group-hover:max-w-xs
                transition-all pt-1
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
