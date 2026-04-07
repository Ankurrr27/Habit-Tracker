import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { LayoutDashboard, LogOut, User, Menu, X, Zap, Cloud, CloudOff, RefreshCw } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useSync } from "../context/SyncContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { isOnline, isSyncing } = useSync();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`sticky top-0 z-30 bg-zinc-50/90 dark:bg-[#080f26]/90 backdrop-blur-xl border-b border-zinc-200/60 dark:border-indigo-900/30 ${
        user ? "md:ml-[60px] md:w-[calc(100%-60px)]" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Brand Gap if needed (was removed) */}
        <div></div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!loading && user && (
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden md:inline-flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            >
              Dashboard
            </button>
          )}

          <div className="mr-2 md:inline-flex">
            <SyncStatus isOnline={isOnline} isSyncing={isSyncing} user={user} />
          </div>

          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : user ? (
              <>
                <div className="flex items-center gap-1.5">
                  {/* Avatar */}
                  <button
                    onClick={() => navigate(`/u/${user.username}`)}
                    className="ring-2 ring-transparent hover:ring-indigo-500/30 rounded-full transition"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white select-none">
                        {(user.name || user.username || "?")[0].toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Menu toggle */}
                  <button
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Open menu"
                    className={`rounded-xl p-1.5 transition ${
                      open
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                        : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                  >
                    {open ? <X size={16} /> : <Menu size={16} />}
                  </button>
                </div>

                {open && (
                  <div className="absolute right-0 mt-2.5 w-44 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-900/10">
                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.name || user.username}</p>
                      <p className="text-[11px] text-zinc-400 truncate">@{user.username}</p>
                    </div>
                    <NavItem icon={<LayoutDashboard size={13} />} label="Dashboard" onClick={() => { navigate("/dashboard"); setOpen(false); }} />
                    <NavItem icon={<User size={13} />} label="Profile" onClick={() => { navigate(`/u/${user.username}`); setOpen(false); }} />
                    <div className="border-t border-zinc-100 dark:border-zinc-800">
                      <NavItem icon={<LogOut size={13} />} label="Logout" danger onClick={handleLogout} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition">Login</Link>
                <Link to="/register" className="rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function SyncStatus({ isOnline, isSyncing, user }) {
  const accentColor = user?.accentColor || "indigo";

  const accentTextMap = {
    indigo: "text-indigo-500 dark:text-indigo-400",
    pink: "text-pink-500 dark:text-pink-400",
    rose: "text-rose-500 dark:text-rose-400",
    sky: "text-sky-500 dark:text-sky-400",
    cyan: "text-cyan-500 dark:text-cyan-400",
    emerald: "text-emerald-500 dark:text-emerald-400",
    orange: "text-orange-500 dark:text-orange-400",
    violet: "text-violet-500 dark:text-violet-400",
  };

  const accentBgMap = {
    indigo: "bg-indigo-50/50 dark:bg-indigo-500/10",
    pink: "bg-pink-50/50 dark:bg-pink-500/10",
    rose: "bg-rose-50/50 dark:bg-rose-500/10",
    sky: "bg-sky-50/50 dark:bg-sky-500/10",
    cyan: "bg-cyan-50/50 dark:bg-cyan-500/10",
    emerald: "bg-emerald-50/50 dark:bg-emerald-500/10",
    orange: "bg-orange-50/50 dark:bg-orange-500/10",
    violet: "bg-violet-50/50 dark:bg-violet-500/10",
  };

  if (isSyncing) {
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${accentTextMap[accentColor]} ${accentBgMap[accentColor]}`}>
        <RefreshCw size={12} className="animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Syncing</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-amber-500 bg-amber-50/50 dark:bg-amber-500/10">
        <CloudOff size={12} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Offline</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${accentTextMap[accentColor]} transition-colors opacity-60 hover:opacity-100`}>
      <Cloud size={12} />
      <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Synced</span>
    </div>
  );
}

function NavItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition
        ${danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}
