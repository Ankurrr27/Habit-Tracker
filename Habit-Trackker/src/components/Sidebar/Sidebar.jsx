import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Download,
  Home,
  CalendarDays,
  LogOut,
  Plus,
  Search,
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
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR - FLUSH ELITE RAIL */}
      <aside className="
        hidden md:fixed md:top-0 md:left-0 md:flex md:flex-col
        md:h-screen w-[72px] shrink-0 z-20
        bg-slate-950/96 dark:bg-black
        px-3 py-5
        transition-colors
      ">



        {/* NAV */}
        <nav className="flex flex-1 flex-col gap-2.5">
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
        <div className="flex flex-col gap-3 pt-5">
          {/* Add Habit */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-white text-zinc-900 shadow-lg shadow-black/15 transition hover:opacity-90 active:scale-95 mx-auto dark:bg-zinc-100 dark:text-zinc-900"
            aria-label="Add habit"
          >
            <Plus size={18} strokeWidth={3} />
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => user?.username && navigate(`/u/${user.username}`)}
            className={`
              flex h-11 w-11 items-center justify-center overflow-hidden rounded-[18px] transition mx-auto
              ${
                isActive(`/u/${user?.username}`)
                  ? "bg-[rgba(var(--primary),0.14)] text-[rgb(var(--primary))] ring-2 ring-[rgba(var(--primary),0.18)]"
                  : "bg-slate-900 text-slate-200 hover:bg-slate-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              }
            `}
            aria-label="Open profile"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                {initials}
              </div>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex h-11 w-11 items-center justify-center rounded-[18px] text-zinc-400 transition hover:bg-red-50 hover:text-red-500 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 mx-auto"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="
        fixed inset-x-0 bottom-2 z-40 md:hidden
        bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl
        border-t border-zinc-100 dark:border-zinc-900/50
        px-4 py-3
      ">
        <div className="flex items-center justify-around gap-1">
          <MobileNavButton icon={<Search size={20} />} active={isActive("/users")} onClick={() => navigate("/users")} />
          <MobileNavButton icon={<Home size={20} />} active={isActive("/dashboard")} onClick={() => navigate("/dashboard")} />
          
          <button
            onClick={() => setOpen(true)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-white shadow-xl shadow-[rgba(var(--primary),0.3)] transition hover:opacity-90 active:scale-95 -translate-y-4"
          >
            <Plus size={20} strokeWidth={3} />
          </button>

          <MobileNavButton icon={<CalendarDays size={20} />} active={isActive("/calendar")} onClick={() => navigate("/calendar")} />
          
          <button
            onClick={() => user?.username && navigate(`/u/${user.username}`)}
            className={`
              flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl transition
              ${isActive(`/u/${user?.username}`)
                ? "bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))]"
                : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }
            `}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="P" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-[10px] font-bold text-white uppercase">
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
          ? "bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))]"
          : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }
      `}
    >
      {icon}
    </button>
  );
}
