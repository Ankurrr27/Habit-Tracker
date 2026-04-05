import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Download,
  Home,
  CalendarDays,
  LogOut,
  Plus,
  Search,
  Info,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useSync } from "../../context/SyncContext";
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

  const navItems = [
    { icon: <Home size={18} />, label: "Home", path: "/dashboard" },
    { icon: <CalendarDays size={18} />, label: "Calendar", path: "/calendar" },
    { icon: <Search size={18} />, label: "Search", path: "/users" },
    { icon: <Download size={18} />, label: "Extension", path: "/extension" },
    { icon: <Info size={18} />, label: "About", path: "/about" },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR - FLUSH ELITE RAIL */}
      <aside className="
        hidden md:fixed md:top-0 md:left-0 md:flex md:flex-col
        h-screen w-[60px] shrink-0 z-50
        bg-slate-900 dark:bg-black
        px-2 py-6
        transition-colors
      ">



        {/* NAV */}
        <nav className="flex flex-1 flex-col gap-3">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              compact
              icon={item.icon}
              label={item.label}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col gap-4 pt-6">
          {/* Add Habit */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xl shadow-black/10 transition hover:opacity-90 active:scale-95 mx-auto"
            aria-label="Add habit"
          >
            <Plus size={18} strokeWidth={3} />
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => user?.username && navigate(`/u/${user.username}`)}
            className={`
              flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl transition mx-auto
              ${
                isActive(`/u/${user?.username}`)
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 ring-2 ring-indigo-500/20"
                  : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              }
            `}
            aria-label="Open profile"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                {initials}
              </div>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-zinc-400 transition hover:bg-red-50 hover:text-red-500 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 mx-auto"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="
        fixed inset-x-0 bottom-0 z-40 md:hidden
        bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl
        border-t border-zinc-100 dark:border-zinc-900/50
        px-4 py-3
      ">
        <div className="flex items-center justify-around gap-1">
          <MobileNavButton icon={<Search size={20} />} active={isActive("/users")} onClick={() => navigate("/users")} />
          <MobileNavButton icon={<Home size={20} />} active={isActive("/dashboard")} onClick={() => navigate("/dashboard")} />
          
          <button
            onClick={() => setOpen(true)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95 -translate-y-4"
          >
            <Plus size={20} strokeWidth={3} />
          </button>

          <MobileNavButton icon={<CalendarDays size={20} />} active={isActive("/calendar")} onClick={() => navigate("/calendar")} />
          
          <button
            onClick={() => user?.username && navigate(`/u/${user.username}`)}
            className={`
              flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl transition
              ${isActive(`/u/${user?.username}`)
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }
            `}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="P" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase">
                {initials}
              </div>
            )}
          </button>
        </div>
      </nav>

      {open && <AddHabitModal onClose={() => setOpen(false)} />}
    </>
  );
}


function MobileNavButton({ icon, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex h-12 w-12 items-center justify-center rounded-2xl transition
        ${active
          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }
      `}
    >
      {icon}
    </button>
  );
}
