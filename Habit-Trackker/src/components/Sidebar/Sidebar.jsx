import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Home,
  CalendarDays,
  Users,
  Workflow,
  LogOut,
  Search,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import AddHabitModal from "../AddHabit";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // 🔥 CORRECT LOGOUT HANDLER
  const handleLogout = () => {
    logout();                    // clear auth state
    navigate("/", { replace: true }); // redirect to root safely
  };

  return (
    <>
      <aside
        className="
          group
          w-16 hover:w-56
          transition-[width] duration-200 ease-in-out
          flex flex-col
          bg-white dark:bg-black
          border-r border-zinc-200 dark:border-zinc-800
        "
      >
        {/* NAV */}
        <nav className="px-2 py-4 space-y-1">
          <SidebarItem
            icon={<Home size={20} />}
            label="Home"
            active={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={<Users size={20} />}
            label="Teams"
            active={isActive("/teams")}
            onClick={() => navigate("/teams")}
          />

          <SidebarItem
            icon={<CalendarDays size={20} />}
            label="Calendar"
            active={isActive("/calendar")}
            onClick={() => navigate("/calendar")}
          />

          <SidebarItem
            icon={<Workflow size={20} />}
            label="Projects"
            active={isActive("/projects")}
            onClick={() => navigate("/projects")}
          />

          <SidebarItem
            icon={<Search size={20} />}
            label="Search"
            active={isActive("/users")}
            onClick={() => navigate("/users")}
          />

          {/* PROFILE */}
          <SidebarItem
            icon={
              user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover border"
                />
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-indigo-600 text-white text-[11px] font-semibold">
                  {(user?.name || user?.username || "?")[0].toUpperCase()}
                </div>
              )
            }
            label="Profile"
            active={isActive(`/u/${user?.username}`)}
            onClick={() => user?.username && navigate(`/u/${user.username}`)}
          />
        </nav>

        {/* FOOTER */}
        <div className="mt-auto p-2 space-y-2">
          {/* ADD HABIT */}
          <button
            onClick={() => setOpen(true)}
            className="
              w-full h-11 flex items-center gap-3
              rounded-md bg-indigo-600 hover:bg-indigo-700
              text-white transition-colors
            "
          >
            <Plus className="w-5 h-5 ml-3 shrink-0" />
            <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all text-sm font-medium">
              Add Habit
            </span>
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
              w-full h-11 flex items-center gap-3
              rounded-md text-red-500 hover:bg-red-500/10
              transition-all duration-200
              opacity-0 pointer-events-none
              group-hover:opacity-100 group-hover:pointer-events-auto
            "
          >
            <LogOut className="w-5 h-5 ml-3 shrink-0" />
            <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all text-sm font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {open && <AddHabitModal onClose={() => setOpen(false)} />}
    </>
  );
}
