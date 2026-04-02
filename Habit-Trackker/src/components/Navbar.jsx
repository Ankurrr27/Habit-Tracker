import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { LayoutDashboard, LogOut, User, Menu } from "lucide-react";
import { useAuth } from "../context/useAuth";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
      className="
        sticky top-0 z-40
        border-b border-zinc-200/80
        bg-white/85 backdrop-blur
        dark:border-zinc-800 dark:bg-black/80
      "
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to={user ? "/dashboard" : "/"}
          className="
            flex items-center gap-2
            text-lg font-semibold text-zinc-900 dark:text-white
          "
        >
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          HabTrack
        </Link>

        <div className="flex items-center gap-3">
          {!loading && user && (
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900 md:inline-flex"
            >
              Dashboard
            </button>
          )}

          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            {loading ? (
              <span className="text-zinc-500">...</span>
            ) : user ? (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/u/${user.username}`)}
                    className="focus:outline-none"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="h-9 w-9 rounded-full border border-zinc-300 object-cover transition hover:opacity-90 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-indigo-600 text-sm font-semibold text-white select-none dark:border-zinc-700">
                        {(user.name || user.username || "?")[0].toUpperCase()}
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Open menu"
                    aria-expanded={open}
                    className={`
                      rounded-xl p-2 transition
                      ${
                        open
                          ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                      }
                    `}
                  >
                    <Menu size={18} />
                  </button>
                </div>

                {open && (
                  <div
                    className="
                      absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl
                      border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900
                    "
                  >
                    <NavItem
                      icon={<LayoutDashboard size={14} />}
                      label="Dashboard"
                      onClick={() => {
                        navigate("/dashboard");
                        setOpen(false);
                      }}
                    />

                    <NavItem
                      icon={<User size={14} />}
                      label="Profile"
                      onClick={() => {
                        navigate(`/u/${user.username}`);
                        setOpen(false);
                      }}
                    />

                    <NavItem
                      icon={<LogOut size={14} />}
                      label="Logout"
                      danger
                      onClick={handleLogout}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
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

function NavItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center gap-2 px-4 py-3 text-sm transition
        ${
          danger
            ? "text-red-500 hover:bg-red-500/10"
            : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
