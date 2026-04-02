import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Download,
  Home,
  CalendarDays,
  LogOut,
  Plus,
  Search,
  Users,
  Workflow,
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

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const initials = (user?.name || user?.username || "?")[0].toUpperCase();

  return (
    <>
      <aside className="hidden h-screen w-[72px] shrink-0 border-r border-zinc-200/70 bg-white/92 px-2 py-3 shadow-sm backdrop-blur md:sticky md:top-0 md:flex md:flex-col dark:border-zinc-800 dark:bg-black/92">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              aria-label="Go to dashboard"
            >
              HT
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-hidden">
            <SidebarItem
              compact
              icon={<Home size={20} />}
              label="Home"
              active={isActive("/dashboard")}
              onClick={() => navigate("/dashboard")}
            />

            <SidebarItem
              compact
              icon={<Users size={20} />}
              label="Teams"
              active={isActive("/teams")}
              onClick={() => navigate("/teams")}
            />

            <SidebarItem
              compact
              icon={<Workflow size={20} />}
              label="Projects"
              active={isActive("/projects")}
              onClick={() => navigate("/projects")}
            />

            <SidebarItem
              compact
              icon={<CalendarDays size={20} />}
              label="Calendar"
              active={isActive("/calendar")}
              onClick={() => navigate("/calendar")}
            />

            <SidebarItem
              compact
              icon={<Search size={20} />}
              label="Search"
              active={isActive("/users")}
              onClick={() => navigate("/users")}
            />

            <SidebarItem
              compact
              icon={<Download size={20} />}
              label="Download Extension"
              active={isActive("/extension")}
              onClick={() => navigate("/extension")}
            />
          </nav>

          <div className="space-y-1.5">
            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-full items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              aria-label="Add habit"
            >
              <Plus size={18} />
            </button>

            <button
              onClick={() => user?.username && navigate(`/u/${user.username}`)}
              className={`
                flex h-10 w-full items-center justify-center overflow-hidden rounded-xl border transition
                ${
                  isActive(`/u/${user?.username}`) || isActive("/profile")
                    ? "border-indigo-200 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10"
                    : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                }
              `}
              aria-label="Open profile"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white">
                  {initials}
                </div>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex h-10 w-full items-center justify-center rounded-xl text-zinc-500 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/80 bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden dark:border-zinc-800 dark:bg-black/95">
        <div className="mx-auto flex max-w-md items-center justify-between gap-1">
          <MobileNavButton
            icon={<Home size={18} />}
            label="Home"
            active={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          />
          <MobileNavButton
            icon={<Users size={18} />}
            label="Teams"
            active={isActive("/teams")}
            onClick={() => navigate("/teams")}
          />
          <button
            onClick={() => setOpen(true)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
            aria-label="Add habit"
          >
            <Plus size={18} />
          </button>
          <MobileNavButton
            icon={<CalendarDays size={18} />}
            label="Calendar"
            active={isActive("/calendar")}
            onClick={() => navigate("/calendar")}
          />
          <MobileNavButton
            icon={<Search size={18} />}
            label="Search"
            active={isActive("/users")}
            onClick={() => navigate("/users")}
          />
        </div>
      </nav>

      {open && <AddHabitModal onClose={() => setOpen(false)} />}
    </>
  );
}

function MobileNavButton({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition
        ${
          active
            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
            : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        }
      `}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
