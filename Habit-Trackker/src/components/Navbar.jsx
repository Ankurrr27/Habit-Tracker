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
        bg-bg text-text
        border-b border-black/10
      "
    >
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          HabTrack
        </Link>

        {/* THEME TOGGLE */}
        <ThemeToggle />

        {/* RIGHT SIDE */}
        <div className="relative" ref={menuRef}>
          {loading ? (
            <span className="opacity-60 text-sm">…</span>
          ) : user ? (
            <>
              {/* AVATAR + MENU */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/u/${user.username}`)}
                  className="focus:outline-none"
                >
                  <img
                    src={user.avatar || "/avatar-placeholder.png"}
                    alt="avatar"
                    className="
                      w-8 h-8 rounded-full object-cover
                      border border-black/20
                      hover:opacity-90 transition
                    "
                  />
                </button>

                <button
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Open menu"
                  aria-expanded={open}
                  className={`
                    p-1.5 rounded transition
                    ${
                      open
                        ? "bg-primary/10 text-primary"
                        : "opacity-70 hover:opacity-100 hover:bg-primary/10"
                    }
                  `}
                >
                  <Menu size={18} />
                </button>
              </div>

              {/* DROPDOWN */}
              {open && (
                <div
                  className="
                    absolute right-0 mt-3 w-44
                    bg-bg text-text
                    border border-black/10
                    rounded-lg shadow-lg overflow-hidden
                  "
                >
                  <NavItem
                    icon={<Home size={14} />}
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
            /* NOT LOGGED IN */
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="opacity-70 hover:opacity-100 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-md bg-primary text-white hover:opacity-90 transition"
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
            : "hover:bg-primary/10 hover:text-primary"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
