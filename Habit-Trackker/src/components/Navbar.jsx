import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Cloud,
  CloudOff,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useSync } from "../context/SyncContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { isOnline, isSyncing } = useSync();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
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
      className={`sticky top-0 z-30 border-b border-zinc-200/60 bg-zinc-50/90 backdrop-blur-xl dark:border-white/5 dark:bg-[#080f26]/90 ${
        user ? "md:ml-[72px] md:w-[calc(100%-72px)]" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to={user ? "/dashboard" : "/"}
            className="group flex min-w-0 items-center gap-3 rounded-[24px] border border-white/10 bg-white/6 px-2 py-2 shadow-lg shadow-black/10 transition hover:bg-white/10 dark:border-white/8 dark:bg-white/4"
          >
            <div className="min-w-0 px-2 pr-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                  Verlocity
                </span>
                <Sparkles size={11} className="text-[rgb(var(--primary))]" />
              </div>
              <p className="hidden truncate text-sm font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 sm:block">
                Daily rhythm system
              </p>
            </div>
          </Link>

          {!loading && !user && (
            <div className="hidden items-center gap-1.5 rounded-full bg-zinc-100/80 p-1 dark:bg-zinc-900/70 md:flex">
              {[
                { to: "/how-to-use", label: "Guide" },
              ].map((item) => {
                const active = location.pathname === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {!loading && user && (
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-white/10 dark:border-white/8 md:inline-flex"
            >
              Dashboard
            </button>
          )}

          <div className="hidden md:inline-flex">
            <SyncStatus
              isOnline={isOnline}
              isSyncing={isSyncing}
              user={user}
            />
          </div>

          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            {loading ? (
              <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : user ? (
              <>
                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 py-1 pl-1 pr-1.5 shadow-sm shadow-black/10 dark:border-white/8">
                  <button
                    onClick={() => navigate(`/u/${user.username}`)}
                    className="rounded-full ring-2 ring-transparent transition hover:ring-[rgba(var(--primary),0.28)]"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="h-9 w-9 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-xs font-semibold text-white select-none">
                        {(user.name || user.username || "?")[0].toUpperCase()}
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Open menu"
                    className={`rounded-xl p-1.5 transition ${
                      open
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {open ? <X size={16} /> : <Menu size={16} />}
                  </button>
                </div>

                {open && (
                  <div className="absolute right-0 mt-2.5 w-48 overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                      <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {user.name || user.username}
                      </p>
                      <p className="truncate text-[11px] text-zinc-400">
                        @{user.username}
                      </p>
                    </div>
                    <NavItem
                      icon={<LayoutDashboard size={13} />}
                      label="Dashboard"
                      onClick={() => {
                        navigate("/dashboard");
                        setOpen(false);
                      }}
                    />
                    <NavItem
                      icon={<User size={13} />}
                      label="Profile"
                      onClick={() => {
                        navigate(`/u/${user.username}`);
                        setOpen(false);
                      }}
                    />
                    <div className="border-t border-zinc-100 dark:border-zinc-800">
                      <NavItem
                        icon={<LogOut size={13} />}
                        label="Logout"
                        danger
                        onClick={handleLogout}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-4 py-2 text-xs">
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
      <div
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ${accentTextMap[accentColor]} ${accentBgMap[accentColor]}`}
      >
        <RefreshCw size={12} className="animate-spin" />
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] sm:inline">
          Syncing
        </span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-amber-50/50 px-2.5 py-1.5 text-amber-500 dark:bg-amber-500/10">
        <CloudOff size={12} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
          Offline
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 opacity-60 transition-colors hover:opacity-100 ${accentTextMap[accentColor]}`}
    >
      <Cloud size={12} />
      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] sm:inline">
        Synced
      </span>
    </div>
  );
}

function NavItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition ${
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
