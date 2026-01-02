import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Home, LogOut, User, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  /* =====================
     CLOSE ON OUTSIDE CLICK
  ===================== */
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
      className="
        sticky top-0 z-40
        bg-white dark:bg-black
        border-b border-zinc-200 dark:border-zinc-800
      "
    >
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="
            text-lg font-semibold
            text-zinc-900 dark:text-white
            flex items-center gap-2
          "
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          HabTrack
        </Link>

        {/* THEME TOGGLE */}
        <ThemeToggle />

        {/* RIGHT SIDE */}
        <div className="relative" ref={menuRef}>
          {loading ? (
            <span className="text-zinc-500">…</span>
          ) : user ? (
            <>
              {/* AVATAR + HAMBURGER */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/u/${user.username}`)}
                  className="focus:outline-none"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="
        w-8 h-8 rounded-full object-cover
        border border-zinc-300 dark:border-zinc-700
        hover:opacity-90 transition
      "
                    />
                  ) : (
                    <div
                      className="
        w-8 h-8 rounded-full
        flex items-center justify-center
        bg-indigo-600 text-white
        text-sm font-semibold
        border border-zinc-300 dark:border-zinc-700
        select-none
      "
                    >
                      {(user.name || user.username || "?")[0].toUpperCase()}
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Open menu"
                  aria-expanded={open}
                  className={`
                    p-1.5 rounded transition
                    ${
                      open
                        ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }
                  `}
                >
                  <Menu size={18} />
                </button>
              </div>

              {/* DROPDOWN */}
              {/* {open && (
                <div
                  className="
                    absolute right-0 mt-3 w-44
                    bg-white dark:bg-zinc-900
                    border border-zinc-200 dark:border-zinc-800
                    rounded-lg shadow-lg overflow-hidden
                  "
                >
                  <NavItem
                    icon={<Home size={14} />}
                    label="Home"
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
              )} */}
            </>
          ) : (
            /* NOT LOGGED IN */
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* =====================
   DROPDOWN ITEM
===================== */
function NavItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-2 flex items-center gap-2 text-sm transition
        ${
          danger
            ? "text-red-500 hover:bg-red-500/10"
            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
