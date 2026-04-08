import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Cloud,
  CloudOff,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useSync } from "../context/useSync";
import ThemeToggle from "./ThemeToggle";

const publicLinks = [{ to: "/how-to-use", label: "Guide" }];

function getPageMeta(pathname) {
  if (pathname.startsWith("/dashboard")) {
    return {
      kicker: "Workspace",
      title: "Dashboard",
      subtitle: "Track habits, tasks, and progress in one flow.",
    };
  }

  if (pathname.startsWith("/calendar")) {
    return {
      kicker: "Planning",
      title: "Calendar",
      subtitle: "Review daily completion with one consistent schedule view.",
    };
  }

  if (pathname.startsWith("/users")) {
    return {
      kicker: "Community",
      title: "People",
      subtitle: "Discover profiles and build your accountability circle.",
    };
  }

  if (pathname.startsWith("/extension")) {
    return {
      kicker: "Extension",
      title: "Browser Flow",
      subtitle: "Keep Verlocity close while you work across the web.",
    };
  }

  if (pathname.startsWith("/u/") || pathname.startsWith("/profile")) {
    return {
      kicker: "Identity",
      title: "Profile",
      subtitle: "Your public presence, linked platforms, and account settings.",
    };
  }

  return {
    kicker: "Verlocity",
    title: "Focused Daily System",
    subtitle: "A cleaner rhythm for habits, tasks, and long-term consistency.",
  };
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { isOnline, isSyncing } = useSync();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const pageMeta = getPageMeta(location.pathname);

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`sticky top-0 z-30 border-b border-zinc-200/70 bg-white/72 backdrop-blur-2xl dark:border-white/5 dark:bg-zinc-950/72 ${
        user ? "md:ml-[72px] md:w-[calc(100%-72px)]" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex min-w-0 flex-col rounded-2xl px-1 py-0.5 transition hover:bg-zinc-100/60 dark:hover:bg-white/5"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--primary))]">
              Verlocity
            </span>
            <span className="truncate text-[13px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50 sm:text-sm">
              Build steady momentum
            </span>
          </Link>

          {!loading && user && (
            <div className="hidden min-w-0 border-l border-zinc-200/70 pl-4 dark:border-zinc-800/80 lg:flex lg:flex-col">
              <span className="page-kicker !text-[0.62rem]">{pageMeta.kicker}</span>
              <span className="truncate text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {pageMeta.title}
              </span>
            </div>
          )}

          {!loading && !user && (
            <div className="hidden items-center gap-1.5 rounded-full bg-zinc-100/80 p-1 dark:bg-zinc-900/70 md:flex">
              {publicLinks.map((item) => {
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
          {!loading && user && location.pathname !== "/dashboard" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-secondary hidden px-3.5 py-2 text-[11px] lg:inline-flex"
            >
              Dashboard
            </button>
          )}

          <div className="hidden items-center gap-1 rounded-full bg-zinc-100/85 p-1 dark:bg-zinc-900/70 lg:flex">
            <SyncStatus isOnline={isOnline} isSyncing={isSyncing} />
            <ThemeToggle />
          </div>

          <div className="lg:hidden">
            <ThemeToggle />
          </div>

          <div className="relative" ref={menuRef}>
            {loading ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            ) : user ? (
              <>
                <div className="flex items-center gap-1 rounded-full border border-zinc-200/70 bg-white/80 p-1 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-950/70">
                  <button
                    onClick={() => navigate(`/u/${user.username}`)}
                    className="flex items-center gap-2 rounded-full pl-1 pr-2 transition hover:bg-zinc-100/80 dark:hover:bg-zinc-900"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="h-8 w-8 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-[11px] font-semibold text-white">
                        {(user.name || user.username || "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div className="hidden min-w-0 text-left xl:block">
                      <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {user.name || user.username}
                      </p>
                      <p className="truncate text-[11px] text-zinc-400">@{user.username}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOpen((currentValue) => !currentValue)}
                    aria-label="Open menu"
                    className={`rounded-full p-1.5 transition ${
                      open
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {open ? <X size={16} /> : <Menu size={16} />}
                  </button>
                </div>

                {open && (
                  <div className="absolute right-0 mt-2.5 w-52 overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900">
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
                  className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
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

function SyncStatus({ isOnline, isSyncing }) {
  if (isSyncing) {
    return (
      <div className="accent-bg-soft accent-text flex items-center gap-1.5 rounded-full px-2.5 py-1.5">
        <RefreshCw size={12} className="animate-spin" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
          Syncing
        </span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-amber-500 dark:bg-amber-500/10">
        <CloudOff size={12} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
          Offline
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
      <Cloud size={12} className="accent-text" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
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
